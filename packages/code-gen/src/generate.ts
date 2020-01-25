/* eslint-disable @typescript-eslint/no-unused-vars */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { preProcessSchema } from "./preprocessor";
import { generateRouterStringFromRoutes } from "./router";
import { AppSchema } from "./types";
import { generateValidatorStringFromValidators } from "./validator";

export function generateForAppSchema(outputDir: string, schema: AppSchema) {
  preProcessSchema(schema);

  const validators = generateValidatorStringFromValidators(schema.validators);
  const routes = generateRouterStringFromRoutes(schema.routes);

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(join(outputDir, "validators.ts"), validators);
  writeFileSync(join(outputDir, "routes.ts"), routes);
}
