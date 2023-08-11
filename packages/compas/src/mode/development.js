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
import {
  watcherAddListener,
  watcherEnable,
  watcherProcessChangesSinceSnapshot,
  watcherRemoveSnapshot,
  watcherWriteSnapshot,
} from "../watcher.js";

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
    await watcherRemoveSnapshot("");
    config = await configResolve("", true);

    cache.config = config;
    await cacheWriteToDisk("", cache);
  }

  tuiPrintInformation(JSON.stringify(config));

  let i = 0;

  await watcherEnable("");

  function foo() {
    tuiPrintInformation(".env changed");
  }

  watcherAddListener({
    glob: "**/.env*",
    delay: 100,
    callback: foo,
  });

  // Write the snapshot after changes
  watcherAddListener({
    glob: "**",
    delay: 3500,
    callback: watcherWriteSnapshot.bind(undefined, ""),
  });

  await watcherProcessChangesSinceSnapshot("");

  // keep running;
  setInterval(() => {
    tuiPrintInformation(`oops i did it again... ${i++}`);
    watcherWriteSnapshot("");

    if (i === 3) {
      debugEnable();
    }

    if (Math.random() > 0.5) {
      tuiAttachStream(
        createReadStream(
          pathJoin(dirnameForModule(import.meta), "../../package.json"),
        ),
      );
    }
  }, 3000);
}
