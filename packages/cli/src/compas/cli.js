#!/usr/bin/env node

import {
  configLoaderGet,
  dirnameForModule,
  eventStart,
  eventStop,
  newEventFromEvent,
  pathJoin,
} from "@compas/stdlib";
import { cliCommandDetermine, cliCommandExec } from "../cli/command.js";
import { cliHelpGetMessage } from "../cli/help.js";
import { cliInit } from "../cli/init.js";
import { cliLoggerCreate } from "../cli/logger.js";
import { cliParserParseFlags } from "../cli/parser.js";

/**
 * Get the compas cli with loaded commands
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {{
 *   commandDirectories: {
 *     loadScripts: boolean,
 *     loadProjectConfig: boolean,
 *     loadUserConfig: boolean,
 *   }
 * }} options
 */
export async function compasGetCli(event, options) {
  eventStart(event, "compas.getCli");

  /**
   * @type {import("../generated/common/types").CliCommandDefinitionInput}
   */
  const compas = {
    name: "compas",
    shortDescription: "The Compas CLI",
    subCommands: [],
    flags: [
      {
        name: "printTimings",
        rawName: "--timings",
        description: "Print information about CLI execution time.",
      },
    ],
    modifiers: {
      isCosmetic: true,
    },
  };

  const logger = cliLoggerCreate(compas.name);
  const commandDirectories = await getCommandDirectories(
    options.commandDirectories,
  );

  const cli = await cliInit(newEventFromEvent(event), compas, {
    commandDirectories,
  });

  eventStop(event);

  return {
    logger,
    cli,
  };
}

/**
 * Execute CLI
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../cli/types").CliResolved} cli
 * @param {string[]} userInput
 * @returns {Promise<{
 *   flags?: any,
 *   result: import("@compas/stdlib").Either<import("../cli/types").CliResult, { message:
 *   string }>,
 * }>}
 */
export async function compasExecCli(event, logger, cli, userInput) {
  eventStart(event, "compas.execCli");

  const commandResult = await cliCommandDetermine(
    newEventFromEvent(event),
    cli,
    userInput,
  );

  if (commandResult.error) {
    return {
      result: commandResult,
    };
  }

  if (commandResult.value.name === "help") {
    const helpResult = await cliHelpGetMessage(
      newEventFromEvent(event),
      cli,
      userInput,
    );

    if (helpResult.error) {
      return {
        flags: {
          printTimings: userInput.includes("--timings"),
        },
        result: helpResult,
      };
    }

    logger.info(helpResult.value);

    return {
      flags: {
        printTimings: userInput.includes("--timings"),
      },
      result: {
        value: {
          exitStatus: "passed",
        },
      },
    };
  }

  const flagResult = await cliParserParseFlags(
    newEventFromEvent(event),
    commandResult.value,
    userInput,
  );

  if (flagResult.error) {
    return {
      flags: {
        printTimings: userInput.includes("--timings"),
      },
      result: flagResult,
    };
  }

  const result = await cliCommandExec(
    newEventFromEvent(event),
    logger,
    cli,
    commandResult.value,
    flagResult.value,
    userInput,
  );

  eventStop(event);

  return {
    flags: flagResult.value,
    result,
  };
}

/**
 * Specify internal commands, project command directories, user command directories and
 * scripts directory.
 *
 * @param {{
 *     loadScripts: boolean,
 *     loadProjectConfig: boolean,
 *     loadUserConfig: boolean,
 * }} opts
 * @returns {Promise<{validateOnLoad: boolean, directory: string}[]>}
 */
export async function getCommandDirectories(opts) {
  const result = [
    {
      directory: pathJoin(dirnameForModule(import.meta), "./commands"),
      validateOnLoad: false,
    },
  ];

  if (opts.loadProjectConfig) {
    const projectConfig = await configLoaderGet({
      name: "compas",
      location: "project",
    });
    if (projectConfig.data?.cli?.commandDirectories) {
      for (const dir of projectConfig.data.cli.commandDirectories) {
        result.push({
          directory: pathJoin(process.cwd(), dir),
          validateOnLoad: true,
        });
      }
    }
  }

  if (opts.loadUserConfig) {
    const userConfig = await configLoaderGet({
      name: "compas",
      location: "user",
    });
    if (userConfig.data?.cli?.commandDirectories) {
      for (const dir of userConfig.data.cli.commandDirectories) {
        result.push({
          directory: dir,
          validateOnLoad: true,
        });
      }
    }
  }

  if (opts.loadScripts) {
    result.push({
      directory: pathJoin(process.cwd(), "scripts"),
      validateOnLoad: true,
    });
  }

  return result;
}
