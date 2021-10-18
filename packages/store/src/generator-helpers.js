import { isNil } from "../../stdlib/src/lodash.js";
import { isQueryPart, query } from "./query.js";

/**
 * @typedef {object} EntityWhere
 * @property {{
 *   tableKey: string,
 *   keyType: string,
 *   matchers: {
 *     matcherKey: string,
 *     matcherType: "equal"|"notEqual"|"in"|"notIn"|"greaterThan"|"lowerThan"|
 *                    "like"|"ilike"|"notLike"|"notILike"|
 *                    "includeNotNull"|"isNull"|"isNotNull"|
 *                    "exists"|"notExists",
 *     relation: {
 *       entityName: string,
 *       shortName: string,
 *       entityKey: string,
 *       referencedKey: string,
 *       where: "self"|EntityWhere,
 *     },
 *   }[],
 * }[]} fieldSpecification
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
  /** @type {QueryPartArg[]} */
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
      } else if (matcherKeyExists && matcher.matcherType === "ilike") {
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
          // Used on soft delete tables, which by default don't return the soft deleted records.
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
      } else if (matcherKeyExists && matcher.matcherType === "exists") {
        strings.push(
          ` AND EXISTS (SELECT FROM "${matcher.relation.entityName}" ${matcher.relation.shortName} WHERE `,
          ` AND ${matcher.relation.shortName}."${matcher.relation.entityKey}" = ${shortName}"${matcher.relation.referencedKey}")`,
        );
        values.push(
          generatedWhereBuilderHelper(
            matcher.relation.where === "self"
              ? entityWhereInformation
              : matcher.relation.where,
            where[matcher.matcherKey],
            `${matcher.relation.shortName}.`,
          ),
          undefined,
        );
      } else if (matcherKeyExists && matcher.matcherType === "notExists") {
        strings.push(
          ` AND NOT EXISTS (SELECT FROM "${matcher.relation.entityName}" ${matcher.relation.shortName} WHERE `,
          ` AND ${matcher.relation.shortName}."${matcher.relation.entityKey}" = ${shortName}"${matcher.relation.referencedKey}")`,
        );
        values.push(
          generatedWhereBuilderHelper(
            matcher.relation.where === "self"
              ? entityWhereInformation
              : matcher.relation.where,
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
