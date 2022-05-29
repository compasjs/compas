// @ts-nocheck

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { isNil, pathJoin } from "@compas/stdlib";
import { crudCreateRoutes } from "../crud/route-creator.js";
import { crudGenerateImplementations } from "../crud/route-implementer.js";
import { copyAndSort } from "../generate.js";
import { preprocessorsExecute } from "../preprocessors/index.js";
import { structureHoistNamedItems } from "../structure/structureHoistNamedItems.js";
import { structureLinkReferences } from "../structure/structureLinkReferences.js";
import { templateContext } from "../template.js";
import { generateApiClientFiles } from "./apiClient/index.js";
import { generateCommonFiles } from "./common.js";
import { exitOnErrorsOrReturn } from "./errors.js";
import { generateReactQueryFiles } from "./reactQuery/index.js";
import { generateRouterFiles } from "./router/index.js";
import { processRouteInvalidations } from "./router/invalidations.js";
import { generateModelFiles } from "./sql/models.js";
import { createOrderByTypes } from "./sql/order-by-type.js";
import { createPartialTypes } from "./sql/partial-type.js";
import { createQueryBuilderTypes } from "./sql/query-builder.js";
import { generateSqlStructure } from "./sql/structure.js";
import { createUpdateTypes } from "./sql/update-type.js";
import {
  addShortNamesToQueryEnabledObjects,
  doSqlChecks,
} from "./sql/utils.js";
import { createWhereTypes } from "./sql/where-type.js";
import {
  structureAppendApiStructure,
  structureCreateFile,
} from "./structure.js";
import {
  generateTypeFile,
  getTypeNameForType,
  getTypeSuffixForUseCase,
  setupMemoizedTypes,
} from "./types.js";
import { generateValidatorFile } from "./validator.js";

/**
 *
 * @param {Logger} logger
 * @param {GenerateOpts} options
 * @param {import("../generated/common/types").CodeGenStructure} structure
 * @returns {Promise<void>}
 */
export function generate(logger, options, structure) {
  // We can always use '.js' as the import extension and TS will happily resolve to the
  // .ts files Not exactly sure how it all works, but should be good enough for now. The
  // issue when not providing any extension in imports / exports is that TS won't add
  // them even when targeting ESNext with moduleResolution Node

  logger.info({
    system: !options.isBrowser
      ? !options.isNodeServer
        ? "isNode"
        : "isNodeServer"
      : "isBrowser",
    ...(options.enabledGenerators?.length > 0
      ? {
          enabledGenerators: options.enabledGenerators,
        }
      : {}),
    ...(options.enabledGroups?.length > 0
      ? {
          enabledGroups: options.enabledGroups,
        }
      : {}),
  });

  const isModule = shouldGenerateModules(logger);

  /**
   * @type {import("../generated/common/types").CodeGenContext}
   */
  const context = {
    logger,
    options,
    structure,
    extension: options.useTypescript ? ".ts" : ".js",
    importExtension: isModule ? ".js" : "",
    outputFiles: [],
    errors: [],
  };

  // Structure:
  // The raw structure that is used to generate all the files.
  // This contains all information needed to generate again, even if different options
  // are needed.
  structureCreateFile(context);
  exitOnErrorsOrReturn(context);

  // Don't execute any logic, we can just write the structure out only
  if (context.options.enabledGenerators.length > 0) {
    structureLinkReferences(context.structure);
    exitOnErrorsOrReturn(context);

    const copy = {};
    copyAndSort(context.structure, copy);
    context.structure = copy;

    preprocessorsExecute(context);
    exitOnErrorsOrReturn(context);

    templateContext.globals.getTypeNameForType = getTypeNameForType.bind(
      undefined,
      context,
    );
    templateContext.globals.typeSuffix = getTypeSuffixForUseCase(
      context.options,
    );

    setupMemoizedTypes(context);
    exitOnErrorsOrReturn(context);

    checkReservedGroupNames(context);
    checkIfEnabledGroupsHaveTypes(context);
    exitOnErrorsOrReturn(context);

    doSqlChecks(context);
    exitOnErrorsOrReturn(context);

    addShortNamesToQueryEnabledObjects(context);
    exitOnErrorsOrReturn(context);

    createWhereTypes(context);
    createUpdateTypes(context);
    createOrderByTypes(context);
    createPartialTypes(context);
    createQueryBuilderTypes(context);

    exitOnErrorsOrReturn(context);

    crudCreateRoutes(context);
    exitOnErrorsOrReturn(context);

    processRouteInvalidations(context);
    exitOnErrorsOrReturn(context);

    generateCommonFiles(context);

    if (context.options.enabledGenerators.indexOf("validator") !== -1) {
      generateValidatorFile(context);
      exitOnErrorsOrReturn(context);
    }

    if (context.options.enabledGenerators.indexOf("router") !== -1) {
      generateRouterFiles(context);
      exitOnErrorsOrReturn(context);

      crudGenerateImplementations(context);
      exitOnErrorsOrReturn(context);
    }

    if (context.options.enabledGenerators.indexOf("apiClient") !== -1) {
      generateApiClientFiles(context);
      exitOnErrorsOrReturn(context);
    }

    if (context.options.enabledGenerators.indexOf("reactQuery") !== -1) {
      generateReactQueryFiles(context);
      exitOnErrorsOrReturn(context);
    }

    if (context.options.enabledGenerators.indexOf("sql") !== -1) {
      if (context.options.enabledGenerators.indexOf("validator") === -1) {
        context.errors.push({
          key: "sqlEnableValidator",
        });
      }

      generateSqlStructure(context);
      generateModelFiles(context);
      exitOnErrorsOrReturn(context);
    }

    if (context.options.enabledGenerators.indexOf("type") !== -1) {
      generateTypeFile(context);
    }

    // Get structure in the same state as without generators, This way we can dump the
    // api structure easily.
    structureHoistNamedItems(context.structure);
  }

  structureAppendApiStructure(context);

  // Add provided file headers to all files
  annotateFilesWithHeader(context);

  exitOnErrorsOrReturn(context);

  if (options.returnFiles) {
    // Used for making sure we can check if we are all set
    return context.outputFiles;
  } else if (options.returnContext) {
    return context;
  }

  logger.info(`Cleaning output directory and writing files.`);
  rmSync(context.options.outputDirectory, {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 10,
  });

  writeFiles(context);
}

/**
 * Use the fileHeader from options, and prefix all file contents with it
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function annotateFilesWithHeader(context) {
  for (const file of context.outputFiles) {
    if (file.relativePath.endsWith(".sql")) {
      file.contents = `${context.options.fileHeader.replace(/\/\//g, "--")}\n${
        file.contents
      }\n`;
    } else {
      file.contents = `${context.options.fileHeader}\n${file.contents}\n`;
    }
  }
}

/**
 * Write out all files
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function writeFiles(context) {
  for (const file of context.outputFiles) {
    const fullPath = pathJoin(
      context.options.outputDirectory,
      file.relativePath,
    );
    const directory = fullPath.split("/").slice(0, -1).join("/");

    mkdirSync(directory, { recursive: true });
    writeFileSync(fullPath, file.contents, "utf8");
  }
}

/**
 * Check if we should generate ES Modules based on the package.json
 *
 * @param {Logger} logger
 * @returns {boolean}
 */
export function shouldGenerateModules(logger) {
  try {
    const packageJsonSource = readFileSync(
      pathJoin(process.cwd(), "package.json"),
      "utf8",
    );
    const packageJson = JSON.parse(packageJsonSource);
    return packageJson?.type === "module";
  } catch {
    logger.error(
      "Could not determine if we should not generate ES Modules. Defaulting to ES modules.\n  Make sure you run the generator in the root of your project.",
    );
    return true;
  }
}

/**
 * Check if a group uses one of the reserved keywords
 * Sourced from
 * https://github.com/microsoft/TypeScript/blob/66ecfcbd04b8234855a673adb85e5cff3f8458d4/src/compiler/types.ts#L112
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
function checkReservedGroupNames(context) {
  const keywords = [
    // Reserved words
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "final",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    // And strict mode included
    "implements",
    "interface",
    "let",
    "package",
    "private",
    "protected",
    "public",
    "static",
    "yield",
    // Other reserved names
    "common",
  ];

  for (const group of Object.keys(context.structure)) {
    if (keywords.indexOf(group.toLowerCase()) !== -1) {
      context.errors.push({
        key: "structureReservedGroupName",
        groupName: group,
      });
    }
  }
}

/**
 * If enabledGroups are provided by the user, we check if they exist.
 * If not we report it as an error. In most cases this is a user error.
 * At this point we already normalized all references.
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
function checkIfEnabledGroupsHaveTypes(context) {
  if (!Array.isArray(context.options.enabledGroups)) {
    return;
  }

  for (const group of context.options.enabledGroups) {
    if (
      isNil(context.structure[group]) ||
      Object.keys(context.structure[group]).length === 0
    ) {
      context.errors.push({
        key: "structureUnknownOrEmptyGroup",
        groupName: group,
      });
    }
  }
}
