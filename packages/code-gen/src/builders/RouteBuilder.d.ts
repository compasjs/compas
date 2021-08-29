export class RouteBuilder extends TypeBuilder {
    constructor(method: any, group: any, name: any, path: any);
    queryBuilder: any;
    paramsBuilder: any;
    bodyBuilder: any;
    filesBuilder: any;
    responseBuilder: any;
    /**
     * @param {...string} values
     * @returns {RouteBuilder}
     */
    tags(...values: string[]): RouteBuilder;
    /**
     * Guarantee to the client that this call does not have any side-effects.
     * Can only be used for "POST" requests. Doesn't do anything to the generated router,
     * but some clients may use it to their advantage like the react-query generator.
     *
     * @returns {RouteBuilder}
     */
    idempotent(): RouteBuilder;
    /**
     * @param {import("../../index").TypeBuilderLike} builder
     * @returns {RouteBuilder}
     */
    query(builder: any): RouteBuilder;
    /**
     * @param {import("../../index").TypeBuilderLike} builder
     * @returns {RouteBuilder}
     */
    params(builder: any): RouteBuilder;
    /**
     * @param {import("../../index").TypeBuilderLike} builder
     * @returns {RouteBuilder}
     */
    body(builder: any): RouteBuilder;
    /**
     * @param {import("../../index").TypeBuilderLike} builder
     * @returns {RouteBuilder}
     */
    files(builder: any): RouteBuilder;
    /**
     * @param {import("../../index").TypeBuilderLike} builder
     * @returns {RouteBuilder}
     */
    response(builder: any): RouteBuilder;
}
export class RouteCreator {
    constructor(group: any, path: any);
    data: {
        group: any;
        path: any;
    };
    /** @type {string[]} */
    defaultTags: string[];
    queryBuilder: any;
    paramsBuilder: any;
    bodyBuilder: any;
    filesBuilder: any;
    responseBuilder: any;
    /**
     * @param {...string} values
     * @returns {RouteCreator}
     */
    tags(...values: string[]): RouteCreator;
    /**
     * @param {import("../../index").TypeBuilderLike} builder
     * @returns {RouteCreator}
     */
    query(builder: any): RouteCreator;
    /**
     * @param {import("../../index").TypeBuilderLike} builder
     * @returns {RouteCreator}
     */
    params(builder: any): RouteCreator;
    /**
     * @param {import("../../index").TypeBuilderLike} builder
     * @returns {RouteCreator}
     */
    body(builder: any): RouteCreator;
    /**
     * @param {import("../../index").TypeBuilderLike} builder
     * @returns {RouteCreator}
     */
    files(builder: any): RouteCreator;
    /**
     * @param {import("../../index").TypeBuilderLike} builder
     * @returns {RouteCreator}
     */
    response(builder: any): RouteCreator;
    /**
     * @param {string} name
     * @param {string} path
     * @returns {RouteCreator}
     */
    group(name: string, path: string): RouteCreator;
    /**
     * @param {string} [path]
     * @param {string} [name]
     * @returns {RouteBuilder}
     */
    get(path?: string | undefined, name?: string | undefined): RouteBuilder;
    /**
     * @param {string} [path]
     * @param {string} [name]
     * @returns {RouteBuilder}
     */
    post(path?: string | undefined, name?: string | undefined): RouteBuilder;
    /**
     * @param {string} [path]
     * @param {string} [name]
     * @returns {RouteBuilder}
     */
    put(path?: string | undefined, name?: string | undefined): RouteBuilder;
    /**
     * @param {string} [path]
     * @param {string} [name]
     * @returns {RouteBuilder}
     */
    patch(path?: string | undefined, name?: string | undefined): RouteBuilder;
    /**
     * @param {string} [path]
     * @param {string} [name]
     * @returns {RouteBuilder}
     */
    delete(path?: string | undefined, name?: string | undefined): RouteBuilder;
    /**
     * @param {string} [path]
     * @param {string} [name]
     * @returns {RouteBuilder}
     */
    head(path?: string | undefined, name?: string | undefined): RouteBuilder;
    /**
     * Create a new RouteBuilder and add the defaults if exists.
     *
     * @private
     *
     * @param {string} method
     * @param {string} group
     * @param {string} name
     * @param {string} path
     * @returns {RouteBuilder}
     */
    private create;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=RouteBuilder.d.ts.map