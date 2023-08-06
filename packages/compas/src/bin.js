#!/usr/bin/env node

import { createReadStream } from "node:fs";
import { isNil, newLogger } from "@compas/stdlib";
import { configLoadEnvironment } from "./config/environment.js";
import { configResolve } from "./config/resolve.js";
import { debugEnable } from "./output/debug.js";
import { logger, loggerEnable } from "./output/log.js";
import { output } from "./output/static.js";
import {
  tuiAttachStream,
  tuiEnable,
  tuiPrintInformation,
  tuiStateSetMetadata,
} from "./output/tui.js";

const env = await configLoadEnvironment("", !isNil(process.env));

if (env.isCI) {
  loggerEnable(newLogger());
  output.config.environment.loaded(env);

  const config = await configResolve("", true);

  logger.info({
    env,
    config,
  });
} else if (!env.isDevelopment) {
  loggerEnable(newLogger());
  output.config.environment.loaded(env);

  const config = await configResolve("", true);

  logger.info({
    env,
    config,
  });

  logger.error("Booting in prod is not yet supported.");
  process.exit(1);
} else {
  output.config.environment.loaded(env);

  tuiEnable();
  tuiStateSetMetadata({
    appName: env.appName,
    compasVersion: env.compasVersion,
  });

  const config = await configResolve("", true);

  tuiPrintInformation(JSON.stringify(config));

  let i = 0;

  // keep running;
  setInterval(() => {
    tuiPrintInformation(`oops i did it again... ${i++}`);

    if (i === 3) {
      debugEnable();
    }

    if (Math.random() > 0.5) {
      tuiAttachStream(createReadStream("./packages/compas/package.json"));
    }
  }, 1500);
}
