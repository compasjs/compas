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
 * @typedef {object} EntityQueryBuilder
 * @property {string} name
 * @property {string} shortName
 * @property {string[]} columns
 * @property {( orderBy?: any[],
 *   orderBySpec?: *,
 *   shortName?: string,
 *   options?: { skipValidator?: boolean|undefined },
 *   ) => import("../types/advanced-types").QueryPart} orderBy
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
  entityWhereInformation: EntityWhere | (() => EntityWhere),
  where: any,
  shortName: string,
): import("../types/advanced-types").QueryPart;
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
  entity: EntityQueryBuilder,
  builder: any,
  {
    shortName,
    wherePart,
    nestedIndex,
  }: {
    shortName?: string;
    wherePart?: string;
    nestedIndex?: number;
  },
): import("../types/advanced-types").QueryPart<any[]>;
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
        where: () => EntityWhere;
      };
    }[];
  }[];
};
export type EntityQueryBuilder = {
  name: string;
  shortName: string;
  columns: string[];
  orderBy: (
    orderBy?: any[] | undefined,
    orderBySpec?: any,
    shortName?: string | undefined,
    options?:
      | {
          skipValidator?: boolean | undefined;
        }
      | undefined,
  ) => import("../types/advanced-types").QueryPart;
  where: EntityWhere;
  relations: {
    builderKey: string;
    ownKey: string;
    referencedKey: string;
    returnsMany: boolean;
    entityInformation: () => EntityQueryBuilder;
  }[];
};
//# sourceMappingURL=generator-helpers.d.ts.map
