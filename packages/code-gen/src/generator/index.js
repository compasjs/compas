import { mkdirSync, writeFileSync } from "fs";
import { pathJoin } from "@lbu/stdlib";
import { copyAndSort } from "../generate.js";
import { templateContext } from "../template.js";
import { generateApiClientFiles } from "./apiClient/index.js";
import { exitOnErrorsOrReturn } from "./errors.js";
import { linkupReferencesInStructure } from "./linkup-references.js";
import { generateReactQueryFiles } from "./reactQuery/index.js";
import { generateRouterFiles } from "./router/index.js";
import { addFieldsOfRelations } from "./sql/add-fields.js";
import { createPartialTypes } from "./sql/partial-type.js";
import { generateBaseQueries } from "./sql/query-basics.js";
import { generateQueryPartials } from "./sql/query-partials.js";
import { generateTraversalQueries } from "./sql/query-traversal.js";
import { generateSqlStructure } from "./sql/structure.js";
import {
  addShortNamesToQueryEnabledObjects,
  doSqlChecks,
} from "./sql/utils.js";
import { createWhereTypes } from "./sql/where-type.js";
import {
  addRootExportsForStructureFiles,
  generateStructureFile,
} from "./structure.js";
import {
  generateTypeFile,
  getTypeNameForType,
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
export async function generate(logger, options, structure) {
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

  /**
   * @type {CodeGenContext}
   */
  const context = {
    logger,
    options,
    structure,
    extension: options.useTypescript ? ".ts" : ".js",
    importExtension: ".js",
    outputFiles: [],
    rootExports: [],
    errors: [],
  };

  // Structure:
  // The raw structure that is used to generate all the files.
  // This contains all information needed to generate again, even if different options
  // are needed.
  generateStructureFile(context);
  addRootExportsForStructureFiles(context);

  exitOnErrorsOrReturn(context);

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
  setupMemoizedTypes(context);
  exitOnErrorsOrReturn(context);

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
    doSqlChecks(context);
    exitOnErrorsOrReturn(context);

    addShortNamesToQueryEnabledObjects(context);
    generateSqlStructure(context);
    createWhereTypes(context);
    createPartialTypes(context);
    generateQueryPartials(context);
    generateBaseQueries(context);
    generateTraversalQueries(context);

    exitOnErrorsOrReturn(context);
  }
  if (context.options.enabledGenerators.indexOf("type") !== -1) {
    generateTypeFile(context);
  }

  // Create all exports so imports all happen via
  // `{options.outputDirectory}/index${context.extension}
  generateRootExportsFile(context);

  // Add provided file headers to all files
  annotateFilesWithHeader(context);

  exitOnErrorsOrReturn(context);

  // TODO: Remove context.options.outputDir before writing

  if (options.returnFiles) {
    // Used for making sure we can check if we are all set
    return context.outputFiles;
  }
  writeFiles(context);
}

/**
 * Join all root exports in to a single index.js file
 * @param {CodeGenContext} context
 */
export function generateRootExportsFile(context) {
  context.outputFiles.push({
    contents: context.rootExports
      .map((it) => it.trim())
      .sort((a, b) => {
        const aExport = a.startsWith("export") ? 1 : 0;
        const bExport = b.startsWith("export") ? 1 : 0;

        return aExport - bExport;
      })
      .join("\n"),
    relativePath: `./index${context.extension}`,
  });
}

/**
 * Use the fileHeader from options, and prefix all file contents with it
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
