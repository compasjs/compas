import {
  addToTemplateContext,
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { mockForType } from "./js-templates/mockForType.js";

const init = async () => {
  await compileTemplateDirectory(
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
  addToTemplateContext("mockForType", mockForType);
};

const generate = data => {
  const mocksContent = executeTemplate("mocksFile", data);

  return [
    {
      path: "./mocks.js",
      content: mocksContent,
    },
  ];
};

/**
 * Generate mocks
 */
export const getMocksPlugin = () => {
  return {
    name: "mocks",
    init,
    generate,
  };
};
