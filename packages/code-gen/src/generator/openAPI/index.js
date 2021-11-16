import { mkdirSync, writeFileSync } from "fs";
import { pathToFileURL } from "url";
import { isPlainObject } from "@compas/stdlib";
import { addGroupsToGeneratorInput } from "../../generate.js";
import { linkupReferencesInStructure } from "../linkup-references.js";
import { generateOpenApiFile } from "./generator.js";

/**
 * @typedef {object} OpenApiOpts
 * @property {string|undefined} [version]
 * @property {string|undefined} [title]
 * @property {string|undefined} [description]
 * @property {any[]|undefined} [servers]
 */

/**
 * @typedef {object} GenerateOpenApiOpts
 * @property {string} inputPath
 * @property {string} outputFile
 * @property {OpenApiOpts} [openApiOptions]
 * @property {string[]|undefined} [enabledGroups]
 * @property {boolean|undefined} [verbose]
 */

/**
 * @param {Logger} logger
 * @param {GenerateOpenApiOpts} options
 * @returns {Promise<void>}
 */
export async function generateOpenApi(logger, options) {
  options.openApiOptions = options?.openApiOptions ?? {};

  if (options.verbose) {
    logger.info({
      openApiGenerator: options,
    });
  }

  const { compasApiStructureString } = await import(
    // @ts-ignore
    pathToFileURL(options.inputPath)
  );
  const structure = JSON.parse(compasApiStructureString);
  if (!isPlainObject(structure)) {
    throw new Error(
      "Content of structure file is invalid. Is it correctly generated?",
    );
  }

  // ensure enabledGroups are present in structure
  const structureGroups = Object.keys(structure);
  for (const group of options?.enabledGroups ?? []) {
    if (!structureGroups.includes(group)) {
      throw new Error(
        `Enabled group (name: "${group}") on generator not found in structure. Found groups: "${structureGroups.join(
          `","`,
        )}"`,
      );
    }
  }

  // if no enabledGroups are provided, take all groups in structure (without compas group)
  options.enabledGroups =
    options?.enabledGroups ??
    structureGroups.filter((group) => group !== "compas");

  /**
   * @type {CodeGenStructure}
   */
  const extendedStructure = {};
  addGroupsToGeneratorInput(
    extendedStructure,
    structure,
    options.enabledGroups,
  );

  // resolve references within structure
  // @ts-ignore
  linkupReferencesInStructure({ structure });

  // call generator and transform structure to json (openapi spec)
  // @ts-ignore
  const contents = generateOpenApiFile(extendedStructure, options);

  // write file to absolute location
  const directory = options.outputFile.split("/").slice(0, -1).join("/");
  mkdirSync(directory, { recursive: true });
  writeFileSync(options.outputFile, JSON.stringify(contents, null, 2), "utf8");
}
