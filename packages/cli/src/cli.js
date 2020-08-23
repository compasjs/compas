#!/usr/bin/env node

import { mainFn } from "@lbu/stdlib";
import { execute } from "./execute.js";
import { parseArgs } from "./parse.js";
import { collectScripts } from "./utils.js";

mainFn(import.meta, async (logger) => {
  const args = process.argv.slice(2);
  const scripts = collectScripts();
  const command = parseArgs(args, Object.keys(scripts));

  const result = await execute(logger, command, scripts);
  if (result && result.exitCode !== undefined) {
    process.exit(result.exitCode);
  }
});
