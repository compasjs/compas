/**
 * @param {import("axios").AxiosInstance} Axios
 * @param {string} url
 * @returns {Promise<any>}
 */
export function loadFromRemote(Axios: import("axios").AxiosInstance, url: string): Promise<any>;
/**
 * @param {string} defaultGroup
 * @param {Record<string, any>} data
 * @returns {Record<string, any>}
 */
export function loadFromOpenAPISpec(defaultGroup: string, data: Record<string, any>): Record<string, any>;
//# sourceMappingURL=loaders.d.ts.map