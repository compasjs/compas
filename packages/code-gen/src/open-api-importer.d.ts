/**
 * Try some 'free'-form conversion
 * A lot of things are not mappable between the structures, and some have a different
 * meaning between OpenAPI and Compas.
 * We convert the routes first, using the first tag where possible, else the default
 * group. We then try to resolve the path-params and query params. Followed by the
 * request body and 200-response. There are some extra generated references to make sure
 * all path's are also referenced into the default group as to make sure they will be
 * included in the generation.
 *
 * @param {string} defaultGroup
 * @param {Record<string, any>} data
 */
export function convertOpenAPISpec(defaultGroup: string, data: Record<string, any>): any;
//# sourceMappingURL=open-api-importer.d.ts.map