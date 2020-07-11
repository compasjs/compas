import { Logger } from "@lbu/insight";
import { TemplateContext } from "@lbu/stdlib";
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
   * Return the template that should be used to mock this type
   */
  mock?: () => string;

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
 * Shared templateContext for all generators
 */
export const generatorTemplates: TemplateContext;

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
   * Some generators support so called stub generation.
   * This often outputs the types only and doesn't include any real code.
   */
  useStubGenerators?: boolean;

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
   * Add all groups and items to this App instance
   */
  extend(data: any): void;

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

  any(name?: string): AnyType;

  anyOf(name?: string): AnyOfType;

  array(name?: string): ArrayType;

  bool(name?: string): BooleanType;

  date(name?: string): DateType;

  generic(name?: string): GenericType;

  number(name?: string): NumberType;

  object(name?: string): ObjectType;

  reference(groupOrOther?: string | TypeBuilder, name?: string): ReferenceType;

  string(name?: string): StringType;

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
    disabled: {
      validator: false;
      mock: false;
    };
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
  default(rawString?: string): this;

  /**
   * Disable specific generators for this type. Not all generators support this feature
   */
  disable(values: Partial<typeof TypeBuilder.baseData.disabled>): this;

  /**
   * Returns a shallow copy of the data object
   */
  build(): Record<string, any>;

  /**
   * Raw mock string used with the 'mock' plugin.
   * Use '_mocker' or '__' to access the Chance instance
   */
  mock(mockFn: string): this;

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
   * Tag handlers are executed before group and specific route handlers
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
   * Route response type
   */
  response(builder: TypeBuilderLike): this;
}

export class RouteCreator {
  /**
   * Create a new route group
   * Path will be concatenated with the current path of this group
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
   * Validator enforces no extra keys
   */
  strict(): this;

  /**
   * Generate sql queries for this object
   * Posibbly adding createdAt and updatedAt fields.
   * When withHistory is true, it automatically enables withDates.
   * Added by the 'sql' plugin
   */
  enableQueries(options: { withHistory?: boolean; withDates?: boolean }): this;
}

export class ReferenceType extends TypeBuilder {
  set(group: string, name: string): this;

  field(referencing: string, replacement?: string): this;
}

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
