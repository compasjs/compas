import { isNil } from "@lbu/stdlib";
import { ObjectType } from "../../builders/ObjectType.js";
import { TypeCreator } from "../../builders/TypeCreator.js";
import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/tag.js";
import { getTypeNameForType } from "../types.js";
import { importCreator } from "../utils.js";
import { getPrimaryKeyWithType, getQueryEnabledObjects } from "./utils.js";

/**
 * Generate query builders that include relations in to the query result via left joins
 *
 * @param {CodeGenContext} context
 */
export function generateQueryBuilders(context) {
  const builderPartials = [];
  const transformPartials = [];
  const names = [];

  const imports = importCreator();
  imports.destructureImport("query", `@lbu/store`);
  imports.destructureImport("isPlainObject", "@lbu/stdlib");
  imports.destructureImport("isNil", "@lbu/stdlib");

  for (const type of getQueryEnabledObjects(context)) {
    imports.destructureImport(
      `${type.name}Where`,
      `./query-partials${context.importExtension}`,
    );
    imports.destructureImport(
      `${type.name}OrderBy`,
      `./query-partials${context.importExtension}`,
    );

    names.push(`query${upperCaseFirst(type.name)}`);
    builderPartials.push(queryBuilderForType(context, imports, type));
    transformPartials.push(transformerForType(context, imports, type));
  }

  const contents = js`
    ${imports.print()}

    ${builderPartials}
    ${transformPartials}
  `;

  context.rootExports.push(
    `export { ${names.join(", ")} } from "./query-builder${
      context.importExtension
    }";`,
  );

  context.outputFiles.push({
    contents: contents,
    relativePath: `./query-builder${context.extension}`,
  });
}

/**
 * Generate the necessary query builder types
 * @param {CodeGenContext} context
 */
export function createQueryBuilderTypes(context) {
  const T = new TypeCreator();
  let joinIndex = 0;

  for (const type of getQueryEnabledObjects(context)) {
    // We use quick hacks with the AnyType, to use reuse the Where and QueryBuilder types.
    // This is necessary, since we don't add these types to the structure.

    const queryBuilderType = new ObjectType(
      type.group,
      `${type.name}QueryBuilder`,
    )
      .keys({
        where: T.any().raw(`${type.uniqueName}Where`).optional(),
        as: T.string().optional(),
        limit: T.number().optional(),
        offset: T.number().optional(),
      })
      .build();
    queryBuilderType.uniqueName = `${upperCaseFirst(
      queryBuilderType.group,
    )}${upperCaseFirst(queryBuilderType.name)}`;

    const queryTraverserType = new ObjectType(
      type.group,
      `${type.name}QueryTraverser`,
    )
      .keys({
        where: T.any().raw(`${type.uniqueName}Where`).optional(),
        limit: T.number().optional(),
        offset: T.number().optional(),
      })
      .build();
    queryTraverserType.uniqueName = `${upperCaseFirst(
      queryTraverserType.group,
    )}${upperCaseFirst(queryTraverserType.name)}`;

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

      queryBuilderType.keys[relation.ownKey] = T.any()
        .raw(
          `${upperCaseFirst(otherSide.group)}${upperCaseFirst(
            otherSide.name,
          )}QueryBuilder`,
        )
        .optional()
        .build();

      queryBuilderType.keys[`via${upperCaseFirst(relation.ownKey)}`] = T.any()
        .raw(
          `${upperCaseFirst(otherSide.group)}${upperCaseFirst(
            otherSide.name,
          )}QueryTraverser`,
        )
        .optional()
        .build();

      queryTraverserType.keys[`via${upperCaseFirst(relation.ownKey)}`] =
        queryBuilderType.keys[`via${upperCaseFirst(relation.ownKey)}`];

      relations[relation.ownKey] = {
        relation,
        otherSide,
        referencedKey,
        ownKey,
        joinKey: `ljl_${joinIndex++}`,
      };
    }

    type.queryBuilder = {
      type: getTypeNameForType(context, queryBuilderType, "", {
        useDefaults: false,
      }),
      traverseType: getTypeNameForType(context, queryTraverserType, "", {
        useDefaults: false,
      }),
      relations,
    };
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
  const nestedJoinPartials = [];
  const traverseJoinPartials = [];
  const { key: typePrimaryKey } = getPrimaryKeyWithType(type);

  for (const relationKey of Object.keys(type.queryBuilder.relations)) {
    const {
      relation,
      otherSide,
      referencedKey,
      ownKey,
      joinKey,
    } = type.queryBuilder.relations[relationKey];

    const selectValue = `to_jsonb(${otherSide.shortName}.*) || jsonb_build_object($\{query(
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

    let groupBy = ``;
    let orderBy = ``;
    let select = ``;

    if (relation.subType === "oneToMany") {
      select = `array_remove(array_agg(${selectValue} ORDER BY $\{${otherSide.name}OrderBy()}), NULL) as "result"`;
      groupBy = `GROUP BY ${type.shortName}."${typePrimaryKey}"`;
      orderBy = `ORDER BY ${type.shortName}."${typePrimaryKey}"`;
    } else {
      select = `${selectValue} as "result"`;
      orderBy = `ORDER BY $\{${otherSide.name}OrderBy()}`;
    }

    // Base with join keys
    const queryBuilderPart = js`
      if (builder.${relationKey}) {
        const joinedKeys = [];
        ${getLimitOffset()}

        ${Object.entries(otherSide.queryBuilder.relations).map(
          ([key, { joinKey: otherJoinKey, subType: otherSubType }]) => {
            const coalescedValue =
              otherSubType === "oneToMany"
                ? `coalesce("${otherJoinKey}"."result", '{}')`
                : `"${otherJoinKey}"."result"`;
            return `
            if (builder.${relationKey}.${key}) {
              joinedKeys.push("'" + (builder.${relationKey}.${key}?.as ?? "${key}") + "'", '${coalescedValue}');
            }
          `;
          },
        )}

        joinQb.append(query\`LEFT JOIN LATERAL (
          SELECT ${select} 
          $\{internalQuery${upperCaseFirst(
            otherSide.name,
          )}(builder.${relationKey},
                                                             query\`AND ${
                                                               otherSide.shortName
                                                             }."${referencedKey}" = ${
      type.shortName
    }."${ownKey}"\`
        )}
        ${groupBy}
        ${orderBy}
      $\{offsetLimitQb} 
        ) as "${joinKey}" ON TRUE\`);
      }
    `;

    const traverseJoinPart = js`
      if (builder.via${upperCaseFirst(relationKey)}) {
        builder.where = builder.where ?? {};

        ${getLimitOffset(true)}

        builder.where.${ownKey}In = query\`
          SELECT DISTINCT ${otherSide.shortName}."${referencedKey}"
           $\{internalQuery${upperCaseFirst(otherSide.name)}(
          builder.via${upperCaseFirst(relationKey)})}
           $\{offsetLimitQb} 
        \`;
      }
    `;

    traverseJoinPartials.push(traverseJoinPart);
    nestedJoinPartials.push(queryBuilderPart);
  }

  return js`

    /**
     * @param {${type.queryBuilder.type}|${
    type.queryBuilder.traverseType
  }} [builder={}]
     * @param {QueryPart} wherePartial
     * @returns {QueryPart}
     */
    function internalQuery${upperCaseFirst(
      type.name,
    )}(builder = {}, wherePartial) {
      let joinQb = query\`\`;

      ${traverseJoinPartials}
      ${nestedJoinPartials}

      return query\`
        FROM "${type.name}" ${type.shortName}
        $\{joinQb}
        WHERE $\{${type.name}Where(builder.where)} $\{wherePartial}
        \`;
    }

    /**
     * Query Builder for ${type.name}
     * Note that nested limit and offset don't work yet.
     *
     * @param {${type.queryBuilder.type}} [builder={}]
     * @returns {{
     *  exec: function(sql: Postgres): Promise<*[]>,
     *  execRaw: function(sql: Postgres): Promise<*[]>
     *  queryPart: QueryPart,
     * }}
     */
    export function query${upperCaseFirst(type.name)}(builder = {}) {
      const joinedKeys = [];

      ${Object.entries(type.queryBuilder.relations).map(
        ([key, { joinKey, subType }]) => {
          const coalescedValue =
            subType === "oneToMany"
              ? `coalesce("${joinKey}"."result", '{}')`
              : `"${joinKey}"."result"`;
          return `
            if (builder.${key}) {
              joinedKeys.push("'" + (builder.${key}?.as ?? "${key}") + "'", '${coalescedValue}');
            }
          `;
        },
      )}

      const qb = query\`
        SELECT to_jsonb(${type.shortName}.*) || jsonb_build_object($\{query(
        [ joinedKeys.join(",") ])}) as "result"
         $\{internalQuery${upperCaseFirst(type.name)}(builder)}
         ORDER BY $\{${type.name}OrderBy()}
        \`;

      if (!isNil(builder.offset)) {
        qb.append(query\`OFFSET $\{builder.offset}\`);
      }
      if (!isNil(builder.limit)) {
        qb.append(query\`FETCH NEXT $\{builder.limit} ROWS ONLY\`);
      }

      return {
        execRaw: (sql) => qb.exec(sql), exec: (sql) => {
          return qb.exec(sql).then(result => {
            transform${upperCaseFirst(type.name)}(result, builder);
            return result;
          });
        }, get queryPart() {
          return qb;
        }
      };
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
  for (const key of Object.keys(type.keys)) {
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
     *
     * @param {*[]} values
     * @param {${type.uniqueName}QueryBuilder=} builder
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
        `${path}.[key${depth}]`,
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
          `${path}.${key}`,
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
