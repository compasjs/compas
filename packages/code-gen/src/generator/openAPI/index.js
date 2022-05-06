import { mkdirSync, writeFileSync } from "fs";
import { pathToFileURL } from "url";
import { isPlainObject, uuid } from "@compas/stdlib";
import { addGroupsToGeneratorInput } from "../../generate.js";
import { preprocessorsExecute } from "../../preprocessors/index.js";
import { structureIteratorNamedTypes } from "../../structure/structureIterators.js";
import { generateOpenApiFile } from "./generator.js";

/**
 * @typedef {object} OpenApiExtensions
 * @property {OpenApiExtensionsInfo} [info]
 * @property {any[]} [servers]
 * @property {any[]} [components]
 */

/**
 * @typedef {object} OpenApiExtensionsInfo
 * @property {string} [version]
 * @property {string} [title]
 * @property {string} [description]
 */

/**
 * @typedef {Record<string, object>} OpenApiRouteExtensions
 */

/**
 * @typedef {object} GenerateOpenApiOpts
 * @property {string} inputPath
 * @property {string} outputFile
 * @property {string[]} [enabledGroups]
 * @property {boolean} [verbose]
 * @property {OpenApiExtensions} [openApiExtensions]
 * @property {OpenApiRouteExtensions} [openApiRouteExtensions]
 */

/**
 * @param {Logger} logger
 * @param {GenerateOpenApiOpts} options
 * @returns {Promise<void>}
 */
export async function generateOpenApi(logger, options) {
  options.openApiExtensions = options?.openApiExtensions ?? {};

  if (options.verbose) {
    logger.info({
      openApiGenerator: options,
    });
  }

  const { compasApiStructureString } = await import(
    // @ts-ignore
    `${pathToFileURL(options.inputPath)}?v=${uuid()}`
  );

  /**
   * @type {import("../../generated/common/types").CodeGenStructure}
   */
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

  // Create set of RouteExtensions uniqueNames, pop one by one.
  // if name left, a uniqueName is provided that does not exist
  const routeExtensionsUniqueNames = new Set(
    Object.keys(options?.openApiRouteExtensions ?? {}),
  );

  for (const type of structureIteratorNamedTypes(structure)) {
    // @ts-expect-error
    routeExtensionsUniqueNames.delete(type.uniqueName);
  }

  if (routeExtensionsUniqueNames.size > 0) {
    throw new Error(
      `RouteExtension(s) provided for non existing uniqueName: ${Array.from(
        routeExtensionsUniqueNames,
      ).join(",")}`,
    );
  }

  // if no enabledGroups are provided, take all groups in structure (without compas group)
  options.enabledGroups =
    options?.enabledGroups ??
    structureGroups.filter((group) => group !== "compas");

  /**
   * @type {import("../../generated/common/types").CodeGenStructure}
   */
  const extendedStructure = {};
  addGroupsToGeneratorInput(
    extendedStructure,
    structure,
    options.enabledGroups,
  );

  // @ts-expect-error
  preprocessorsExecute({ structure, errors: [] });

  // call generator and transform structure to json (openapi spec)
  // @ts-ignore
  const contents = generateOpenApiFile(extendedStructure, options);

  // write file to absolute location
  const directory = options.outputFile.split("/").slice(0, -1).join("/");
  mkdirSync(directory, { recursive: true });
  writeFileSync(options.outputFile, JSON.stringify(contents, null, 2), "utf8");
}
