// @ts-nocheck

import { environment, isNil } from "@compas/stdlib";
import { cliExecutor } from "../cli/commands/visualise.js";
import { cliLoggerCreate } from "../cli/logger.js";

const SUB_COMMANDS = ["sql"];

/**
 * Execute the visualise command
 *
 * @param {Logger} logger
 * @param {import("../parse").UtilCommand} command
 * @returns {Promise<{ exitCode?: number }>}
 */
export async function visualiseCommand(logger, command) {
  const [subCommand, structureFile, ...args] = command.arguments;

  // All pre-checks

  if (isNil(subCommand) || isNil(structureFile)) {
    logger.error(
      `Usage: compas visualise sql {path/to/generated/common/structure.js}`,
    );
    return { exitCode: 1 };
  }

  if (SUB_COMMANDS.indexOf(subCommand) === -1) {
    logger.info(
      `Unknown command: 'compas visualise ${
        subCommand ?? ""
      }'. Please use one of '${SUB_COMMANDS.join("', '")}'`,
    );
    return { exitCode: 1 };
  }

  const { format, output } = parseFormatAndOutputArguments(
    logger,
    subCommand,
    args,
  );

  const cliLogger = cliLoggerCreate("compas");
  const result = await cliExecutor(cliLogger, {
    command: ["compas", "visualise", "erd"],
    flags: {
      format,
      outputFile: output,
      generatedOutputDirectory: structureFile.split("common")[0],
    },

    // @ts-ignore
    cli: {},
  });

  return {
    exitCode: result.exitStatus === "passed" ? 0 : 1,
  };
}

/**
 * Get format and output path from arguments or supply defaults
 *
 * @param {Logger} logger
 * @param {string} subCommand
 * @param {string[]} args
 * @returns {{ format: string, output: string }}
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

  // @ts-ignore
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
      // @ts-ignore
      result.output = outputValue;
    }
  }

  // @ts-ignore
  return result;
}
