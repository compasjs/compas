import { logger } from "../../logger";
import { PluginMetaData } from "../../types";
import { buildRouter } from "./router";
import { buildTypes } from "./types";
import { buildValidator } from "./validator";

export function getPlugin(): PluginMetaData {
  return {
    name: "typescript",
    description:
      "Generate Typescript types and functions, supports all options",
    hooks: {
      validateAbstractTree: tree => {
        logger.info("TODO: VALIDATE TREE");
      },
      buildOutput: tree => [
        {
          path: "./src/generated/types.ts",
          source: buildTypes(tree),
        },
        {
          path: "./src/generated/router.ts",
          source: buildRouter(tree),
        },
        {
          path: "./src/generated/validators.ts",
          source: buildValidator(tree),
        },
      ],
    },
  };
}
