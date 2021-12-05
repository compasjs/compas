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
  entityWhereInformation: EntityWhere | (() => EntityWhere),
  where: any,
  shortName: string,
): import("../types/advanced-types").QueryPart;
export type EntityWhere = {
  fieldSpecification: {
    tableKey: string;
    keyType: string;
    matchers: {
      matcherKey: string;
      matcherType:
        | "equal"
        | "notEqual"
        | "in"
        | "notIn"
        | "greaterThan"
        | "lowerThan"
        | "like"
        | "iLike"
        | "notLike"
        | "notILike"
        | "includeNotNull"
        | "isNull"
        | "isNotNull"
        | "via"
        | "notExists";
      relation: {
        entityName: string;
        shortName: string;
        entityKey: string;
        referencedKey: string;
        where: "self" | EntityWhere;
      };
    }[];
  }[];
};
//# sourceMappingURL=generator-helpers.d.ts.map
