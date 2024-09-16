#! /usr/bin/env node

import { existsSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirnameForModule, mainFn, pathJoin } from "@compas/stdlib";
import {
  argParserParse,
  argParserValidate,
  createCompasFlags,
} from "./arg-parser.js";
import { helpPrintCreateCompasHelp } from "./help.js";
import {
  templateCheckIfExists,
  templateGetAndExtractStream,
  templatePostProcess,
} from "./template.js";

// Force use of Compas pretty printer.s
process.env.COMPAS_LOG_PRINTER = "pretty";
mainFn(import.meta, main);

async function main(logger) {
  const args = process.argv.slice(2);
  const parsedArgs = argParserParse(createCompasFlags, args);

  if (parsedArgs.error) {
    logger.error(parsedArgs.error.message);
    process.exit(1);

    return;
  }

  const { version: createCompasVersion } = JSON.parse(
    await readFile(
      pathJoin(dirnameForModule(import.meta), "../package.json"),
      "utf-8",
    ),
  );
  const validatedArgs = argParserValidate(
    parsedArgs.value,
    `v${createCompasVersion}`,
  );

  if (validatedArgs.help) {
    helpPrintCreateCompasHelp(logger, validatedArgs.message);
    return process.exit(validatedArgs.message ? 1 : 0);
  }

  validatedArgs.outputDirectory =
    validatedArgs.outputDirectory ?? process.cwd();

  const dirReadyForUsage = canDirectoryBeUsed(validatedArgs.outputDirectory);
  if (dirReadyForUsage !== true) {
    logger.error(
      `The directory '${validatedArgs.outputDirectory}' can't be used, since it contains files that may get overwritten.`,
    );

    return process.exit(1);
  }

  logger.info(`Experimental!`);
  logger.info(
    `Resolved template url: 'https://github.com/${
      validatedArgs.template.repository
    }/tree/${validatedArgs.template.ref ?? "main"}/${validatedArgs.template.path}'`,
  );
  logger.info(`Output directory: '${validatedArgs.outputDirectory}'`);

  await templateCheckIfExists(logger, validatedArgs);
  await templateGetAndExtractStream(logger, validatedArgs);
  await templatePostProcess(logger, validatedArgs, createCompasVersion);
}

/**
 * Check if the provided directory can be used. Ignoring some existing configuration
 * files.
 *
 * @param {string} dir
 * @returns {boolean}
 */
export function canDirectoryBeUsed(dir) {
  // Source:
  // https://github.com/vercel/next.js/blob/canary/packages/create-next-app/helpers/is-folder-empty.ts#L7
  const ignore = [
    ".DS_Store",
    ".git",
    ".gitattributes",
    ".gitignore",
    ".gitkeep",
    ".gitlab-ci.yml",
    ".hg",
    ".hgcheck",
    ".hgignore",
    ".idea",
    ".npmignore",
    "LICENSE",
    "Thumbs.db",
    "npm-debug.log",
    "yarn-debug.log",
    "yarn-error.log",
  ];

  if (!existsSync(dir)) {
    return true;
  }

  const dirContents = readdirSync(dir);

  for (const existingItem of dirContents) {
    if (!ignore.includes(existingItem)) {
      return false;
    }
  }

  return true;
}
