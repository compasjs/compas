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
    constructor({ verbose }?: {
        verbose?: boolean | undefined;
    } | undefined);
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
    /** @type {CodeGenStructure} */
    data: CodeGenStructure;
    /**
     * @param {...TypeBuilderLike} builders
     * @returns {this}
     */
    add(...builders: TypeBuilderLike[]): this;
    /**
     * Add relations to the provided reference.
     * The provided reference must already exist.
     * This only works when referencing in to structure that you've passed in to
     * `app.extend`.
     *
     * @param {ReferenceType} reference
     * @param {...import("./builders/RelationType").RelationType} relations
     */
    addRelations(reference: ReferenceType, ...relations: import("./builders/RelationType").RelationType[]): App;
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
     * @param {import("./generate-types").GenerateTypeOpts} options
     * @returns {Promise<void>}
     */
    generateTypes(options: import("./generate-types").GenerateTypeOpts): Promise<void>;
    /**
     * @param {GenerateOpts} options
     * @returns {Promise<void>}
     */
    generate(options: GenerateOpts): Promise<void>;
    /**
     * Internally used extend
     *
     * @param {Record<string, any>} rawStructure
     * @param {boolean} allowInternalProperties
     * @returns {this}
     */
    extendInternal(rawStructure: Record<string, any>, allowInternalProperties: boolean): this;
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
     * Enabling specific generators.
     */
    enabledGenerators?: string[] | undefined;
    /**
     * Enable Typescript for the generators
     * that support it
     */
    useTypescript?: boolean | undefined;
    /**
     * Generate throwing validators, this
     * is expected by the router and sql generator.
     */
    throwingValidators?: boolean | undefined;
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
};
import { ReferenceType } from "./builders/ReferenceType.js";
//# sourceMappingURL=App.d.ts.map