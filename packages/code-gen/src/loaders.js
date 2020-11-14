import { isNil, isPlainObject } from "@lbu/stdlib";
import { convertOpenAPISpec } from "./open-api-importer.js";

/**
 * @param {AxiosInstance} Axios
 * @param {string} url
 * @returns {Promise<any>}
 */
export async function loadFromRemote(Axios, url) {
  if (isNil(url)) {
    throw new Error(
      "Missing 'url'. Please pass in the base url of an lbu based backend.",
    );
  }
  url = url.endsWith("/") ? url.substr(0, url.length - 1) : url;
  const response = await Axios.get(`${url}/_lbu/structure.json`);

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
