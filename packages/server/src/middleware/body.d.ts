/**
 * Creates a body parser and a body parser with multipart enabled.
 * Note that koa-body parses url-encoded, form data, json and text by default.
 *
 * @since 0.1.0
 *
 * @param {KoaBodyOptions} [bodyOpts={}] Options that will be passed to koa-body
 * @param {formidable.Options} [multipartBodyOpts={}] Options that will be passed to
 *   formidable
 * @returns {BodyParserPair}
 */
export function createBodyParsers(bodyOpts?: KoaBodyOptions | undefined, multipartBodyOpts?: formidable.Options | undefined): BodyParserPair;
export type Middleware = import("koa").Middleware;
export type KoaBodyOptions = {
    urlencoded?: boolean | undefined;
    json?: boolean | undefined;
    text?: boolean | undefined;
    encoding?: string | undefined;
    /**
     * Options for the 'qs' package
     */
    queryString?: object | undefined;
    jsonLimit?: string | undefined;
    textLimit?: string | undefined;
    formLimit?: string | undefined;
    parsedMethods?: string[] | undefined;
};
export type BodyParserPair = {
    bodyParser: Middleware;
    multipartBodyParser: Middleware;
};
import formidable from "formidable";
//# sourceMappingURL=body.d.ts.map