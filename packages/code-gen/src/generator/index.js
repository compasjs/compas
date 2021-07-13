import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { pathJoin } from "@compas/stdlib";
import { copyAndSort } from "../generate.js";
import { templateContext } from "../template.js";
import { generateApiClientFiles } from "./apiClient/index.js";
import { generateCommonFiles } from "./common.js";
import { exitOnErrorsOrReturn } from "./errors.js";
import { linkupReferencesInStructure } from "./linkup-references.js";
import { generateReactQueryFiles } from "./reactQuery/index.js";
import { generateRouterFiles } from "./router/index.js";
import { addFieldsOfRelations } from "./sql/add-fields.js";
import { generateModelFiles } from "./sql/models.js";
import { createOrderByTypes } from "./sql/order-by-type.js";
import { createPartialTypes } from "./sql/partial-type.js";
import { createQueryBuilderTypes } from "./sql/query-builder.js";
import { generateSqlStructure } from "./sql/structure.js";
import {
  addShortNamesToQueryEnabledObjects,
  doSqlChecks,
} from "./sql/utils.js";
import { createWhereTypes } from "./sql/where-type.js";
import { generateStructureFile } from "./structure.js";
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
 * @param {CodeGenStructure} structure
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
    enabledGenerators: options.enabledGenerators,
    enabledGroups: options.enabledGroups,
  });

  const isModule = shouldGenerateModules(logger);

  /**
   * @type {CodeGenContext}
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
  generateStructureFile(context);

  exitOnErrorsOrReturn(context);

  // Don't execute any logic, we can just write the structure out only
  if (context.options.enabledGenerators.length > 0) {
    // Linkup all references, so we don't necessarily have to worry about them in all other
    // places.
    linkupReferencesInStructure(context);
    addFieldsOfRelations(context);

    exitOnErrorsOrReturn(context);

    const copy = {};
    copyAndSort(context.structure, copy);
    context.structure = copy;

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
    exitOnErrorsOrReturn(context);

    // Do initial sql checks and load in the types
    // This way the validators are generated
    if (context.options.enabledGenerators.indexOf("sql") !== -1) {
      doSqlChecks(context);
      exitOnErrorsOrReturn(context);

      addShortNamesToQueryEnabledObjects(context);
      exitOnErrorsOrReturn(context);

      generateSqlStructure(context);

      createWhereTypes(context);
      createOrderByTypes(context);
      createPartialTypes(context);
      createQueryBuilderTypes(context);

      exitOnErrorsOrReturn(context);
    }

    generateCommonFiles(context);

    if (context.options.enabledGenerators.indexOf("validator") !== -1) {
      generateValidatorFile(context);
      exitOnErrorsOrReturn(context);
    }
    if (context.options.enabledGenerators.indexOf("router") !== -1) {
      generateRouterFiles(context);
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
      generateModelFiles(context);
      exitOnErrorsOrReturn(context);
    }

    if (context.options.enabledGenerators.indexOf("type") !== -1) {
      generateTypeFile(context);
    }
  }
  // Add provided file headers to all files
  annotateFilesWithHeader(context);

  exitOnErrorsOrReturn(context);

  if (options.returnFiles) {
    // Used for making sure we can check if we are all set
    return context.outputFiles;
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
 * @param {CodeGenContext} context
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
 * @param {CodeGenContext} context
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
 * @param {CodeGenContext} context
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
        key: "coreReservedGroupName",
        groupName: group,
      });
    }
  }
}
