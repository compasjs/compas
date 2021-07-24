#!/usr/bin/env node

import { mainFn } from "@compas/stdlib";
import { execute } from "./execute.js";
import { parseArgs } from "./parse.js";
import { collectNodeArgs, collectScripts } from "./utils.js";

mainFn(import.meta, async (logger) => {
  const args = process.argv.slice(2);
  const scripts = collectScripts();
  const acceptedArgs = await collectNodeArgs();
  const command = parseArgs(acceptedArgs, Object.keys(scripts), args);

  const result = await execute(logger, command, scripts);
  if (result?.exitCode !== undefined) {
    process.exit(result.exitCode);
  }
});
