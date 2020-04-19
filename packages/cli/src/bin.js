#!/usr/bin/env node

import { mainFn } from "@lbu/stdlib";
import { execute } from "./execute.js";
import { logger } from "./logger.js";
import { parseArgs } from "./parse.js";
import { collectScripts } from "./utils.js";

mainFn(import.meta, logger, (logger) => {
  const args = process.argv.slice(2);
  const scripts = collectScripts();
  const command = parseArgs(args, Object.keys(scripts));

  return execute(logger, command, scripts);
});
