import { AppError, isNil } from "@compas/stdlib";
import { isQueryPart, query } from "./query.js";

/**
 * @typedef {object} EntityWhere
 * @property {{
 *   tableKey: string,
 *   keyType: string,
 *   matchers: {
 *     matcherKey: string,
 *     matcherType: "equal"|"notEqual"|"in"|"notIn"|"greaterThan"|"lowerThan"|
 *                    "like"|"iLike"|"notLike"|"notILike"|
 *                    "includeNotNull"|"isNull"|"isNotNull"|
 *                    "via"|"notExists",
 *     relation: {
 *       entityName: string,
 *       shortName: string,
 *       entityKey: string,
 *       referencedKey: string,
 *       where: () => EntityWhere,
 *     },
 *   }[],
 * }[]} fieldSpecification
 */

/**
 * @typedef {object} EntityUpdate
 * @property {string} schemaName
 * @property {string} name
 * @property {string} shortName
 * @property {string[]} columns
 * @property {EntityWhere} where
 * @property {boolean} injectUpdatedAt
 * @property {Record<string, {
 *   type: "boolean"|"number"|"string"|"date"|"jsonb",
 *   atomicUpdates: ("$negate"|"$add"|"$subtract"|
 *       "$multiply"|"$divide"|
 *       "$append"|"$set"|"$remove")[]
 * }>} fields
 */

/**
 * @typedef {object} EntityQueryBuilder
 * @property {string} name
 * @property {string} shortName
 * @property {string[]} columns
 * @property {( orderBy?: any[],
 *   orderBySpec?: *,
 *   shortName?: string,
 *   options?: { skipValidator?: boolean|undefined },
 *   ) => import("../types/advanced-types").QueryPart} [orderBy]
 * @property {( orderBy?: any[],
 *   orderBySpec?: *,
 *   options?: { shortName?: string;  skipValidator?: boolean|undefined },
 *   ) => import("../types/advanced-types").QueryPart} [orderByExperimental]
 * @property {EntityWhere} where
 * @property {{
 *   builderKey: string,
 *   ownKey: string,
 *   referencedKey: string,
 *   returnsMany: boolean,
 *   entityInformation: () => EntityQueryBuilder,
 * }[]} relations
 */

/**
 * Builds a where clause based on the generated 'where' information.
 *
 * @param {EntityWhere|(()=>EntityWhere)} entityWhereInformation
 * @param {*} where
 * @param {string} shortName
 * @returns {import("../types/advanced-types").QueryPart}
 */
export function generatedWhereBuilderHelper(
  entityWhereInformation,
  where,
  shortName,
) {
  const strings = ["1 = 1"];
  /** @type {import("../types/advanced-types").QueryPartArg[]} */
  const values = [undefined];

  if (typeof entityWhereInformation === "function") {
    entityWhereInformation = entityWhereInformation();
  }

  // Raw where support
  if (!isNil(where.$raw) && isQueryPart(where.$raw)) {
    strings.push(" AND ");
    values.push(where.$raw);
  }

  // Nested
  if (Array.isArray(where.$or) && where.$or.length > 0) {
    strings.push(" AND ((");
    for (let i = 0; i < where.$or.length; i++) {
      // Is already validated, so just recurse into it.
      values.push(
        generatedWhereBuilderHelper(
          entityWhereInformation,
          where.$or[i],
          shortName,
        ),
      );

      if (i === where.$or.length - 1) {
        strings.push("))");
        values.push(undefined);
      } else {
        strings.push(") OR (");
      }
    }
  }

  for (const fieldSpec of entityWhereInformation.fieldSpecification) {
    for (const matcher of fieldSpec.matchers) {
      const matcherKeyExists = where[matcher.matcherKey] !== undefined;

      if (matcherKeyExists && matcher.matcherType === "equal") {
        // a.bar = 'foo'
        strings.push(` AND ${shortName}"${fieldSpec.tableKey}" = `);
        values.push(where[matcher.matcherKey]);
      } else if (matcherKeyExists && matcher.matcherType === "notEqual") {
        // a.id != 'foo'
        strings.push(` AND ${shortName}"${fieldSpec.tableKey}" != `);
        values.push(where[matcher.matcherKey]);
      } else if (matcherKeyExists && matcher.matcherType === "in") {
        if (isQueryPart(where[matcher.matcherKey])) {
          // a.id = ANY(select id from "x")
          strings.push(` AND ${shortName}"${fieldSpec.tableKey}" = ANY(`, ")");
          values.push(where[matcher.matcherKey], undefined);
        } else if (Array.isArray(where[matcher.matcherKey])) {
          // a.id = ANY(ARRAY[1,5,3]::int[])
          strings.push(` AND ${shortName}"${fieldSpec.tableKey}" = ANY(ARRAY[`);
          for (let i = 0; i < where[matcher.matcherKey].length; ++i) {
            values.push(where[matcher.matcherKey][i]);
            if (i !== where[matcher.matcherKey].length - 1) {
              strings.push(", ");
            }
          }
          strings.push(`]::${fieldSpec.keyType}[])`);
          if (where[matcher.matcherKey].length === 0) {
            values.push(undefined);
          }
          values.push(undefined);
        }
      } else if (matcherKeyExists && matcher.matcherType === "notIn") {
        if (isQueryPart(where[matcher.matcherKey])) {
          // a.id != ANY(select id from "x")
          strings.push(` AND ${shortName}"${fieldSpec.tableKey}" != ANY(`, ")");
          values.push(where[matcher.matcherKey], undefined);
        } else if (Array.isArray(where[matcher.matcherKey])) {
          // NOT a.id = ANY(ARRAY[1,5,3]::int[])
          strings.push(
            ` AND NOT ${shortName}"${fieldSpec.tableKey}" = ANY(ARRAY[`,
          );
          for (let i = 0; i < where[matcher.matcherKey].length; ++i) {
            values.push(where[matcher.matcherKey][i]);
            if (i !== where[matcher.matcherKey].length - 1) {
              strings.push(", ");
            }
          }
          strings.push(`]::${fieldSpec.keyType}[])`);
          if (where[matcher.matcherKey].length === 0) {
            values.push(undefined);
          }
          values.push(undefined);
        }
      } else if (matcherKeyExists && matcher.matcherType === "greaterThan") {
        // a.bar > 5
        strings.push(` AND ${shortName}"${fieldSpec.tableKey}" > `);
        values.push(where[matcher.matcherKey]);
      } else if (matcherKeyExists && matcher.matcherType === "lowerThan") {
        // a.bar < 5
        strings.push(` AND ${shortName}"${fieldSpec.tableKey}" < `);
        values.push(where[matcher.matcherKey]);
      } else if (matcherKeyExists && matcher.matcherType === "like") {
        // a.bar LIKE %xxx%
        strings.push(` AND ${shortName}"${fieldSpec.tableKey}" LIKE `);
        values.push(`%${where[matcher.matcherKey]}%`);
      } else if (matcherKeyExists && matcher.matcherType === "iLike") {
        // a.bar ILIKE %xxx%
        strings.push(` AND ${shortName}"${fieldSpec.tableKey}" ILIKE `);
        values.push(`%${where[matcher.matcherKey]}%`);
      } else if (matcherKeyExists && matcher.matcherType === "notLike") {
        // a.bar NOT LIKE %xxx%
        strings.push(` AND ${shortName}"${fieldSpec.tableKey}" NOT LIKE `);
        values.push(`%${where[matcher.matcherKey]}%`);
      } else if (matcherKeyExists && matcher.matcherType === "notILike") {
        // a.bar NOT ILIKE %xxx%
        strings.push(` AND ${shortName}"${fieldSpec.tableKey}" NOT ILIKE `);
        values.push(`%${where[matcher.matcherKey]}%`);
      } else if (matcher.matcherType === "includeNotNull") {
        if ((where[matcher.matcherKey] ?? false) === false) {
          // Used on soft delete tables, which by default don't return the soft deleted
          // records.
          strings.push(
            ` AND (${shortName}"${fieldSpec.tableKey}" IS NULL OR ${shortName}"${fieldSpec.tableKey}" > now()) `,
          );
          values.push(undefined);
        }
      } else if (matcherKeyExists && matcher.matcherType === "isNull") {
        // a.bar IS NULL
        strings.push(` AND ${shortName}"${fieldSpec.tableKey}" IS NULL `);
        values.push(undefined);
      } else if (matcherKeyExists && matcher.matcherType === "isNotNull") {
        // a.bar IS NOT NULL
        strings.push(` AND ${shortName}"${fieldSpec.tableKey}" IS NOT NULL `);
        values.push(undefined);
      } else if (matcherKeyExists && matcher.matcherType === "via") {
        const offsetLimit = !isNil(where[matcher.matcherKey]?.offset)
          ? query`OFFSET
        ${where[matcher.matcherKey]?.offset}`
          : query``;

        if (!isNil(where[matcher.matcherKey]?.limit)) {
          offsetLimit.append(
            query`FETCH NEXT ${where[matcher.matcherKey]?.limit} ROWS ONLY`,
          );
        }

        strings.push(
          ` AND ${shortName}"${matcher.relation.referencedKey}" = ANY (select ${matcher.relation.shortName}."${matcher.relation.entityKey}" FROM "${matcher.relation.entityName}" ${matcher.relation.shortName} WHERE `,
          ``,
          `)`,
        );

        values.push(
          generatedWhereBuilderHelper(
            matcher.relation.where(),
            where[matcher.matcherKey]?.where ?? {},
            `${matcher.relation.shortName}.`,
          ),
          offsetLimit,
          undefined,
        );
      } else if (matcherKeyExists && matcher.matcherType === "notExists") {
        strings.push(
          ` AND NOT EXISTS (SELECT FROM "${matcher.relation.entityName}" ${matcher.relation.shortName} WHERE `,
          ` AND ${matcher.relation.shortName}."${matcher.relation.entityKey}" = ${shortName}"${matcher.relation.referencedKey}")`,
        );
        values.push(
          generatedWhereBuilderHelper(
            matcher.relation.where(),
            where[matcher.matcherKey],
            `${matcher.relation.shortName}.`,
          ),
          undefined,
        );
      }
    }
  }

  strings.push("");
  return query(strings, ...values);
}

/**
 * Helper to generate update queries based on the dumped spec and the input data.
 * The input data is validated, so we can safely access it as 'any'.
 *
 * @param {EntityUpdate} entity
 * @param {*} input
 * @returns {import("../types/advanced-types").QueryPart<any[]>}
 */
export function generatedUpdateHelper(entity, input) {
  if (Object.keys(input.where).length === 0) {
    throw AppError.serverError({
      message: `Empty 'where' input when calling 'queries.${entity.name}Update', this is not allowed. If you need to update all records, use 'where: { $raw: query\`TRUE\`, }'.`,
    });
  }

  if (Object.keys(input.update).length === 0) {
    throw AppError.serverError({
      message: `Empty 'update' input when calling 'queries.${entity.name}Update'. Check if the 'input.update' value has any keys before calling.`,
    });
  }

  const strings = [
    `UPDATE ${entity.schemaName}"${entity.name}" ${entity.shortName}
     SET `,
  ];
  /** @type {any[]} */
  const args = [undefined];

  const state = {
    hasSet: false,
  };

  for (const [key, updateSpec] of Object.entries(input.update)) {
    // Can't update 'undefined', needs to be 'null' if allowed
    if (updateSpec === undefined) {
      continue;
    }

    // isPlainObject equivalent, but handling Object.create(null)
    if (
      !(
        typeof updateSpec === "object" &&
        !isNil(updateSpec) &&
        Object.prototype.toString.call(updateSpec) === "[object Object]"
      ) &&
      !Array.isArray(updateSpec)
    ) {
      strings.push(`${state.hasSet ? ", " : ""}"${key}" = `);
      args.push(updateSpec);
    } else if (Array.isArray(updateSpec)) {
      strings.push(`${state.hasSet ? ", " : ""}"${key}" = `);
      args.push(JSON.stringify(updateSpec));
    } else {
      let addedAtomicUpdate = false;

      const { atomicUpdates, type } = entity.fields[key];
      for (const atomicKey of atomicUpdates) {
        if (isNil(updateSpec[atomicKey])) {
          continue;
        }

        addedAtomicUpdate = true;

        if (type === "boolean") {
          if (atomicKey === "$negate" && updateSpec[atomicKey] === true) {
            strings.push(`${state.hasSet ? ", " : ""}"${key}" = NOT "${key}"`);
            args.push(undefined);
          }
        } else if (type === "number") {
          if (atomicKey === "$add") {
            strings.push(`${state.hasSet ? ", " : ""}"${key}" = "${key}" + `);
            args.push(updateSpec.$add);
          } else if (atomicKey === "$subtract") {
            strings.push(`${state.hasSet ? ", " : ""}"${key}" = "${key}" - `);
            args.push(updateSpec.$subtract);
          } else if (atomicKey === "$multiply") {
            strings.push(`${state.hasSet ? ", " : ""}"${key}" = "${key}" * `);
            args.push(updateSpec.$multiply);
          } else if (atomicKey === "$divide") {
            strings.push(`${state.hasSet ? ", " : ""}"${key}" = "${key}" / `);
            args.push(updateSpec.$divide);
          }
        } else if (type === "string") {
          if (atomicKey === "$append") {
            strings.push(`${state.hasSet ? ", " : ""}"${key}" = "${key}" || `);
            args.push(updateSpec.$append);
          }
        } else if (type === "date") {
          if (atomicKey === "$add") {
            strings.push(
              `${state.hasSet ? ", " : ""}"${key}" = "${key}" + `,
              `::interval`,
            );
            args.push(updateSpec.$add, undefined);
          } else if (atomicKey === "$subtract") {
            strings.push(
              `${state.hasSet ? ", " : ""}"${key}" = "${key}" - `,
              `::interval`,
            );
            args.push(updateSpec.$subtract, undefined);
          }
        } else if (type === "jsonb") {
          if (atomicKey === "$set") {
            strings.push(
              `${state.hasSet ? ", " : ""}"${key}" = jsonb_set("${key}", `,
              `, `,
              `)`,
            );
            args.push(
              `{${updateSpec.$set.path.join(",")}}`,
              JSON.stringify(updateSpec.$set.value),
              undefined,
            );
          } else if (atomicKey === "$remove") {
            strings.push(`${state.hasSet ? ", " : ""}"${key}" = "${key}" #- `);
            args.push(`{${updateSpec.$remove.path.join(",")}}`);
          }
        }
      }

      if (!addedAtomicUpdate) {
        strings.push(`${state.hasSet ? ", " : ""}"${key}" = `);
        args.push(JSON.stringify(updateSpec));
      }
    }

    state.hasSet = true;
  }

  if (entity.injectUpdatedAt && isNil(input.update.updatedAt)) {
    if (!state.hasSet) {
      strings.push(`"updatedAt" = `);
    } else {
      strings.push(`, "updatedAt" = `);
    }
    args.push(new Date());
  }

  strings.push(` WHERE `);
  args.push(
    generatedWhereBuilderHelper(
      entity.where,
      input.where ?? {},
      `${entity.shortName}.`,
    ),
  );

  if (input.returning === "*") {
    strings.push(` RETURNING *`);
    args.push(undefined);
  } else if (Array.isArray(input.returning)) {
    strings.push(
      ` RETURNING ${input.returning.map((it) => `"${it}"`).join(", ")}`,
    );
    args.push(undefined);
  }

  strings.push("");
  return query(strings, ...args);
}

/**
 * Helper to generate the correct queries to be used with the query builder.
 * Works with correlated sub queries to fetched nested result sets.
 *
 * Calls itself recursively with the entities that need to be included.
 *
 * @param {EntityQueryBuilder} entity
 * @param {*} builder
 * @param {{
 *   shortName?: string,
 *   wherePart?: string,
 *   nestedIndex?: number,
 * }} options
 * @returns {import("../types/advanced-types").QueryPart<any[]>}
 */
export function generatedQueryBuilderHelper(
  entity,
  builder,
  { shortName, wherePart, nestedIndex },
) {
  shortName = shortName ?? entity.shortName;
  nestedIndex = nestedIndex ?? 0;

  const strings = [];
  const args = [];

  // Filter fields to select from the builder.select that are not overwritten by a joined
  // relation.
  const tableColumns = builder.select.filter((it) => isNil(builder[it]));
  strings.push(
    ` SELECT ${tableColumns.map((it) => `${shortName}."${it}"`).join(", ")} `,
  );
  args.push(undefined);

  // Add sub selects for each relation that should be included
  for (const relation of entity.relations) {
    if (isNil(builder[relation.builderKey])) {
      continue;
    }

    const subEntity = relation.entityInformation();
    const subBuilder = builder[relation.builderKey];

    // Use a `shortName2` if it is the same table. This way we can work with shadowed
    // variables, without keeping track of them, since for joins we only need to know
    // this shortName and the nested shortName
    const otherShortName =
      subEntity !== entity
        ? subEntity.shortName
        : shortName === entity.shortName
        ? `${shortName}2`
        : entity.shortName;

    // We build a JSON object for all columns and it's relations, since sub queries need
    // to return a single column result.
    const columnObj = {};

    for (const column of subBuilder.select) {
      if (!isNil(subBuilder[column])) {
        // column is used is a joined relation
        continue;
      }
      columnObj[column] = `j${nestedIndex}."${column}"`;
    }

    for (const subRelation of subEntity.relations) {
      if (isNil(subBuilder[subRelation.builderKey])) {
        continue;
      }

      columnObj[
        subBuilder[subRelation.builderKey].as ?? subRelation.builderKey
      ] = `j${nestedIndex}."${
        subBuilder[subRelation.builderKey].as ?? subRelation.builderKey
      }"`;
    }

    const columns = Object.entries(columnObj)
      .map(([key, value]) => `'${key}', ${value}`)
      .join(",");

    // Recursively call the query builder.
    if (relation.returnsMany) {
      // For the same reason that we build an object, we aggregate it to an array here,
      // because sub queries need to return single column, single row result.
      strings.push(
        `, (select array(select jsonb_build_object(${columns}) FROM (`,
        `) j${nestedIndex})) as "${subBuilder.as ?? relation.builderKey}"`,
      );
      args.push(
        generatedQueryBuilderHelper(subEntity, subBuilder, {
          shortName: otherShortName,
          wherePart: ` ${shortName}."${relation.ownKey}" = ${otherShortName}."${relation.referencedKey}" `,
          nestedIndex: nestedIndex + 1,
        }),
        undefined,
      );
    } else {
      // Note that this will fail hard if the result contains more than a single row,
      // basically failing to hold up the contract with code-gen.

      strings.push(
        `, (select jsonb_build_object(${columns}) as "result" FROM (`,
        `) j${nestedIndex}) as "${subBuilder.as ?? relation.builderKey}" `,
      );
      args.push(
        generatedQueryBuilderHelper(subEntity, subBuilder, {
          shortName: otherShortName,
          wherePart: ` ${shortName}."${relation.ownKey}" = ${otherShortName}."${relation.referencedKey}" `,
          nestedIndex: nestedIndex + 1,
        }),
        undefined,
      );
    }
  }

  strings.push(` FROM "${entity.name}" ${shortName} `);
  args.push(undefined);

  strings.push(` WHERE `);
  args.push(
    generatedWhereBuilderHelper(
      entity.where,
      builder.where ?? {},
      `${shortName}.`,
    ),
  );

  if (wherePart) {
    strings.push(` AND ${wherePart}`);
    args.push(undefined);
  }

  strings.push(` ORDER BY `);
  if (entity.orderByExperimental) {
    args.push(
      entity.orderByExperimental(builder.orderBy, builder.orderBySpec, {
        shortName: `${shortName}.`,
        skipValidator: true,
      }),
    );
  } else if (entity.orderBy) {
    args.push(
      entity.orderBy(builder.orderBy, builder.orderBySpec, `${shortName}.`, {
        skipValidator: true,
      }),
    );
  }

  if (!isNil(builder.offset)) {
    strings.push(` OFFSET `);
    args.push(builder.offset);
  }
  if (!isNil(builder.limit)) {
    strings.push(` FETCH NEXT `, ` ROWS ONLY `);
    args.push(builder.limit, undefined);
  }

  strings.push("");

  return query(strings, ...args);
}
