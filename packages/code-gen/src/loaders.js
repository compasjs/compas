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
  url = url.endsWith("/") ? url.slice(0, -1) : url;
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
  if (!isPlainObject(spec)) {
    throw new TypeError("Expecting a plain js object");
  }

  if (typeof name !== "string" || name.length === 0 || /[^\w]/g.test(name)) {
    throw AppError.serverError({
      message: `The 'name' passed to 'app.extendWithOpenAPI' should be a 'camelCase' name, found '${name}'.`,
    });
  }

  return convertOpenAPISpec(name, spec);
}
