/**
 * @param {import("axios").AxiosInstance} Axios
 * @param {string} url
 * @returns {Promise<any>}
 */
export function loadApiStructureFromRemote(
  Axios: import("axios").AxiosInstance,
  url: string,
): Promise<any>;
/**
 * Convert an OpenAPI 3 JSON spec to a Compas compatible structure
 *
 * @param {string} name
 * @param {Record<string, any>} spec
 * @returns {Record<string, any>}
 */
export function loadApiStructureFromOpenAPI(
  name: string,
  spec: Record<string, any>,
): Record<string, any>;
/**
 * @param {string} defaultGroup
 * @param {Record<string, any>} data
 * @returns {Record<string, any>}
 */
export function loadFromOpenAPISpec(
  defaultGroup: string,
  data: Record<string, any>,
): Record<string, any>;
//# sourceMappingURL=loaders.d.ts.map
