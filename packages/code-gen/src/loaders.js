import { isNil, isPlainObject } from "@compas/stdlib";
import { convertOpenAPISpec } from "./open-api-importer.js";

/**
 * @param {import("axios").AxiosInstance} Axios
 * @param {string} url
 * @returns {Promise<any>}
 */
export async function loadFromRemote(Axios, url) {
  if (isNil(url)) {
    throw new Error(
      "Missing 'url'. Please pass in the base url of an compas based backend.",
    );
  }
  url = url.endsWith("/") ? url.substr(0, url.length - 1) : url;
  const response = await Axios.get(`${url}/_compas/structure.json`);

  return response.data;
}

/**
 * @param {string} defaultGroup
 * @param {Record<string, any>} data
 * @returns {Record<string, any>}
 */
export function loadFromOpenAPISpec(defaultGroup, data) {
  if (!isPlainObject(data)) {
    throw new TypeError("Expecting a plain js object");
  }

  return convertOpenAPISpec(defaultGroup, data);
}
