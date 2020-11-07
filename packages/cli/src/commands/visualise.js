import { existsSync, writeFileSync } from "fs";
import {
  AppError,
  dirnameForModule,
  environment,
  isNil,
  pathJoin,
  spawn,
  uuid,
} from "@lbu/stdlib";
import { formatGraphOfSql } from "../visualise/sql.js";

const SUB_COMMANDS = ["sql", "router"];
const codeGenImportPath = pathJoin(
  dirnameForModule(import.meta),
  "../../../code-gen/src/internal-exports.js",
);

/**
 * Execute the visualise command
 *
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @returns {Promise<{ exitCode?: number }>}
 */
export async function visualiseCommand(logger, command) {
  const [subCommand, structureFile, ...args] = command.arguments;

  // All pre-checks

  if (isNil(subCommand) || isNil(structureFile)) {
    logger.error(
      `Usage: lbu visualise [sql,router] {path/to/generated/index.js}`,
    );
    return { exitCode: 1 };
  }

  const resolvedStructureFile = pathJoin(process.cwd(), structureFile);

  if (SUB_COMMANDS.indexOf(subCommand) === -1) {
    logger.info(
      `Unknown command: 'lbu visualise ${
        subCommand ?? ""
      }'. Please use one of '${SUB_COMMANDS.join("', '")}'`,
    );
    return { exitCode: 1 };
  }

  const codeGen = await getCodeGenExports();
  if (!codeGen) {
    logger.error(`The visualiser needs @lbu/code-gen to run.`);
    return { exitCode: 1 };
  }

  if (!(await structureFileExists(resolvedStructureFile))) {
    logger.error(
      `The specified path '${structureFile}' is not available, or can not be imported. Make sure it exists and is a JavaScript file.`,
    );
    return { exitCode: 1 };
  }

  const { format, output } = parseFormatAndOutputArguments(
    logger,
    subCommand,
    args,
  );

  // Get the structure

  const { structure, trie } = await getStructure(
    logger,
    codeGen,
    subCommand,
    resolvedStructureFile,
  );

  if (!structure) {
    logger.error(
      `The structure file could not be loaded. Please ensure that 'dumpStructure' options is enabled while generating.`,
    );
    return { exitCode: 1 };
  }

  // Execute and write

  let graph;
  if (subCommand === "sql") {
    graph = formatGraphOfSql(codeGen, structure);
  } else if (subCommand === "router") {
    logger.info(
      `Not implemented. ${
        trie ? "Trie exists" : "Trie does not exist either."
      }.`,
    );
  }

  const tmpPathDot = `/tmp/${uuid()}.gv`;

  writeFileSync(tmpPathDot, graph, "utf8");

  logger.info(`Dot file written to temporary directory. Spawning 'dot'.`);
  try {
    const { exitCode } = await spawn(`dot`, [
      `-T${format}`,
      `-o`,
      output,
      tmpPathDot,
    ]);

    if (exitCode !== 0) {
      logger.error(
        "'Dot' returned with an error. Please check the above output.",
      );
      return { exitCode };
    }
  } catch {
    logger.error(
      `'Dot' could not be found. Please install 'graphviz' via your package manager and try again.`,
    );
    return { exitCode: 1 };
  }

  logger.info(`Graph of '${subCommand}' is available at ${output}`);
  return {
    exitCode: 0,
  };
}

/**
 * Get the structure using @lbu/code-gen internal functions. This ensures all references
 * are linked and the structure is valid.
 *
 * @param {Logger} logger
 * @param codeGen
 * @param {"router"|"sql"} subCommand
 * @param {string} structureFile
 * @returns {Promise<{trie, structure: CodeGenStructure}|undefined>}
 */
async function getStructure(logger, codeGen, subCommand, structureFile) {
  const { structure } = await import(structureFile);

  let trie;
  const context = {
    structure,
    errors: [],
  };

  try {
    codeGen.linkupReferencesInStructure(context);
    codeGen.addFieldsOfRelations(context);

    if (subCommand === "sql") {
      codeGen.doSqlChecks(context);
    }
    if (subCommand === "router") {
      trie = codeGen.buildTrie(context.structure);
    }

    codeGen.exitOnErrorsOrReturn(context);

    return {
      structure: context.structure,
      trie,
    };
  } catch (e) {
    if (AppError.instanceOf(e)) {
      logger.error(AppError.format(e));
    } else if (e.message) {
      logger.error(e);
    }
    return undefined;
  }
}

/**
 * Check if the code-gen 'internal-exports' file can be imported and import it
 */
async function getCodeGenExports() {
  if (!existsSync(codeGenImportPath)) {
    return undefined;
  }

  try {
    return await import(codeGenImportPath);
  } catch {
    return undefined;
  }
}

/**
 * Check if the passed in structure file exists
 */
async function structureFileExists(structureFile) {
  if (!existsSync(structureFile)) {
    return false;
  }

  try {
    const imported = await import(structureFile);

    return !isNil(imported?.structure);
  } catch {
    return false;
  }
}

/**
 * Get format and output path from arguments or supply defaults
 *
 * @param {Logger} logger
 * @param {string} subCommand
 * @param {string[]} args
 * @returns {{ format: string, outputL: string }}
 */
function parseFormatAndOutputArguments(logger, subCommand, args) {
  const supportedFormats = ["png", "svg", "pdf", "webp"];
  const result = {
    format: "svg",
    output: undefined,
  };

  const formatIdx = args.indexOf("--format");
  if (formatIdx !== -1) {
    const formatValue = args[formatIdx + 1];
    if (supportedFormats.indexOf(formatValue) === -1) {
      logger.error(
        `Supplied format '${formatValue}' is invalid. Please use one of '${supportedFormats.join(
          `', '`,
        )}'.\nDefaulting to '${result.format}'.`,
      );
    } else {
      result.format = formatValue;
    }
  }

  result.output = `/tmp/${environment.APP_NAME.toLowerCase()}_${subCommand}.${
    result.format
  }`;

  const outputIdx = args.indexOf("--output");
  if (outputIdx !== -1) {
    const outputValue = args[outputIdx + 1];
    if (isNil(outputValue)) {
      logger.error(
        `No value given to '--output' option. Defaulting to '${result.output}'`,
      );
    } else {
      result.output = outputValue;
    }
  }

  return result;
}
