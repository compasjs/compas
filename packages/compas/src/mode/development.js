import { createReadStream } from "node:fs";
import { dirnameForModule, pathJoin } from "@compas/stdlib";
import { cacheLoadFromDisk, cacheWriteToDisk } from "../cache.js";
import { configResolve } from "../config.js";
import { debugEnable } from "../output/debug.js";
import { output } from "../output/static.js";
import {
  tuiAttachStream,
  tuiEnable,
  tuiPrintInformation,
  tuiStateSetMetadata,
} from "../output/tui.js";

/**
 * Run Compas in CI mode
 *
 * @param {import("../config.js").ConfigEnvironment} env
 * @returns {Promise<void>}
 */
export async function developmentMode(env) {
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
