#!/usr/bin/env node

import { existsSync } from "node:fs";
import { newLogger } from "@compas/stdlib";
import { configLoadEnvironment } from "../shared/config.js";
import {
  debugDisable,
  debugEnable,
  debugPrint,
  logger,
  loggerEnable,
} from "../shared/output.js";

// Just execute some temporary command matching
const args = process.argv.slice(2);
const debug = args.includes("--debug");

if (debug) {
  args.splice(args.indexOf("--debug"), 1);
  await debugEnable();
} else {
  debugDisable();
}

debugPrint({
  argv: process.argv,
  args,
});

if (args.length === 0) {
  if (!existsSync("./package.json")) {
    // eslint-disable-next-line no-console
    console.log(`Please run 'npx compas@latest init' to install Compas.`);
  } else {
    // TODO: check if we are in a project with Compas installed or if we should nudge the user to run Compas init. We probably want to do this differently in the different modes.

    const env = await configLoadEnvironment(false);

    debugPrint(env);

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
} else {
  const command = args.join(" ");
  const env = await configLoadEnvironment(true);

  loggerEnable(
    newLogger({
      ctx: {
        type: env.appName,
      },
    }),
  );

  if (command === "init") {
    const { initCompas } = await import("../main/init/compas.js");
    await initCompas(env);
  } else if (command === "init docker") {
    const { initDocker } = await import("../main/init/docker.js");
    await initDocker(env);
  } else {
    // eslint-disable-next-line no-console
    logger.info(`Unsupported command. Available commands:

- compas
- compas init
- compas init docker`);
  }
}
