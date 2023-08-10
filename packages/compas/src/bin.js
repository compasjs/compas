#!/usr/bin/env node

import { createReadStream } from "node:fs";
import { dirnameForModule, isNil, newLogger, pathJoin } from "@compas/stdlib";
import { cacheLoadFromDisk, cacheWriteToDisk } from "./cache.js";
import { configLoadEnvironment, configResolve } from "./config.js";
import { debugEnable } from "./output/debug.js";
import { logger, loggerEnable } from "./output/log.js";
import { output } from "./output/static.js";
import {
  tuiAttachStream,
  tuiEnable,
  tuiPrintInformation,
  tuiStateSetMetadata,
} from "./output/tui.js";

const env = await configLoadEnvironment("", !isNil(process.env.NODE_ENV));

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

  const cache = await cacheLoadFromDisk("", env.compasVersion);

  let config = cache.config;

  if (!config) {
    config = await configResolve("", true);

    cache.config = config;
    await cacheWriteToDisk("", cache);
  }

  tuiPrintInformation(JSON.stringify(config));

  let i = 0;

  // keep running;
  setInterval(() => {
    tuiPrintInformation(`oops i did it again... ${i++}`);

    if (i === 3) {
      debugEnable();
    }

    if (Math.random() > 0.5) {
      tuiAttachStream(
        createReadStream(
          pathJoin(dirnameForModule(import.meta), "../package.json"),
        ),
      );
    }
  }, 3000);
}
