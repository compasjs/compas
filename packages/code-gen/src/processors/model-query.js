import {
  AnyOfType,
  AnyType,
  ArrayType,
  NumberType,
  ObjectType,
  ReferenceType,
} from "../builders/index.js";
import { databaseIsEnabled } from "../database/generator.js";
import { fileWriteRaw } from "../file/write.js";
import { typesTypescriptResolveFile } from "../types/typescript.js";
import { upperCaseFirst } from "../utils.js";
import {
  modelRelationGetInformation,
  modelRelationGetInverse,
  modelRelationGetOwn,
} from "./model-relation.js";
import { structureModels } from "./models.js";
import { referenceUtilsGetProperty } from "./reference-utils.js";
import { structureAddType } from "./structure.js";

/**
 * Build the 'queryXxx' input types for all models.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelQueryBuilderTypes(generateContext) {
  for (const model of structureModels(generateContext)) {
    const type = new ObjectType(model.group, `${model.name}QueryBuilder`)
      .keys({
        where: new ReferenceType(model.group, `${model.name}Where`).optional(),
        orderBy: new ReferenceType(
          model.group,
          `${model.name}OrderBy`,
        ).optional(),
        orderBySpec: new ReferenceType(
          model.group,
          `${model.name}OrderBySpec`,
        ).optional(),
        limit: new NumberType().min(1).optional(),
        offset: new NumberType().min(0).optional(),
        select: new ReferenceType(
          model.group,
          `${model.name}Returning`,
        ).default(JSON.stringify(Object.keys(model.keys))),
      })
      .build();

    for (const relation of modelRelationGetOwn(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      type.keys[relationInfo.keyNameOwn] = new ReferenceType( // @ts-expect-error
        relationInfo.modelInverse.group,
        `${relationInfo.modelInverse.name}QueryBuilder`,
      )
        .optional()
        .build();
    }

    for (const relation of modelRelationGetInverse(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      type.keys[relationInfo.virtualKeyNameInverse] = new ReferenceType( // @ts-expect-error
        relationInfo.modelOwn.group,
        `${relationInfo.modelOwn.name}QueryBuilder`,
      )
        .optional()
        .build();
    }

    structureAddType(generateContext.structure, type, {
      skipReferenceExtraction: true,
    });
  }
}

/**
 * Build the 'xxxQueryResult' output types for all models.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelQueryResultTypes(generateContext) {
  for (const model of structureModels(generateContext)) {
    const expansionType = new ObjectType(
      "queryExpansion",
      model.group + upperCaseFirst(model.name),
    )
      .keys({})
      .build();

    const type = new ObjectType(
      "queryResult",
      model.group + upperCaseFirst(model.name),
    )
      .keys({})
      .build();

    type.keys = {
      ...model.keys,
    };

    for (const relation of modelRelationGetOwn(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      const existingType = type.keys[relationInfo.keyNameOwn];
      const isOptional = referenceUtilsGetProperty(
        generateContext,
        type.keys[relationInfo.keyNameOwn],
        ["isOptional"],
      );

      const joinedType = new ReferenceType(
        "queryResult",
        `${relationInfo.modelInverse.group}${upperCaseFirst(
          relationInfo.modelInverse.name,
        )}`,
      ).build();

      const anyOfType = new AnyOfType().values(true);
      if (isOptional) {
        anyOfType.optional();
      }

      type.keys[relationInfo.keyNameOwn] = anyOfType.build();
      type.keys[relationInfo.keyNameOwn].values = [existingType, joinedType];

      const joinedExpansionType = getQueryDefinitionReference(
        relationInfo.modelInverse.group,
        relationInfo.modelInverse.name,
      );
      if (isOptional) {
        joinedExpansionType.optional();
      }

      expansionType.keys[relationInfo.keyNameOwn] = joinedExpansionType.build();
    }

    for (const relation of modelRelationGetInverse(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      const joinedType =
        relation.subType === "oneToMany" ?
          new ArrayType().values(
            new ReferenceType(
              "queryResult",
              `${relationInfo.modelOwn.group}${upperCaseFirst(
                relationInfo.modelOwn.name,
              )}`,
            ),
          )
        : new ReferenceType(
            "queryResult",
            `${relationInfo.modelOwn.group}${upperCaseFirst(relationInfo.modelOwn.name)}`,
          );

      type.keys[relationInfo.virtualKeyNameInverse] = joinedType
        .optional()
        .build();

      const joinedExpansionType =
        relation.subType === "oneToMany" ?
          new ArrayType().values(
            getQueryDefinitionReference(
              relationInfo.modelOwn.group,
              relationInfo.modelOwn.name,
            ),
          )
        : getQueryDefinitionReference(
            relationInfo.modelOwn.group,
            relationInfo.modelOwn.name,
          );

      if (relation.subType === "oneToOneReverse" && relation.isOptional) {
        // oneToMany's are never optional, since they then return an empty array. A oneToOne is
        // only optional if the owning side says so.
        joinedExpansionType.optional();
      }

      expansionType.keys[relationInfo.virtualKeyNameInverse] =
        joinedExpansionType.build();
    }

    structureAddType(generateContext.structure, type, {
      skipReferenceExtraction: true,
    });
    structureAddType(generateContext.structure, expansionType, {
      skipReferenceExtraction: true,
    });
  }
}

function getQueryDefinitionReference(group, name) {
  const resolvedName = `${upperCaseFirst(group)}${upperCaseFirst(name)}`;

  const implementation = {
    validatorInputType: `QueryDefinition${resolvedName}`,
    validatorOutputType: `QueryDefinition${resolvedName}`,
  };
  return new AnyType().implementations({
    js: implementation,
    ts: implementation,
  });
}

/**
 * Add raw types related to models and query builders
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelQueryRawTypes(generateContext) {
  if (!databaseIsEnabled(generateContext)) {
    return;
  }

  const file = typesTypescriptResolveFile(generateContext);

  if (generateContext.options.targetLanguage === "ts") {
    fileWriteRaw(
      file,
      `
/// ============================
/// Query builder resolver types

/**
 * Utility type to resolve the full type instead of showing things like \`Omit<Type,
 * SomeNesting<...>> & ...\` in the type popups and errors.
 */
type _ResolveType<T> = { [K in keyof T]: T[K] } & {};

/**
 * Utility type to resolve the base + expansion of an entity.
 */
interface QueryBuilderDefinition<Base, Expansion> {
  base: Base;
  expansion: Expansion;
}

/**
 * Omit never values
 */
type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

/**
 * Apply Partial if the type can be undefined.
 */
type ConvertUndefinedToPartial<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

type QueryBuilderSpecialKeys =
  | "offset"
  | "limit"
  | "orderBy"
  | "orderBySpec"
  | "select"
  | "where";

/**
 * Max value for which optional joins are resolved.
 */
type ResolveJoinDepth = 3;

type InferExpansionForOptionalJoins<Expansion> = Exclude<Expansion extends {
                                                                     expansion: infer Result;
                                                                   }
                                                         ? Result
                                                         : Expansion extends Array<{ expansion: infer Result }>
                                                           ? Result
                                                           : Expansion, undefined>;

/**
 * Provided an QueryBuilder expansion object, determines the union of all possible joins up
 * until {@link ResolveJoinDepth} depth.
 */
export type ResolveOptionalJoins<
  Expansion,
  Prefix extends string = "",
  Depth extends Array<unknown> = [],
  ResolvedExpansion = InferExpansionForOptionalJoins<Expansion>,
> = Depth["length"] extends ResolveJoinDepth
  ? never
  : {
        [K in keyof ResolvedExpansion]: K extends string
          ? Prefix extends "" // Base case
            ?
                | \`$\{K}\`
                | ResolveOptionalJoins<
                    ResolvedExpansion[K],
                    \`$\{K}\`,
                    [unknown, ...Depth]
                  >
            : // Nested case
              | \`$\{Prefix}.$\{K}\` // Recursive into other expansions.
                | ResolveOptionalJoins<
                    ResolvedExpansion[K],
                    \`$\{Prefix}.$\{K}\`,
                    [unknown, ...Depth]
                  >
          : never;
      }[keyof ResolvedExpansion];

/**
 * Split the input string on the first '.'-char.
 */
type SplitDot<Input extends string> = Input extends \`$\{infer Start}.$\{string}\`
  ? Start
  : never;

/**
 * Check if the provided key is in one of the optional joins. This is also true when the key
 * is a prefix of a join. i.e \`settings\` is optional if \`settings.user\` is an optional join.
 */
type IsOptionalJoin<
  Key extends string,
  Joins extends string,
> = Key extends Joins ? true : Key extends SplitDot<Joins> ? true : false;

/**
 * Filters and strips the Joins that start with Prefix.
 */
type FilterOptionalJoins<Joins extends string, Prefix extends string> = {
  [K in Joins]: K extends \`$\{Prefix}\`
    ? never
    : K extends \`$\{Prefix}.$\{infer Suffix}\`
      ? Suffix
      : never;
}[Joins];

/**
 * Pick the selected fields from the Type.
 * If no select field exists on the builder, or if "*" is supplied, the full Type is returned.
 */
type PickSelected<Type, SelectBuilder> = SelectBuilder extends {
  select: "*" | Array<string>;
}
  ? SelectBuilder["select"] extends "*" // Select all fields
    ? Type
    : SelectBuilder["select"] extends Array<infer K extends keyof Type> // Only select the fields
      ? // that have been selected.
        Pick<Type, K>
      : never // Defaults to selecting all fields.
  : Type;

type ResolveBaseResult<
  Base,
  QueryBuilder,
  OptionalJoins extends string,
> = OmitNever<
  ConvertUndefinedToPartial<
    PickSelected<
      Omit<
        Base,
        (keyof QueryBuilder) | OptionalJoins
      >,
      QueryBuilder
    >
  >
>;

type ResolveTypeFromExpansion<
  DefinitionType,
  QueryBuilder,
  OptionalJoins extends string,
> =
  DefinitionType extends Array<infer SingleDefinition>
    ? Array<QueryBuilderResolver<SingleDefinition, QueryBuilder, OptionalJoins>>
    : QueryBuilderResolver<DefinitionType, QueryBuilder, OptionalJoins>;

type ResolveExpansionKey<
  K extends keyof Expansion & string,
  Base,
  Expansion,
  QueryBuilder,
  OptionalJoins extends string,
> = K extends keyof QueryBuilder
  ? ResolveTypeFromExpansion<
      Expansion[K],
      QueryBuilder[K],
      FilterOptionalJoins<OptionalJoins, K>
    >
  : IsOptionalJoin<K, OptionalJoins> extends true
    ? K extends keyof Base
      ? // We need to include the base type if it exists for owning sides of relations.
        | ResolveTypeFromExpansion<
              Expansion[K],
              unknown,
              FilterOptionalJoins<OptionalJoins, K>
            >
          | Base[K]
          | undefined
      :
          | ResolveTypeFromExpansion<
              Expansion[K],
              unknown,
              FilterOptionalJoins<OptionalJoins, K>
            >
          | undefined
    : K extends keyof Base
      ? Base[K]
      : never;

/**
 * Provided a Definition and a QueryBuilder, resolves the return type.
 *
 * For usage of this type in  function parameter definitions, OptionalJoins can be supplied.
 */
export type QueryBuilderResolver<
  DefinitionType,
  QueryBuilder,
  OptionalJoins extends string = "",
> =
  DefinitionType extends QueryBuilderDefinition<infer Base, infer Expansion>
    ? _ResolveType<
        ResolveBaseResult<Base, QueryBuilder, OptionalJoins> &
          OmitNever<
            ConvertUndefinedToPartial<
              _ResolveType<{
                [K in Exclude<
                  Exclude<keyof Expansion, QueryBuilderSpecialKeys>,
                  number | symbol
                >]: ResolveExpansionKey<
                    K,
                    Base,
                    Expansion,
                    QueryBuilder,
                    OptionalJoins
                  >;
              }>
            >
          >
      >
    : DefinitionType extends undefined ? undefined : never;

/// End Query builder resolver types
/// ================================
`,
    );
  }

  const exportPrefix =
    generateContext.options.generators.types?.declareGlobalTypes ?
      ""
    : "export";

  for (const model of structureModels(generateContext)) {
    const name = `${upperCaseFirst(model.group)}${upperCaseFirst(model.name)}`;

    if (generateContext.options.targetLanguage === "ts") {
      fileWriteRaw(
        file,
        `${exportPrefix} interface QueryDefinition${name} { base: ${name}; expansion: QueryExpansion${name}; }\n`,
      );
      fileWriteRaw(
        file,
        `${exportPrefix} type ${name}OptionalJoins = ResolveOptionalJoins<QueryExpansion${name}>;\n`,
      );
      fileWriteRaw(
        file,
        `${exportPrefix} type ${name}QueryResolver<QueryBuilder extends ${name}QueryBuilder, const OptionalJoins extends ${name}OptionalJoins = never> = QueryBuilderResolver<QueryDefinition${name}, QueryBuilder, OptionalJoins>;\n\n`,
      );
    } else if (generateContext.options.targetLanguage === "js") {
      fileWriteRaw(
        file,
        `${exportPrefix} type QueryDefinition${name} = import("@compas/store").QueryBuilderDefinition<${name}, QueryExpansion${name}>;\n`,
      );
      fileWriteRaw(
        file,
        `${exportPrefix} type ${name}QueryResolver<QueryBuilder extends ${name}QueryBuilder, const OptionalJoins extends import("@compas/store").ResolveOptionalJoins<QueryExpansion${name}> = never> = import("@compas/store").QueryBuilderResolver<QueryDefinition${name}, QueryBuilder, OptionalJoins>;\n\n`,
      );
    }
  }
}
