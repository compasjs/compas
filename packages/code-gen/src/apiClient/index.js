import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";

const init = async () => {
  await compileTemplateDirectory(
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
};

const generate = data => ({
  path: "./apiClient.js",
  content: executeTemplate("apiClientFile", data),
});

/**
 * Generate Typescript types for validators & routes
 */
export const getApiClientPlugin = () => ({
  name: "apiClient",
  init,
  generate,
});
