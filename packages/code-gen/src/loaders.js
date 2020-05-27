import { isPlainObject } from "@lbu/stdlib";
import axios from "axios";
import { convertOpenAPISpec } from "./open-api-importer.js";

/**
 * Load a LBU structure from an LBU enabled API
 *
 * @param {string} url Base remote url
 * @return {Promise<any>}
 */
export async function loadFromRemote(url) {
  const response = await axios.get(url + "/_lbu/structure.json");

  return response.data;
}

/**
 * Try to convert a OpenAPI spec object to LBU structure
 *
 * @param {string} defaultGroup Default to group to use for non tagged items in the spec
 * @param {object} data Raw OpenAPI json doc
 * @return {object}
 */
export function loadFromOpenAPISpec(defaultGroup, data) {
  if (!isPlainObject(data)) {
    throw new TypeError("Expecting a plain js object");
  }

  return convertOpenAPISpec(defaultGroup, data);
}
