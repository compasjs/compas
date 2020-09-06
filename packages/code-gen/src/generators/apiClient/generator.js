import { cleanTemplateOutput } from "../../templates/index.js";
import { apiClientFile } from "./templates/apiClientFile.js";

/**
 * @param {App} app
 * @param data
 * @param {GenerateOpts} options
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, data, options) {
  const path = "./apiClient.js";

  return {
    path,
    source: cleanTemplateOutput(
      apiClientFile({
        options,
        ...data,
      }),
    ),
  };
}
