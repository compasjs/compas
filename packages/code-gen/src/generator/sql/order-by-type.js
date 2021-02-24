import { merge } from "@compas/stdlib";
import { AnyOfType } from "../../builders/AnyOfType.js";
import { AnyType } from "../../builders/AnyType.js";
import { ArrayType } from "../../builders/ArrayType.js";
import { ObjectType } from "../../builders/ObjectType.js";
import { StringType } from "../../builders/StringType.js";
import { addToData } from "../../generate.js";
import { js } from "../tag/index.js";
import { getTypeNameForType } from "../types.js";
import { getPrimaryKeyWithType, getQueryEnabledObjects } from "./utils.js";
import { getSearchableFields } from "./where-type.js";

/**
 * Creates a order by type and assigns in to the object type
 *
 * @param {CodeGenContext} context
 */
export function createOrderByTypes(context) {
  const defaults = new StringType().optional().oneOf("foo").build();
  delete defaults.oneOf;

  for (const type of getQueryEnabledObjects(context)) {
    const fields = getSearchableFields(type);

    const fieldsArray = [];

    const orderByType = new AnyOfType(type.group, `${type.name}OrderBy`)
      .values()
      .build();

    const orderByArrayType = new ArrayType()
      .values(new StringType().oneOf("foo"))
      .build();
    const orderBySpecType = new ObjectType(
      type.group,
      `${type.name}OrderBySpec`,
    ).build();

    // Either a QueryPart or the an array of fields
    orderByType.values.push(
      {
        ...new AnyType().build(),
        rawValue: "QueryPart",
        rawValueImport: {
          javaScript: undefined,
          typeScript: `import { QueryPart } from "@compas/store";`,
        },
        rawValidator: "isQueryPart",
        rawValidatorImport: {
          javaScript: `import { isQueryPart } from "@compas/store";`,
          typeScript: `import { isQueryPart } from "@compas/store";`,
        },
      },
      orderByArrayType,
    );
    // Reset oneOf array
    orderByArrayType.values.oneOf = [];

    for (const key of Object.keys(fields)) {
      const fieldType = fields[key];

      const options = ["ASC", "DESC"];

      if (fieldType.isOptional) {
        if (
          (key !== "createdAt" && key !== "updatedAt" && key !== "deletedAt") ||
          (!type.queryOptions.withSoftDeletes && !type.queryOptions.withDates)
        )
          options.push(
            "ASC NULLS FIRST",
            "ASC NULLS LAST",
            "DESC NULLS FIRST",
            "DESC NULLS LAST",
          );
      }

      orderBySpecType.keys[key] = merge({}, defaults, { oneOf: options });
      orderByArrayType.values.oneOf.push(key);

      fieldsArray.push({
        key,
        optional: fieldType.isOptional,
        options,
      });
    }

    addToData(context.structure, orderByType);
    addToData(context.structure, orderBySpecType);

    type.orderBy = {
      type: getTypeNameForType(context, orderByType, "", {
        useDefaults: false,
      }),
      specType: getTypeNameForType(context, orderBySpecType, "", {
        useDefaults: false,
      }),
      fields: fieldsArray,
    };
  }
}

/**
 * A default ordering partial.
 * Working correctly, with or without dates. Supporting dynamic order by based on
 * searchable fields.
 *
 * @param {CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getOrderByPartial(context, type) {
  const { key: primaryKey } = getPrimaryKeyWithType(type);

  let defaultArray = "";
  const defaultSpec = "{}";
  if (type.queryOptions.withSoftDeletes || type.queryOptions.withDates) {
    defaultArray = `["createdAt", "updatedAt", "${primaryKey}"]`;
  } else {
    defaultArray = `["${primaryKey}"]`;
  }

  const partial = js`
   let i = 0;
   for (const value of orderBy) {
      if (i !== 0) {
        strings.push(", ");
        values.push(undefined);
      }
      i++;

     strings.push(\`$\{tableName}"$\{value}" \`, orderBySpec[value] ?? "ASC");
     values.push(undefined, undefined);
   }
  `;

  return js`
      /**
       * Build 'ORDER BY ' part for ${type.name}
       *
       * @param {${type.orderBy.type}} [orderBy=${defaultArray}]
       * @param {${type.orderBy.specType}} [orderBySpec=${defaultSpec}]
       * @param {string} [tableName="${type.shortName}."]
       * @param {{ skipValidator?: boolean|undefined }} [options={}]
       * @returns {QueryPart}
       */
      export function ${type.name}OrderBy(
         orderBy = ${defaultArray},
         orderBySpec = ${defaultSpec},
         tableName = "${type.shortName}.",
         options = {}
      ) {
         if (tableName.length > 0 && !tableName.endsWith(".")) {
            tableName = \`$\{tableName}.\`;
         }

         if (!options.skipValidator) {
            orderBy = validate${type.orderBy.type}(orderBy, "$.${type.orderBy.type}");
            orderBySpec = validate${type.orderBy.specType}(orderBySpec, "$.${type.orderBy.specType}");
         }

         if (isQueryPart(orderBy)) {
            return orderBy;
         }

         const strings = [];
         const values = [];

         ${partial}
         strings.push("");

         return query(strings, ...values);
      }
   `;
}
