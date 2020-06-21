import { isPlainObject } from "@lbu/stdlib";
import { convertOpenAPISpec } from "./open-api-importer.js";

/**
 * @param {AxiosInstance} Axios
 * @param {string} url
 * @returns {Promise<any>}
 */
export async function loadFromRemote(Axios, url) {
  const response = await Axios.get(url + "/_lbu/structure.json");

  return response.data;
}

/**
 * @param {string} defaultGroup
 * @param {object} data
 * @returns {object}
 */
export function loadFromOpenAPISpec(defaultGroup, data) {
  if (!isPlainObject(data)) {
    throw new TypeError("Expecting a plain js object");
  }

  return convertOpenAPISpec(defaultGroup, data);
}
