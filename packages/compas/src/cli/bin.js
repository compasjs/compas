#!/usr/bin/env node

import { existsSync } from "node:fs";
import { isNil } from "@compas/stdlib";
import { configLoadEnvironment } from "../config.js";

// Just execute some temporary command matching
const args = process.argv.slice(2);
const debug = args.includes("--debug");

if (debug) {
  args.splice(args.indexOf("--debug"), 1);
}

if (args.length === 0) {
  if (!existsSync("./package.json")) {
    // eslint-disable-next-line no-console
    console.log(`Please run 'npx compas@latest init' to install Compas.`);
  } else {
    // TODO: check if we are in a project or someone forgot to run 'compas init'.

    // TODO: debug

    const env = await configLoadEnvironment("", !isNil(process.env.NODE_ENV));

    if (env.isCI) {
      const { ciMode } = await import("../main/ci/index.js");
      await ciMode(env);
    } else if (!env.isDevelopment) {
      const { productionMode } = await import("../main/production/index.js");
      await productionMode(env);
    } else {
      const { developmentMode } = await import("../main/development/index.js");
      await developmentMode(env);
    }
  }
} else if (args.length === 1) {
  if (args[0] === "init") {
    const { initCompas } = await import("../main/init/compas.js");
    await initCompas();
  }
} else {
  // eslint-disable-next-line no-console
  console.log(`Unsupported command. Available commands:

- compas
- compas init`);
}
