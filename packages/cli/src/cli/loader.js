import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import {
  AppError,
  environment,
  eventStart,
  eventStop,
  isNil,
  isProduction,
  pathJoin,
} from "@compas/stdlib";
import { validateCliCommandDefinition } from "../generated/cli/validators.js";

/**
 * Load the specified directories and return a command array
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {{inputs: { directory: string, validateOnLoad: boolean }[]}} options
 * @returns {Promise<import("../generated/common/types.d.ts").CliCommandDefinitionInput[]>}
 */
export async function cliLoaderLoadDirectories(event, options) {
  eventStart(event, "cliLoader.loadDirectories");

  /** @type {import("../generated/common/types.d.ts").CliCommandDefinitionInput[]} */
  const result = [];

  for (const input of options.inputs) {
    if (!existsSync(input.directory)) {
      continue;
    }

    const filesInDir = await readdir(input.directory, { encoding: "utf8" });
    for (const f of filesInDir) {
      if (!f.endsWith(".js") && !f.endsWith(".mjs")) {
        continue;
      }

      if (f.endsWith(".test.js") || f.endsWith(".bench.js")) {
        continue;
      }

      const filePath = pathJoin(input.directory, f);
      const fileContents = await readFile(filePath, "utf-8");

      if (!fileContents.includes("export const cliDefinition = {")) {
        continue;
      }

      try {
        const imported = await import(
          // @ts-ignore
          pathToFileURL(filePath)
        );
        if (isNil(imported.cliDefinition)) {
          continue;
        }

        if (input.validateOnLoad) {
          const validateResult = validateCliCommandDefinition(
            imported.cliDefinition,
          );

          if (validateResult.error) {
            event.log.error(
              `Error loading 'cliDefinition' from '${filePath}'.`,
            );
            event.log.error(AppError.format(validateResult.error));
            continue;
          }
        }

        result.push(imported.cliDefinition);
      } catch (e) {
        // Skip logging on production, may be because of not installed dev dependencies.
        // The user will get an error anyway, since the command does not exist.
        if (!isProduction() && environment.CI !== "true") {
          event.log.error(
            `Error loading 'cliDefinition' from '${filePath}'. This can be caused by missing dependencies, missing generated files or even a syntax error in an (in)directly imported file.`,
          );
          event.log.error(AppError.format(e));
        }
      }
    }
  }

  eventStop(event);

  return result;
}
