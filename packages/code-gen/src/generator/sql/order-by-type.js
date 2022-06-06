// @ts-nocheck

import { merge } from "@compas/stdlib";
import { AnyOfType } from "../../builders/AnyOfType.js";
import { AnyType } from "../../builders/AnyType.js";
import { ArrayType } from "../../builders/ArrayType.js";
import { ObjectType } from "../../builders/ObjectType.js";
import { ReferenceType } from "../../builders/ReferenceType.js";
import { StringType } from "../../builders/StringType.js";
import { structureAddType } from "../../structure/structureAddType.js";
import { js } from "../tag/index.js";
import { getTypeNameForType } from "../types.js";
import { getPrimaryKeyWithType, getQueryEnabledObjects } from "./utils.js";
import { getSearchableFields } from "./where-type.js";

/**
 * Creates a order by type and assigns in to the object type
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function createOrderByTypes(context) {
  const orderByType = new StringType("compas", "sqlOrderBy")
    .oneOf("ASC", "DESC")
    .build();

  const orderByOptionalField = new StringType(
    "compas",
    "sqlOrderByOptionalField",
  )
    .oneOf("ASC", "DESC", "ASC NULLS FIRST", "DESC NULLS LAST")
    .build();

  const orderByReference = new ReferenceType("compas", "sqlOrderBy")
    .optional()
    .build();
  const orderByOptionalFieldReference = new ReferenceType(
    "compas",
    "sqlOrderByOptionalField",
  )
    .optional()
    .build();

  if (getQueryEnabledObjects(context).length > 0) {
    // Since this parent function is hit even if no query enabled objects are provided,
    // we only register them conditionally, since they are also only used conditionally
    structureAddType(context.structure, orderByType);
    structureAddType(context.structure, orderByOptionalField);
  }

  for (const type of getQueryEnabledObjects(context)) {
    const fields = getSearchableFields(type);

    const fieldsArray = [];

    // AnyOf: QueryPart & an array of searchable fields
    const orderByType = new AnyOfType(type.group, `${type.name}OrderBy`)
      .values()
      .build();

    // Array of searchable fields
    const orderByArrayType = new ArrayType()
      .values(new StringType().oneOf("foo"))
      .build();

    // Reset searchable fields array
    orderByArrayType.values.oneOf = [];

    // Object mapping searchable fields to possible values
    const orderBySpecType = new ObjectType(
      type.group,
      `${type.name}OrderBySpec`,
    ).build();

    // Either a QueryPart or the an array of fields
    orderByType.values.push(
      {
        ...new AnyType().build(),
        rawValue: "QueryPart<any>",
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

    for (const key of Object.keys(fields)) {
      const fieldType = fields[key];

      let usedReference = orderByReference;

      if (
        fieldType.isOptional &&
        ((key !== "createdAt" && key !== "updatedAt") ||
          (!type.queryOptions.withSoftDeletes && !type.queryOptions.withDates))
      ) {
        usedReference = orderByOptionalFieldReference;
      }

      orderBySpecType.keys[key] = merge({}, usedReference);
      orderBySpecType.keys[key].reference =
        context.structure["compas"][usedReference.reference.name];

      orderByArrayType.values.oneOf.push(key);

      fieldsArray.push({
        key,
        optional: fieldType.isOptional,
      });
    }

    structureAddType(context.structure, orderByType);
    structureAddType(context.structure, orderBySpecType);

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
 * @param {import("../../generated/common/types").CodeGenContext} context
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
    export function ${type.name}OrderBy(orderBy = ${defaultArray},
                                        orderBySpec = ${defaultSpec},
                                        tableName = "${type.shortName}.",
                                        options = {}
    ) {
      if (tableName.length > 0 && !tableName.endsWith(".")) {
        tableName = \`$\{tableName}.\`;
      }

      if (!options.skipValidator) {
        const orderByValidated = validate${type.orderBy.type}(
          orderBy, "$.${type.orderBy.type}");
        if (orderByValidated.error) {
          throw orderByValidated.error;
        }
        orderBy = orderByValidated.value;

        const orderBySpecValidated = validate${type.orderBy.specType}(
          orderBySpec, "$.${type.orderBy.specType}");
        if (orderBySpecValidated.error) {
          throw orderBySpecValidated.error;
        }
        orderBySpec = orderBySpecValidated.value;
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
