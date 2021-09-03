// @ts-nocheck

import { isNil } from "@compas/stdlib";
import { ObjectType } from "../../builders/ObjectType.js";
import { TypeCreator } from "../../builders/TypeCreator.js";
import { addToData } from "../../generate.js";
import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/tag.js";
import { getTypeNameForType } from "../types.js";
import { typeTable } from "./structure.js";
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
 * @param {CodeGenContext} context
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
 * @param {CodeGenContext} context
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

    const queryTraverserType = new ObjectType(
      type.group,
      `${type.name}QueryTraverser`,
    )
      .keys({
        where: T.reference(type.group, `${type.name}Where`).optional(),
        limit: T.number().optional(),
        offset: T.number().optional(),
      })
      .build();

    addToData(context.structure, queryBuilderType);
    addToData(context.structure, queryTraverserType);

    // Link reference manually
    queryBuilderType.keys.where.reference =
      context.structure[type.group][`${type.name}Where`];
    queryTraverserType.keys.where.reference =
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
    const queryTraverserType =
      context.structure[type.group][`${type.name}QueryTraverser`];

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

      queryBuilderType.keys[`via${upperCaseFirst(relation.ownKey)}`] = {
        ...T.reference(otherSide.group, `${otherSide.name}QueryTraverser`)
          .optional()
          .build(),
        reference:
          context.structure[otherSide.group][`${otherSide.name}QueryTraverser`],
      };

      queryTraverserType.keys[`via${upperCaseFirst(relation.ownKey)}`] =
        queryBuilderType.keys[`via${upperCaseFirst(relation.ownKey)}`];

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
      traverseType: undefined,
      relations,
    };
  }

  // Last for-loop to build the final types
  for (const type of getQueryEnabledObjects(context)) {
    const queryBuilderType =
      context.structure[type.group][`${type.name}QueryBuilder`];
    const queryTraverserType =
      context.structure[type.group][`${type.name}QueryTraverser`];

    type.queryBuilder.type = getTypeNameForType(context, queryBuilderType, "", {
      useDefaults: false,
    });

    type.queryBuilder.traverseType = getTypeNameForType(
      context,
      queryTraverserType,
      "",
      {
        useDefaults: false,
      },
    );
  }
}

/**
 * Generate the query builder and traverse parts for a type
 *
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function queryBuilderForType(context, imports, type) {
  imports.destructureImport(
    `validate${type.uniqueName}QueryBuilder`,
    `../${type.group}/validators${context.importExtension}`,
  );

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
      ${internalQueryBuilderForType(context, imports, type)}

      /**
       * Query Builder for ${type.name}
       * Note that nested limit and offset don't work yet.
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
         const joinedKeys = [];

         const builderValidated = validate${
           type.uniqueName
         }QueryBuilder(builder, "$.${type.name}Builder");
         
         if (builderValidated.error){ 
           throw builderValidated.error;
         }
         builder = builderValidated.value;

         ${Object.entries(type.queryBuilder.relations).map(
           ([
             key,
             {
               joinKey,
               relation: { subType },
             },
           ]) => {
             const coalescedValue =
               subType === "oneToMany"
                 ? `coalesce("${joinKey}"."result", '{}')`
                 : `"${joinKey}"."result"`;
             return `
            if (builder.${key}) {
              joinedKeys.push("'" + (builder.${key}?.as ?? "${key}") + "'", \`${coalescedValue}\`);
            }
          `;
           },
         )}

         const qb = query\`
        SELECT to_jsonb(${type.shortName}.*) || jsonb_build_object($\{query(
            [ joinedKeys.join(",") ])}) as "result"
         $\{internalQuery${upperCaseFirst(type.name)}(builder ?? {})}
         ORDER BY $\{${type.name}OrderBy(builder.orderBy, builder.orderBySpec)}
        \`;

         if (!isNil(builder.offset)) {
            qb.append(query\`OFFSET $\{builder.offset}\`);
         }
         if (!isNil(builder.limit)) {
            qb.append(query\`FETCH NEXT $\{builder.limit} ROWS ONLY\`);
         }

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
 * Create an internal query builder for the specified type
 * Handling all of the following:
 *    - Nested joins
 *    - Query traversal 'via'-queries
 *    - Self referencing tables, by generating the same function with a different
 * shortName
 *    - limit and offset
 *
 * Self referencing works now based on name shadowing
 *
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 * @param {string} shortName
 */
function internalQueryBuilderForType(
  context,
  imports,
  type,
  shortName = type.shortName,
) {
  const nestedJoinPartials = [];
  const traverseJoinPartials = [];
  let secondInternalBuilder = ``;

  for (const relationKey of Object.keys(type.queryBuilder.relations)) {
    const { relation, otherSide, referencedKey, ownKey, joinKey } =
      type.queryBuilder.relations[relationKey];

    // Determine shortName of other side of the relation
    const otherShortName =
      otherSide === type
        ? shortName === type.shortName
          ? `${type.shortName}2`
          : otherSide.shortName
        : otherSide.shortName;

    if (
      secondInternalBuilder === `` &&
      otherSide === type &&
      otherShortName !== type.shortName
    ) {
      // Generate another internal query builder with a different shortName
      // This way we can hop back and forth in self referencing queries
      secondInternalBuilder = internalQueryBuilderForType(
        context,
        imports,
        type,
        otherShortName,
      );
    }

    if (otherSide !== type) {
      imports.destructureImport(
        `internalQuery${upperCaseFirst(otherSide.name)}`,
        `./${otherSide.name}.js`,
      );
      imports.destructureImport(
        `${otherSide.name}OrderBy`,
        `./${otherSide.name}.js`,
      );
      imports.destructureImport(
        `transform${upperCaseFirst(otherSide.name)}`,
        `./${otherSide.name}.js`,
      );
    }

    const selectValue = `to_jsonb(${otherShortName}.*) || jsonb_build_object($\{query(
          [ joinedKeys.join(",") ])})`;

    const getLimitOffset = (isVia = false) => {
      const key = isVia ? `via${upperCaseFirst(relationKey)}` : relationKey;
      return `
let offsetLimitQb = !isNil(builder.${key}.offset) ? query\`OFFSET $\{builder.${key}.offset}\`
                                   : query\`\`;
if (!isNil(builder.${key}.limit)) {
  offsetLimitQb.append(query\`FETCH NEXT $\{builder.${key}.limit} ROWS ONLY\`)
}
`;
    };

    const orderBy = `ORDER BY $\{${otherSide.name}OrderBy(builder.${relationKey}.orderBy, builder.${relationKey}.orderBySpec, "${otherShortName}.")}`;

    let select = ``;
    let selectSuffix = ``;

    if (relation.subType === "oneToMany") {
      select = `ARRAY (SELECT ${selectValue}`;
      selectSuffix = `) as result`;
    } else {
      select = `${selectValue} as "result"`;
    }

    // Base with join keys
    const queryBuilderPart = js`
         if (builder.${relationKey}) {
            const joinedKeys = [];
            ${getLimitOffset()}

            ${Object.entries(otherSide.queryBuilder.relations).map(
              ([
                key,
                {
                  joinKey: otherJoinKey,
                  relation: { subType: otherSubType },
                },
              ]) => {
                const coalescedValue =
                  otherSubType === "oneToMany"
                    ? `coalesce("${otherJoinKey}"."result", '{}')`
                    : `"${otherJoinKey}"."result"`;
                return `
            if (builder.${relationKey}.${key}) {
              joinedKeys.push("'" + (builder.${relationKey}.${key}?.as ?? "${key}") + "'", \`${coalescedValue}\`);
            }
          `;
              },
            )}

            joinQb.append(query\`LEFT JOIN LATERAL (
          SELECT ${select} 
          $\{internalQuery${
            upperCaseFirst(otherSide.name) +
            (otherSide === type && otherShortName !== type.shortName ? "2" : "")
          }(
               builder.${relationKey} ?? {},
               query\`AND ${otherShortName}."${referencedKey}" = ${shortName}."${ownKey}"\`
            )}
        ${orderBy}
      $\{offsetLimitQb} 
        ${selectSuffix}) as "${joinKey}" ON TRUE\`);
         }
      `;

    // Note that we need to the xxxIn params first before we can add xxxIn and set it
    // to a query. The user may have set it to an array or another traverser may have
    // set a query object already. To get the same guarantees ('AND') we convert
    // arrays with values to a query part & if a query part exists, add 'INTERSECT'.
    let sqlCastType = typeTable[type.keys[ownKey].type];
    if (typeof sqlCastType === "function") {
      sqlCastType = sqlCastType(type.keys[ownKey], true);
    }
    const traverseJoinPart = js`
         if (builder.via${upperCaseFirst(relationKey)}) {
            builder.where = builder.where ?? {};

               // Prepare ${ownKey}In
            if (isQueryPart(builder.where.${ownKey}In)) {
               builder.where.${ownKey}In.append(query\` INTERSECT \`);
            } else if (Array.isArray(builder.where.${ownKey}In) &&
               builder.where.${ownKey}In.length > 0) {
               builder.where.${ownKey}In = query([
                                                    "(SELECT value::${sqlCastType} FROM(values (",
                                                    ...Array.from({ length: builder.where.${ownKey}In.length - 1 }).map(
                                                       () => "), ("),
                                                    ")) as ids(value)) INTERSECT "
                                                 ], ...builder.where.${ownKey}In)
            } else {
               builder.where.${ownKey}In = query\`\`;
            }

            ${getLimitOffset(true)}

            builder.where.${ownKey}In.append(query\`
          SELECT DISTINCT ${otherShortName}."${referencedKey}"
           $\{internalQuery${
             upperCaseFirst(otherSide.name) +
             (otherSide === type && otherShortName !== type.shortName
               ? "2"
               : "")
           }(
               builder.via${upperCaseFirst(relationKey)} ?? {})}
           $\{offsetLimitQb} 
        \`);
         }
      `;

    traverseJoinPartials.push(traverseJoinPart);
    nestedJoinPartials.push(queryBuilderPart);
  }

  return js`
      ${secondInternalBuilder}

      /**
       * @param {${type.queryBuilder.type} & ${
    type.queryBuilder.traverseType
  }} builder
       * @param {QueryPart|undefined} [wherePartial]
       * @returns {QueryPart}
       */
      export function internalQuery${
        upperCaseFirst(type.name) + (shortName !== type.shortName ? "2" : "")
      }(builder, wherePartial) {
         let joinQb = query\`\`;

         ${traverseJoinPartials}
         ${nestedJoinPartials}

         return query\`
        FROM ${type.queryOptions.schema}"${type.name}" ${shortName}
        $\{joinQb}
        WHERE $\{${type.name}Where(
            builder.where, "${shortName}.", { skipValidator: true })} $\{wherePartial}
        \`;
      }

   `;
}

/**
 * Generate a transform for the passed in type
 *
 * @param {CodeGenContext} context
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
