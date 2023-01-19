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
  entityWhereInformation: EntityWhere | (() => EntityWhere),
  where: any,
  shortName: string,
): import("../types/advanced-types").QueryPart;
/**
 * Helper to generate update queries based on the dumped spec and the input data.
 * The input data is validated, so we can safely access it as 'any'.
 *
 * @param {EntityUpdate} entity
 * @param {*} input
 * @returns {import("../types/advanced-types").QueryPart<any[]>}
 */
export function generatedUpdateHelper(
  entity: EntityUpdate,
  input: any,
): import("../types/advanced-types").QueryPart<any[]>;
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
export type EntityUpdate = {
  schemaName: string;
  name: string;
  shortName: string;
  columns: string[];
  where: EntityWhere;
  injectUpdatedAt: boolean;
  fields: Record<
    string,
    {
      type: "boolean" | "number" | "string" | "date" | "jsonb";
      atomicUpdates: (
        | "$negate"
        | "$add"
        | "$subtract"
        | "$multiply"
        | "$divide"
        | "$append"
        | "$set"
        | "$remove"
      )[];
    }
  >;
};
export type EntityQueryBuilder = {
  name: string;
  shortName: string;
  columns: string[];
  orderBy?:
    | ((
        orderBy?: any[],
        orderBySpec?: any,
        shortName?: string,
        options?: {
          skipValidator?: boolean | undefined;
        },
      ) => import("../types/advanced-types").QueryPart)
    | undefined;
  orderByExperimental?:
    | ((
        orderBy?: any[],
        orderBySpec?: any,
        options?: {
          shortName?: string;
          skipValidator?: boolean | undefined;
        },
      ) => import("../types/advanced-types").QueryPart)
    | undefined;
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
