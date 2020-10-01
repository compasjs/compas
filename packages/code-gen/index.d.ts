import { Logger } from "@lbu/insight";
import { AxiosInstance } from "axios";

interface TypePlugin<T extends TypeBuilder> {
  name: string;
  class:
    | T
    | {
        Builder: T;
        [key: string]: any;
      };

  /**
   * Return the template that should be used to validate this type
   */
  validator?: () => string;

  /**
   * Return the template that should be used to create JSDoc for this type
   */
  jsType?: () => string;

  /**
   * Return the template that should be used to create Typescript types for this type.
   */
  tsType?: () => string;
}

export interface GeneratorPlugin {
  /**
   * Generator name
   */
  name: string;

  /**
   * Compile static templates and do other static checks
   */
  init?: () => void | Promise<void>;

  /**
   * Add dynamic types to app.
   * Can be called multiple times
   */
  preGenerate?: (
    app: App,
    data: object,
    options: GenerateOpts,
  ) => void | Promise<void>;

  /**
   * Compile dynamic templates, execute templates and return the GeneratedFiles
   * Can be called multiple times
   */
  generate?: (
    app: App,
    data: object,
    options: GenerateOpts,
  ) =>
    | GeneratedFile
    | GeneratedFile[]
    | Promise<GeneratedFile>
    | Promise<GeneratedFile[]>;
}

/**
 * Generator registry, with all core provided generators already added
 */
export const generators: Map<string, GeneratorPlugin>;

/**
 * Check if value may be output object from a TypeBuilder
 */
export function isNamedTypeBuilderLike(value: any): boolean;

/**
 * Load a LBU structure from an LBU enabled API
 */
export function loadFromRemote(axios: AxiosInstance, baseUrl: string): any;

/**
 * Try to convert a OpenAPI spec object to LBU structure
 * @param defaultGroup Default to group to use for non tagged items in the spec
 * @param data Raw OpenAPI 3 json object
 */
export function loadFromOpenAPISpec(defaultGroup: string, data: any): any;

interface AppOpts {
  verbose?: boolean;
}

interface GeneratedFile {
  /**
   * Relative path to the outputDirectory
   */
  path: string;

  /**
   * Generated source string
   */
  source: string;
}

interface GenerateOpts {
  /**
   * Enabling specific groups so different generator combinations can be used.
   * The machinery will automatically find referenced types and include those
   * If this is undefined, all groups will be enabled
   */
  enabledGroups?: string[];

  /**
   * Used to conditional generate various things.
   * Is inferred when the reactQuery generator is enabled.
   *   isBrowser: true,
   *   isNodeServer: false,
   *   isNode: false,
   *   enabledGenerators: ["type", "validator", "apiClient", "reactQuery"],
   *   useTypescript: true,
   *   dumpStructure: false,
   *   dumpPostgres: false,
   *   validatorCollectErrors: true,
   */
  isBrowser?: boolean;

  /**
   * Used to conditional generate various things.
   * Is inferred when the sql or router generator is enabled.
   * Has a higher precedence than isNode, but also implies isNode.
   *   isBrowser: false,
   *   isNodeServer: true,
   *   isNode: true,
   *   enabledGenerators: ["type", "validator", "sql", "router", "apiClient"],
   *   useTypescript: false,
   *   dumpStructure: true,
   *   dumpPostgres: true,
   *   validatorCollectErrors: false,
   */
  isNodeServer?: boolean;

  /**
   * Used to conditional generate various things.
   * Is inferred when the react-query generator is disabled.
   * Has a lower precedence than isServer.
   *   isBrowser: false,
   *   isNodeServer: false,
   *   isNode: true,
   *   enabledGenerators: ["type", "validator"],
   *   useTypescript: false,
   *   dumpStructure: false,
   *   dumpPostgres: false,
   *   validatorCollectErrors: true,
   */
  isNode?: boolean;

  /**
   * Enabling specific generators.
   * If this is undefined, all registered generators are enabled
   */
  enabledGenerators?: string[];

  /**
   * Enable Typescript for the generators that support it
   */
  useTypescript?: boolean;

  /**
   * Dump a structure.js file with the used payload in it
   */
  dumpStructure?: boolean;

  /**
   * Custom file header to for example disable linting or something
   */
  fileHeader?: string;

  /**
   * Directory to write the files to
   */
  outputDirectory: string;
}

/**
 * The entry-point to code generation
 * Provides the structure for creating types, and extending with external sources.
 * Also maintains the generators
 */
export class App {
  /**
   * List used in the file header to ignore some eslint rules
   */
  static defaultEslintIgnore: string[];

  /**
   * Enable more logging while generating
   */
  public verbose: boolean;

  /**
   * Internally used logger
   */
  public logger: Logger;

  /**
   * Create a new App instance and inits generators
   */
  static new(options: AppOpts): Promise<App>;

  /**
   * Add new TypeBuilders to this app
   */
  add(...builders: TypeBuilder[]): App;

  /**
   * Add a raw object to this app.
   * Note that it throws when you are not conforming to at least the structure from the
   * TypeBuilder
   */
  addRaw(obj: any): App;

  /**
   * Add all groups and items to this App instance
   */
  extend(data: any): App;

  /**
   * Call the generators with the provided options
   * and writes the output
   */
  generate(options: GenerateOpts): Promise<void>;
}

export type TypeBuilderLike =
  | boolean
  | number
  | string
  | TypeBuilderLikeArray
  | TypeBuilderLikeObject
  | TypeBuilder;

interface TypeBuilderLikeArray extends Array<TypeBuilderLike> {}

interface TypeBuilderLikeObject extends Record<string, TypeBuilderLike> {}

/**
 * Create new instances of registered types and manages grups
 * Also keeps a Map of registered types on TypeCreator.types
 *
 * Note that all functions that return a `T extends TypeBuilder` are dynamically added and
 * provided by the core.
 */
export class TypeCreator {
  /**
   * Registry of all type plugins
   */
  static types: Map<string, TypePlugin<any>>;

  constructor(group?: string);

  /**
   * Return a list of type plugins that have the specified property
   */
  static getTypesWithProperty(property: string): TypePlugin<any>[];

  /**
   * Create a new RouteCreator
   * Provided by the 'router' generator
   */
  router(path: string): RouteCreator;

  /**
   * Represents any type
   */
  any(name?: string): AnyType;

  /**
   * Represent one of the provided types.
   * @param name
   */
  anyOf(name?: string): AnyOfType;

  /**
   * Represents a plain array
   */
  array(name?: string): ArrayType;

  /**
   * Boolean support
   */
  bool(name?: string): BooleanType;

  /**
   * Inputs ISO dates or js Date objects
   * @param name
   */
  date(name?: string): DateType;

  /**
   * Formidable file object, Blob or Stream depending on the usecase
   * @param name
   */
  file(name?: string): FileType;

  /**
   * A generic object, where both keys and values can be typed
   */
  generic(name?: string): GenericType;

  /**
   * Any number, integer by default but floating point can be enabled
   * @param name
   */
  number(name?: string): NumberType;

  /**
   * Plain old js object
   */
  object(name?: string): ObjectType;

  /**
   * Omit keys from the provided object type
   */
  omit(name?: string): OmitType;

  /**
   * Make a copy of the provided type, making it optional
   */
  optional(name?: string): OptionalType;

  /**
   * Pick keys from the provided object type
   */
  pick(name?: string): PickType;

  /**
   * Reference any other type, as if it was created inline
   */
  reference(groupOrOther?: string | TypeBuilder, name?: string): ReferenceType;

  /**
   * SQL object relation modelling
   */
  relation(): RelationType;

  /**
   * Any string use case
   */
  string(name?: string): StringType;

  /**
   * Verified uuid
   */
  uuid(name?: string): UuidType;
}

/**
 * Provide base properties for types
 * This includes the 'type', optional, docs and default value.
 * Also contains group and name information
 */
export class TypeBuilder {
  static baseData: {
    type?: string;
    group?: string;
    name?: string;
    docString: string;
    isOptional: boolean;
    defaultValue?: string;
  };

  static getBaseData(): typeof TypeBuilder.baseData;

  /**
   * Create a new TypeBuilder for the provided group
   */
  constructor(type: string, group?: string, name?: string);

  public data: typeof TypeBuilder.baseData;

  /**
   * Add a doc comment, some generators / types may support rendering this
   */
  docs(docValue: string): this;

  /**
   * Value can be undefined
   */
  optional(): this;

  /**
   * Set a raw default value, also makes the type optional
   * Can be reverted by calling this function with undefined or null
   */
  default(rawString?: string | boolean | number): this;

  /**
   * Returns a shallow copy of the data object
   */
  build(): Record<string, any>;

  /**
   * Set this field as searchable for the 'sql' plugin
   */
  searchable(): this;

  /**
   * Set this field as primary for the 'sql' plugin
   */
  primary(): this;
}

/**
 * 'Router' plugin provided custom builder for api routes
 */
export class RouteBuilder extends TypeBuilder {
  /**
   * Add tags to this route.
   */
  tags(...value: string[]): this;

  /**
   * Type of accepted query parameters
   */
  query(builder: TypeBuilderLike): this;

  /**
   * Type of accepted path parameters
   */
  params(builder: TypeBuilderLike): this;

  /**
   * Type of accepted body parameters
   */
  body(builder: TypeBuilderLike): this;

  /**
   * Type of accepted file parameters
   */
  files(builder: TypeBuilderLike): this;

  /**
   * Route response type
   */
  response(builder: TypeBuilderLike): this;
}

export class RouteCreator {
  /**
   * Create a new route group.
   * Path will be concatenated with the current path of this group.
   * This resets the default tags, query, params, body and response type.
   */
  group(name: string, path: string): this;

  /**
   * GET route
   */
  get(path?: string, name?: string);

  /**
   * POST route
   */
  post(path?: string, name?: string);

  /**
   * PUT route
   */
  put(path?: string, name?: string);

  /**
   * DELETE route
   */
  delete(path?: string, name?: string);

  /**
   * HEAD route
   */
  head(path?: string, name?: string);

  /**
   * Default tags for all routes created by this RouteCreator.
   */
  tags(...value: string[]): this;

  /**
   * Default query type for all routes created by this RouteCreator.
   */
  query(builder: TypeBuilderLike): this;

  /**
   * Default params type for all routes created by this RouteCreator.
   */
  params(builder: TypeBuilderLike): this;

  /**
   * Default body type for all routes created by this RouteCreator.
   */
  body(builder: TypeBuilderLike): this;

  /**
   * Default files type for all routes created by this RouteCreator.
   */
  files(builder: TypeBuilderLike): this;

  /**
   * Default response type for all routes created by this RouteCreator.
   */
  response(builder: TypeBuilderLike): this;
}

export class AnyType extends TypeBuilder {
  typeOf(value: string): this;

  instanceOf(value: string): this;
}

export class AnyOfType extends TypeBuilder {
  values(...items: TypeBuilderLike[]): this;
}

export class ArrayType extends TypeBuilder {
  values(value: TypeBuilderLike): this;

  /**
   * Validator converts single item to an array
   */
  convert(): this;

  /**
   * Validator enforced minimum length inclusive
   */
  min(min: number): this;

  /**
   * Validator enforced maximum length inclusive
   */
  max(max: number): this;
}

export class BooleanType extends TypeBuilder {
  /**
   * Only accepts a specific value
   */
  oneOf(value: boolean): this;

  /**
   * Validator converts "true", "false", 0 and 1 to a boolean
   */
  convert(): this;
}

export class DateType extends TypeBuilder {
  defaultToNow(): this;
}

export class FileType extends TypeBuilder {}

export class GenericType extends TypeBuilder {
  keys(key: TypeBuilderLike): this;

  values(value: TypeBuilderLike): this;
}

export class NumberType extends TypeBuilder {
  /**
   * Only accepts a number from the provided set
   */
  oneOf(...value: number[]): this;

  /**
   * Try to convert a string to a number in the validator
   */
  convert(): this;

  /**
   * Validator enforced integer
   */
  integer(): this;

  /**
   * Validator enforced minimum value inclusive
   */
  min(min: number): this;

  /**
   * Validator enforced maximum value inclusive
   */
  max(max: number): this;
}

export class ObjectType extends TypeBuilder {
  keys(obj: Record<string, TypeBuilderLike>): this;

  /**
   * Validator allows extra keys on the incoming object
   */
  loose(): this;

  /**
   * Generate sql queries for this object
   * Posibbly adding createdAt and updatedAt fields.
   * When withSoftDeletes is true, it automatically enables withDates.
   * Added by the 'sql' plugin
   */
  enableQueries(options?: {
    withSoftDeletes?: boolean;
    withDates?: boolean;
  }): this;
}

export class OmitType extends TypeBuilder {
  /**
   * Set the object to operate on
   */
  object(builder: ObjectType | TypeBuilderLikeObject): this;

  /**
   * Keys to remove from the provided builder
   */
  keys(...keys: string[]): this;
}

export class OptionalType extends TypeBuilder {
  /**
   * Set the type to operate on
   */
  value(builder: TypeBuilderLike): this;
}

export class PickType extends TypeBuilder {
  /**
   * Set the object to operate on
   */
  object(builder: ObjectType | TypeBuilderLikeObject): this;

  /**
   * Keys to keep from the provided builder
   */
  keys(...keys: string[]): this;
}

/**
 * Stores information about a relation between 2 objects.
 * The App knows about a manyToOne relation will add the leftKey based on the rightKey if
 * needed. Other than that, this type does nothing by itself and should only aid when used by
 * another generator like the sql generator
 */
export class RelationType extends TypeBuilder {
  constructor();

  /**
   * Denote a 1-1 relation
   */
  oneToOne(
    left: TypeBuilder,
    leftKey: string,
    right: TypeBuilder,
    rightKey: string,
    substituteKey: string,
  ): this;

  /**
   * Denote a 1-N relation
   * i.e User (left) has multiple Item (right)
   */
  oneToMany(
    left: TypeBuilder,
    leftKey: string,
    right: TypeBuilder,
    rightKey: string,
    substituteKey: string,
  ): this;

  /**
   * Denote a N-1 relation
   * i.e Item (left) is owned by User (right)
   */
  manyToOne(
    left: TypeBuilder,
    leftKey: string,
    right: TypeBuilder,
    rightKey: string,
    substituteKey: string,
  ): this;
}

export class ReferenceType extends TypeBuilder {}

export class StringType extends TypeBuilder {
  /**
   * Only accepts a string from the provided set.
   * Also the way to make enums
   */
  oneOf(...values: string[]): this;

  /**
   * Validator tries to convert to string
   */
  convert(): this;

  /**
   * Validator trims the input
   */
  trim(): this;

  /**
   * Validator upper cases the input
   */
  upperCase(): this;

  /**
   * Validator lower cases the input
   */
  lowerCase(): this;

  /**
   * Validator enforced minimum length inclusive
   */
  min(min: number): this;

  /**
   * Validator enforced maximum length inclusive
   */
  max(max: number): this;

  /**
   * Validator enforced pattern
   */
  pattern(pattern: RegExp): this;
}

export class UuidType extends TypeBuilder {}

/**
 * Returns the list of groups that contain an item with the specified type.
 * Can be used to find all groups that expose part of the apiClient.
 */
export function getGroupsThatIncludeType(data: any, type: string): string[];
