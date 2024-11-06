import { Postgres } from "packages/store/index";
import type { PendingQuery } from "postgres";

export type QueryPartArg =
	| string
	| boolean
	| number
	| null
	| undefined
	| Date
	| QueryPart
	| QueryPartArg[];

export interface QueryPart<T = any> {
	get strings(): string[];

	get values(): QueryPartArg[];

	append(query: QueryPart): QueryPart<T>;

	exec(sql: Postgres): PendingQuery<T>;
}

/**
 * Wrap query builder results
 */
export type WrappedQueryPart<Type = any> = {
	/**
	 * Get the underlying queryPart, representing the build query
	 */
	queryPart: QueryPart;

	/**
	 * @deprecated Use `.exec` or `.execRaw`
	 */
	then(): never;

	/**
	 * Exec the query and return validated query results.
	 */
	exec(sql: Postgres): Promise<Type[]>;

	/**
	 * Exec the query and return raw query results. This should be used when a custom 'select'
	 * or 'returning' is used.
	 */
	execRaw(sql: Postgres): Promise<Partial<Type>[]>;
};

/**
 * Wrap query builder results
 */
export type WrappedQueryResult<Type = any> = {
	/**
	 * Get the underlying queryPart, representing the build query
	 */
	queryPart: QueryPart;

	/**
	 * @deprecated Use `.exec` or `.execRaw`
	 */
	then(): never;

	/**
	 * Exec the query and return validated query results.
	 */
	exec(sql: Postgres): Promise<Type[]>;

	/**
	 * Exec the query and return raw query results. This should be used when a custom 'select'
	 * or 'returning' is used.
	 */
	execRaw(sql: Postgres): Promise<Type[]>;
};


// ------ QueryBuilder Type Resolver ------

/**
 * Utility type to resolve the full type instead of showing things like `Omit<Type,
 * SomeNesting<...>> & ...` in the type popups and errors.
 */
type _ResolveType<T> = { [K in keyof T]: T[K] } & {};

/**
 * Utility type to resolve the base + expansion of an entity.
 */
export type QueryBuilderDefinition<Base, Expansion> = {
	base: Base;
	expansion: Expansion;
};

type PickKeysThatExtend<T, Select> = {
	[K in keyof T as T[K] extends Select ? K : never]: T[K];
};

type OmitKeysThatExtend<T, Select> = {
	[K in keyof T as T[K] extends Select ? never : K]: T[K];
};

type ConvertNeverAndUndefined<T> =
	OmitKeysThatExtend<OmitKeysThatExtend<T, never>, undefined>
	& Partial<PickKeysThatExtend<T, undefined>>;

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
type ResolveJoinDepth = 6;

/**
 * Provided an QueryBuilder expansion object, determines the union of all possible joins up
 * until {@link ResolveJoinDepth} depth.
 */
export type ResolveOptionalJoins<
	Expansion,
	Prefix extends string = "",
	Depth extends Array<unknown> = [],
> = Depth["length"] extends ResolveJoinDepth
		? never
		: Expansion extends object
			? {
				[K in keyof Expansion]: K extends string
																? Expansion[K] extends {
																								 expansion: unknown;
																							 }
																	? Prefix extends "" // Base case
																		?
																		| `${K}`
																		| ResolveOptionalJoins<
																			Expansion[K]["expansion"],
																			`${K}`,
																			[unknown, ...Depth]
																		>
																		: // Nested case
																		| `${Prefix}.${K}` // Recursive into other expansions.
																		| ResolveOptionalJoins<
																			Expansion[K]["expansion"],
																			`${Prefix}.${K}`,
																			[unknown, ...Depth]
																		>
																	: never
																: never;
			}[keyof Expansion]
			: never;

/**
 * Split the input string on the first '.'-char.
 */
type SplitDot<Input extends string> = Input extends `${infer Start}.${string}`
																			? Start
																			: never;

/**
 * Check if the provided key is in one of the optional joins. This is also true when the key
 * is a prefix of a join. i.e `settings` is optional if `settings.user` is an optional join.
 */
type IsOptionalJoin<
	Key extends string,
	Joins extends string,
> = Key extends Joins ? true : Key extends SplitDot<Joins> ? true : false;

/**
 * Filters and strips the Joins that start with Prefix.
 */
type FilterOptionalJoins<Joins extends string, Prefix extends string> = {
	[K in Joins]: K extends `${Prefix}`
								? never
								: K extends `${Prefix}.${infer Suffix}`
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
																					 : SelectBuilder["select"] extends Array<infer K extends keyof Type>
																						 ? // Only select the fields that have been selected.
																						 Pick<Type, K>
																						 : never
																				 : // Defaults to selecting all fields.
																				 Type;

type ResolveBaseResult<Base, QueryBuilder, OptionalJoins extends string> = PickSelected<
	Omit<
		Base,
		Exclude<keyof QueryBuilder, QueryBuilderSpecialKeys> | OptionalJoins
	>,
	QueryBuilder
>

type ResolveTypeFromExpansion<DefinitionType, QueryBuilder, OptionalJoins extends string> = DefinitionType extends Array<infer SingleDefinition>
																																														? Array<QueryBuilderResolver<SingleDefinition, QueryBuilder, OptionalJoins>>
																																														: QueryBuilderResolver<DefinitionType, QueryBuilder, OptionalJoins>;

type ResolveExpansionKey<
	K extends (keyof Expansion & string),
	Base, Expansion, QueryBuilder,
	OptionalJoins extends string
> = K extends keyof QueryBuilder
		? ResolveTypeFromExpansion<
		Expansion[K],
		QueryBuilder[K],
		FilterOptionalJoins<OptionalJoins, K>
	>
		:
		IsOptionalJoin<K, OptionalJoins> extends true ?
		K extends keyof Base ?
		// We need to include the base type if it exists for owning sides of relations.
		| ResolveTypeFromExpansion<
			Expansion[K],
			unknown,
			FilterOptionalJoins<OptionalJoins, K>
		> | Base[K] | undefined
												 :
		| ResolveTypeFromExpansion<
			Expansion[K],
			unknown,
			FilterOptionalJoins<OptionalJoins, K>
		>
		| undefined
	: K extends keyof Base ? Base[K] : never;

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
		? _ResolveType<ResolveBaseResult<Base, QueryBuilder, OptionalJoins> &
			ConvertNeverAndUndefined<_ResolveType<{
				[K in Exclude<Exclude<
					keyof Expansion,
					QueryBuilderSpecialKeys
				>, number | symbol>]: _ResolveType<ResolveExpansionKey<K, Base, Expansion, QueryBuilder, OptionalJoins>>
			}>>>
		: never;
