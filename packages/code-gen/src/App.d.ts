/**
 * @class
 */
export class App {
  /**
   * @type {string[]}
   */
  static defaultEslintIgnore: string[];
  /**
   * Create a new App.
   *
   * @param {{ verbose?: boolean }} [options={}]
   */
  constructor(
    options?:
      | {
          verbose?: boolean | undefined;
        }
      | undefined,
  );
  /**
   * @private
   * @type {string}
   */
  private fileHeader;
  /**
   * @type {boolean}
   */
  verbose: boolean;
  /**
   * @type {Logger}
   */
  logger: Logger;
  /** @type {Set<TypeBuilderLike>} */
  unprocessedData: Set<TypeBuilderLike>;
  /** @type {import("./generated/common/types").CodeGenStructure} */
  data: import("./generated/common/types").CodeGenStructure;
  /**
   * @param {...TypeBuilderLike} builders
   * @returns {this}
   */
  add(...builders: TypeBuilderLike[]): this;
  /**
   * @param {Record<string, any>} obj
   * @returns {this}
   */
  addRaw(obj: Record<string, any>): this;
  /**
   * @param data
   * @returns {this}
   */
  extend(data: any): this;
  /**
   * Extend from the OpenAPI spec
   *
   * @param {string} defaultGroup
   * @param {Record<string, any>} data
   * @returns {this}
   */
  extendWithOpenApi(defaultGroup: string, data: Record<string, any>): this;
  /**
   * @param {import("./generator/openAPI").GenerateOpenApiOpts} options
   * @returns {Promise<void>}
   */
  generateOpenApi(
    options: import("./generator/openAPI").GenerateOpenApiOpts,
  ): Promise<void>;
  /**
   * @param {import("./generate-types").GenerateTypeOpts} options
   * @returns {Promise<void>}
   */
  generateTypes(
    options: import("./generate-types").GenerateTypeOpts,
  ): Promise<void>;
  /**
   * @param {GenerateOpts} options
   * @returns {Promise<void>}
   */
  generate(options: GenerateOpts): Promise<void>;
  /**
   * Internally used extend
   *
   * @private
   *
   * @param {Record<string, any>} rawStructure
   * @param {boolean} allowInternalProperties
   * @returns {this}
   */
  private extendInternal;
  /**
   * Process unprocessed list, normalize references
   * Depends on referentType being available
   *
   * @private
   */
  private processData;
  /**
   * @private
   * @param item
   */
  private addToData;
}
export type GenerateOpts = {
  /**
   * Enabling specific groups so different
   * generator combinations can be used. The machinery will automatically find
   * referenced types and include those If this is undefined, all groups will be
   * enabled.
   */
  enabledGroups?: string[] | undefined;
  isBrowser?: boolean | undefined;
  isNode?: boolean | undefined;
  isNodeServer?: boolean | undefined;
  /**
   * Options for conforming the output based on the
   * specified environment and runtime.
   */
  environment?:
    | {
        /**
         * Switch api client
         * generation and corresponding types based on the available globals.
         */
        clientRuntime?: "browser" | "react-native" | undefined;
      }
    | undefined;
  /**
   * Enabling specific generators.
   */
  enabledGenerators?:
    | ("type" | "validator" | "router" | "sql" | "apiClient" | "reactQuery")[]
    | undefined;
  /**
   * Enable Typescript for the generators
   * that support it
   */
  useTypescript?: boolean | undefined;
  /**
   * Dump a structure.js file with the used
   * structure in it.
   */
  dumpStructure?: boolean | undefined;
  /**
   * An api only variant of
   * 'dumpStructure'. Includes all referenced types by defined 'route' types.
   */
  dumpApiStructure?: boolean | undefined;
  /**
   * Dump a structure.sql based on all
   * 'enableQueries' object types.
   */
  dumpPostgres?: boolean | undefined;
  /**
   * Custom file header.
   */
  fileHeader?: string | undefined;
  /**
   * Directory to write files to. Note that this is
   * recursively cleaned before writing the new files.
   */
  outputDirectory: string;
  declareGlobalTypes?: false | undefined;
};
//# sourceMappingURL=App.d.ts.map
