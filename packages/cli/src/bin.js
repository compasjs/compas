#!/usr/bin/env node

import { mainFn } from "@lbu/stdlib";
import { execScript } from "./exec.js";
import { logger } from "./logger.js";

mainFn(import.meta, logger, logger => {
  const [cmd, ...args] = process.argv.slice(2);
  return execScript(logger, cmd, args);
});
