import { isPlainObject } from "@lbu/stdlib";
import { convertOpenAPISpec } from "./open-api-importer.js";

/**
 * Load a LBU structure from an LBU enabled API
 *
 * @param {AxiosInstance} Axios
 * @param {string} url Base remote url
 * @returns {Promise<any>}
 */
export async function loadFromRemote(Axios, url) {
  const response = await Axios.get(url + "/_lbu/structure.json");

  return response.data;
}

/**
 * Try to convert a OpenAPI spec object to LBU structure
 *
 * @param {string} defaultGroup Default to group to use for non tagged items in the spec
 * @param {object} data Raw OpenAPI json doc
 * @returns {object}
 */
export function loadFromOpenAPISpec(defaultGroup, data) {
  if (!isPlainObject(data)) {
    throw new TypeError("Expecting a plain js object");
  }

  return convertOpenAPISpec(defaultGroup, data);
}
