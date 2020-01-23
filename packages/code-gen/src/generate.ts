/* eslint-disable @typescript-eslint/no-unused-vars */

import { existsSync, mkdirSync } from "fs";
import { preProcessSchema } from "./preprocessor";
import { generateRouterStringFromRoutes } from "./router";
import { AppSchema } from "./types";
import { generateValidatorStringFromValidators } from "./validator";

export function generateForAppSchema(outputDir: string, schema: AppSchema) {
  preProcessSchema(schema);

  // @ts-ignore
  const validators = generateValidatorStringFromValidators(schema.validators);
  // @ts-ignore
  const routes = generateRouterStringFromRoutes(schema.routes);

  return;
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
}
