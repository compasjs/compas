import { AppError, isNil, isPlainObject } from "@compas/stdlib";
import { convertOpenAPISpec } from "./open-api-importer.js";

/**
 * @param {import("axios").AxiosInstance} Axios
 * @param {string} url
 * @returns {Promise<any>}
 */
export async function loadApiStructureFromRemote(Axios, url) {
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
 * Convert an OpenAPI 3 JSON spec to a Compas compatible structure
 *
 * @param {string} name
 * @param {Record<string, any>} spec
 * @returns {Record<string, any>}
 */
export function loadApiStructureFromOpenAPI(name, spec) {
  return loadFromOpenAPISpec(name, spec);
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

  if (
    typeof defaultGroup !== "string" ||
    defaultGroup.length === 0 ||
    /[^\w]/g.test(defaultGroup)
  ) {
    throw AppError.serverError({
      message: `The 'defaultGroup' passed to 'app.extendWithOpenAPI' should be a 'camelCase' name, found '${defaultGroup}'.`,
    });
  }

  return convertOpenAPISpec(defaultGroup, data);
}
