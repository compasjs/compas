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
  path: "./types.ts",
  content: executeTemplate("typescriptFile", data),
});

/**
 * Generate Typescript types for validators & routes
 */
export const getTypescriptPlugin = () => ({
  name: "typescript",
  init,
  generate,
});
