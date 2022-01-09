import { existsSync } from "fs";
import { readdir } from "fs/promises";
import { pathToFileURL } from "url";
import {
  AppError,
  eventStart,
  eventStop,
  isNil,
  pathJoin,
} from "@compas/stdlib";
import { validateCliCommandDefinition } from "../generated/cli/validators.js";

/**
 * Load the specified directories and return a command array
 *
 * @param {InsightEvent} event
 * @param {{inputs: { directory: string, validateOnLoad: boolean }[]}} options
 * @returns {Promise<import("../generated/common/types").CliCommandDefinitionInput[]>}
 */
export async function cliLoaderLoadDirectories(event, options) {
  eventStart(event, "cliLoader.loadDirectories");

  /** @type {import("../generated/common/types").CliCommandDefinitionInput[]} */
  const result = [];

  for (const input of options.inputs) {
    if (!existsSync(input.directory)) {
      if (input.validateOnLoad) {
        event.log.error(
          `Could not find directory '${input.directory}' to load commands from.`,
        );
      }
      continue;
    }

    const filesInDir = await readdir(input.directory, { encoding: "utf8" });
    for (const f of filesInDir) {
      if (!f.endsWith(".js") && !f.endsWith(".mjs")) {
        continue;
      }

      const filePath = pathJoin(input.directory, f);
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
          event.log.error(`Error loading 'cliDefinition' from '${filePath}'`);
          event.log.error(AppError.format(validateResult.error));
          continue;
        }
      }

      result.push(imported.cliDefinition);
    }
  }

  eventStop(event);

  return result;
}
