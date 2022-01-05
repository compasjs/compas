// @ts-nocheck

import { isNil } from "@compas/stdlib";
import { ObjectType } from "../../builders/ObjectType.js";
import { TypeCreator } from "../../builders/TypeCreator.js";
import { addToData } from "../../generate.js";
import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/tag.js";
import { getTypeNameForType } from "../types.js";
import {
  getPrimaryKeyWithType,
  getQueryEnabledObjects,
  getSortedKeysForType,
} from "./utils.js";

/**
 * @typedef {import("../utils").ImportCreator} ImportCreator
 */

/**
 * Generate query builders that include relations in to the query result via left joins
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 * @param {string[]} src
 */
export function generateQueryBuilder(context, imports, type, src) {
  imports.destructureImport("query", `@compas/store`);
  imports.destructureImport("isPlainObject", "@compas/stdlib");
  imports.destructureImport("isNil", "@compas/stdlib");
  imports.destructureImport("AppError", "@compas/stdlib");

  src.push(queryBuilderForType(context, imports, type));
  src.push(transformerForType(context, imports, type));
}

/**
 * Generate the necessary query builder types
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function createQueryBuilderTypes(context) {
  const T = new TypeCreator();

  // We want to create unique join keys for the query builder.
  // To enforce uniqueness and to get stable output, we build unique names based on the
  // combination of `shortName1_shortName2`. We always go through our objects and
  // relations in the same order, so now only the join keys of affected tables will
  // change.
  const joinKeyMapping = new Map();

  // Short loop to setup the types
  for (const type of getQueryEnabledObjects(context)) {
    // We use quick hacks with the AnyType, to use reuse the Where and QueryBuilder
    // types. This is necessary, since we don't add these types to the structure.

    const queryBuilderType = new ObjectType(
      type.group,
      `${type.name}QueryBuilder`,
    )
      .keys({
        where: T.reference(type.group, `${type.name}Where`).optional(),
        orderBy: T.reference(type.group, `${type.name}OrderBy`).optional(),
        orderBySpec: T.reference(
          type.group,
          `${type.name}OrderBySpec`,
        ).optional(),
        as: T.string().optional(),
        limit: T.number().optional(),
        offset: T.number().optional(),
      })
      .build();

    addToData(context.structure, queryBuilderType);

    // Link reference manually
    queryBuilderType.keys.where.reference =
      context.structure[type.group][`${type.name}Where`];

    queryBuilderType.keys.orderBy.reference =
      context.structure[type.group][`${type.name}OrderBy`];
    queryBuilderType.keys.orderBySpec.reference =
      context.structure[type.group][`${type.name}OrderBySpec`];
  }

  // Longer loop that fills the type with the fields
  // At this point all types are added so we can resolve references as well
  for (const type of getQueryEnabledObjects(context)) {
    const queryBuilderType =
      context.structure[type.group][`${type.name}QueryBuilder`];

    const relations = {};

    for (const relation of type.relations) {
      const { key: primaryKey } = getPrimaryKeyWithType(type);
      const otherSide = relation.reference.reference;

      const referencedKey =
        ["oneToMany", "oneToOneReverse"].indexOf(relation.subType) !== -1
          ? relation.referencedKey
          : getPrimaryKeyWithType(otherSide).key;

      const ownKey =
        ["manyToOne", "oneToOne"].indexOf(relation.subType) !== -1
          ? relation.ownKey
          : primaryKey;

      queryBuilderType.keys[relation.ownKey] = {
        ...T.reference(otherSide.group, `${otherSide.name}QueryBuilder`)
          .optional()
          .build(),
        reference:
          context.structure[otherSide.group][`${otherSide.name}QueryBuilder`],
      };

      const joinKey = `${type.shortName}_${otherSide.shortName}`;
      if (!joinKeyMapping.has(joinKey)) {
        joinKeyMapping.set(joinKey, 0);
      }
      const joinKeyIdx = joinKeyMapping.get(joinKey);
      joinKeyMapping.set(joinKey, joinKeyIdx + 1);

      relations[relation.ownKey] = {
        relation,
        otherSide,
        referencedKey,
        ownKey,
        joinKey: `${joinKey}_${joinKeyIdx}`,
      };
    }

    type.queryBuilder = {
      type: undefined,
      relations,
    };
  }

  // Last for-loop to build the final types
  for (const type of getQueryEnabledObjects(context)) {
    const queryBuilderType =
      context.structure[type.group][`${type.name}QueryBuilder`];

    type.queryBuilder.type = getTypeNameForType(context, queryBuilderType, "", {
      useDefaults: false,
    });
  }
}

/**
 * Generate the query builder and traverse parts for a type
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function queryBuilderForType(context, imports, type) {
  imports.destructureImport(
    `validate${type.uniqueName}QueryBuilder`,
    `../${type.group}/validators${context.importExtension}`,
  );

  imports.destructureImport("generatedQueryBuilderHelper", "@compas/store");

  getTypeNameForType(context, {
    type: "any",
    uniqueName: `QueryResult${type.uniqueName}`,
    rawValue: `${type.uniqueName} & {
       ${Object.entries(type.queryBuilder.relations)
         .map(
           ([
             key,
             {
               otherSide,
               relation: { subType },
             },
           ]) => {
             if (subType === "oneToMany") {
               return `${key}?: QueryResult${otherSide.uniqueName}[]`;
             }
             return `${key}?: QueryResult${otherSide.uniqueName}|string|number`;
           },
         )
         .join(",\n")}
     }`,
    rawValueImport: {},
  });

  return js`
      ${dumpQueryBuilderSpec(context, imports, type)}

      /**
       * Query Builder for ${type.name}
       *
       * @param {${type.queryBuilder.type}} [builder={}]
       * @returns {{
       *  then: () => void,
       *  exec: (sql: Postgres) => Promise<QueryResult${type.uniqueName}[]>,
       *  execRaw: (sql: Postgres) => Promise<any[]>,
       *  queryPart: QueryPart<any>,
       * }}
       */
      export function query${upperCaseFirst(type.name)}(builder = {}) {
         const builderValidated = validate${
           type.uniqueName
         }QueryBuilder(builder, "$.${type.name}Builder");
         
         if (builderValidated.error){ 
           throw builderValidated.error;
         }
         builder = builderValidated.value;

         const qb = generatedQueryBuilderHelper(${
           type.name
         }QueryBuilderSpec, builder, {});

         return {
            then: () => {
               throw AppError.serverError({
                                             message: "Awaited 'query${upperCaseFirst(
                                               type.name,
                                             )}' directly. Please use '.exec' or '.execRaw'."
                                          });
            }, execRaw: async (sql) => await qb.exec(sql), exec: async (sql) => {
               const result = await qb.exec(sql);
               transform${upperCaseFirst(type.name)}(result, builder);
               return result;
            }, get queryPart() {
               return qb;
            }
         };
      }
   `;
}

/**
 * Create a constant with the query builder specification of this entity. To be used with
 * the generatedQueryBuilderHelper.
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function dumpQueryBuilderSpec(context, imports, type) {
  let str = `export const ${type.name}QueryBuilderSpec = {
  name: "${type.name}",
  shortName: "${
    type.shortName.endsWith(".")
      ? type.shortName.substring(0, type.shortName.length - 1)
      : type.shortName
  }",
  orderBy: ${type.name}OrderBy,
  where: ${type.name}WhereSpec,
  columns: [${Object.keys(type.keys)
    .map((it) => `"${it}"`)
    .join(", ")}],
  relations: [
`;

  for (const relationKey of Object.keys(type.queryBuilder.relations)) {
    const { relation, otherSide, referencedKey, ownKey } =
      type.queryBuilder.relations[relationKey];

    if (otherSide !== type) {
      imports.destructureImport(
        `${otherSide.name}QueryBuilderSpec`,
        `./${otherSide.name}.js`,
      );
    }

    str += `{
      builderKey: "${relationKey}",
      ownKey: "${ownKey}",
      referencedKey: "${referencedKey}",
      returnsMany: ${relation.subType === "oneToMany"},
      entityInformation: () => ${otherSide.name}QueryBuilderSpec,
    },`;
  }

  str += "],};";

  return str;
}

/**
 * Generate a transform for the passed in type
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function transformerForType(context, imports, type) {
  const partials = [];
  for (const key of getSortedKeysForType(type)) {
    const keyType = type.keys[key];

    if (keyType.isOptional && isNil(keyType.defaultValue)) {
      partials.push(`
        value.${key} = value.${key} ?? undefined;
      `);
    }

    traverseTypeForTransformer(keyType, `value.${key}`, partials, 0, new Set());
  }

  for (const relationKey of Object.keys(type.queryBuilder.relations)) {
    const { relation, otherSide } = type.queryBuilder.relations[relationKey];

    if (otherSide !== type) {
      imports.destructureImport(
        `transform${upperCaseFirst(otherSide.name)}`,
        `./${otherSide.name}.js`,
      );
    }

    const valueKey = `builder.${relationKey}?.as ?? "${relationKey}"`;

    partials.push(`
        value[${valueKey}] = value[${valueKey}] ?? undefined;
      `);

    if (relation.subType === "oneToMany") {
      partials.push(`
      if (Array.isArray(value[${valueKey}])) {
        transform${upperCaseFirst(
          otherSide.name,
        )}(value[${valueKey}], builder.${relationKey});
      }
    `);
    } else {
      partials.push(`
      if (isPlainObject(value[${valueKey}])) {
        let arr = [value[${valueKey}]];
        transform${upperCaseFirst(otherSide.name)}(arr, builder.${relationKey});
        value[${valueKey}] = arr[0];
      }
    `);
    }
  }

  return js`
      /**
       * NOTE: At the moment only intended for internal use by the generated queries!
       *
       * Transform results from the query builder that adhere to the known structure
       * of '${type.name}' and its relations.
       *
       * @param {any[]} values
       * @param {${type.uniqueName}QueryBuilder} [builder={}]
       */
      export function transform${upperCaseFirst(
        type.name,
      )}(values, builder = {}) {
         for (let i = 0; i < values.length; ++i) {
            let value = values[i];
            if (isPlainObject(value.result) && Object.keys(value).length === 1) {
               values[i] = value.result;
               value = value.result;
            }

            ${partials}
         }
      }
   `;
}

/**
 * Traverse nested types to do Date conversion.
 * We don't do null conversion, since we expect all nested types to not have a null value.
 *
 * @param {CodeGenType} type
 * @param {string} path
 * @param {string[]} partials
 * @param {number} depth Used for unique variables in loops
 * @param {Set} stack Used to ignore recursive types
 */
function traverseTypeForTransformer(type, path, partials, depth, stack) {
  if (type.enableQueries) {
    // We only have named transformers for query enabled objects
    return `transform${upperCaseFirst(type.name)}(${path});`;
  }

  if (stack.has(type)) {
    return;
  }

  stack.add(type);

  switch (type.type) {
    case "anyOf": {
      const partialLength = partials.length;
      for (const subType of type.values) {
        traverseTypeForTransformer(subType, path, partials, depth + 1, stack);
      }

      // Fixme: create an error or something out of this
      if (partialLength !== partials.length) {
        partials.push(
          `// Note: AnyOf types most likely won't work correctly, especially if it is a anyOf between a Date and string type.`,
        );
      }
      break;
    }
    case "array": {
      const subPartials = [];
      traverseTypeForTransformer(
        type.values,
        `${path}[idx${depth}]`,
        subPartials,
        depth + 1,
        stack,
      );
      if (subPartials.length > 0) {
        partials.push(js`
               if (Array.isArray(${path})) {
                  for (let idx${depth} = 0; idx${depth} < ${path}.length; idx${depth}++) {
                     ${subPartials}
                  }
               }
            `);
      }
      break;
    }
    case "date":
      partials.push(`
        if (typeof ${path} === "string") { 
          ${path} = new Date(${path});
        }
      `);
      break;
    case "generic": {
      const subPartials = [];
      traverseTypeForTransformer(
        type.values,
        `${path}[key${depth}]`,
        subPartials,
        depth + 1,
        stack,
      );
      if (subPartials.length > 0) {
        partials.push(js`
               if (isPlainObject(${path})) {
                  for (const key${depth} of Object.keys(${path})) {
                     ${subPartials}
                  }
               }
            `);
      }
      break;
    }
    case "object": {
      const subPartials = [];
      for (const key of Object.keys(type.keys)) {
        traverseTypeForTransformer(
          type.keys[key],
          `${path}["${key}"]`,
          subPartials,
          depth + 1,
          stack,
        );
      }
      if (subPartials.length > 0) {
        partials.push(js`
               if (isPlainObject(${path})) {
                  ${subPartials}
               }
            `);
      }

      break;
    }
    case "reference":
      traverseTypeForTransformer(
        type.reference,
        path,
        partials,
        depth + 1,
        stack,
      );
      break;
  }

  stack.delete(type);
}
