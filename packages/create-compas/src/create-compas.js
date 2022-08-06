#! /usr/bin/env node

import { readFile } from "fs/promises";
import { dirnameForModule, mainFn, pathJoin } from "@compas/stdlib";
import {
  argParserParse,
  argParserValidate,
  createCompasFlags,
} from "./arg-parser.js";
import { helpPrintCreateCompasHelp } from "./help.js";

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
    return;
  }

  logger.info(`
Create Compas based projects from the examples or custom templates.
Resolved template url: 'https://github.com/${validatedArgs.template.repository}/tree/${validatedArgs.template.ref}/${validatedArgs.template.path}'

This package is a work in progress. Follow https://github.com/compasjs/compas/issues/1907 for updates.`);
}
