import { setTimeout } from "node:timers";
import { AppError } from "@compas/stdlib";
import ansi from "ansi";
import micromatch from "micromatch";
import {
  debugPrint,
  debugTimeEnd,
  debugTimeStart,
} from "../../shared/output.js";
import { cacheLoad, cachePersist } from "./cache.js";
import { ActionsIntegration } from "./integrations/actions.js";
import { CacheCleanupIntegration } from "./integrations/cache-cleanup.js";
import { ConfigLoaderIntegration } from "./integrations/config-loader.js";
import { FileWatcherIntegration } from "./integrations/file-watcher.js";
import { PackageManagerIntegration } from "./integrations/package-manager.js";
import { RootDirectoriesIntegration } from "./integrations/root-directories.js";
import { tuiClearScreen, tuiExit, tuiInit, tuiPaint } from "./tui.js";

export class State {
  /**
   * @param {import("../../shared/config.js").ConfigEnvironment} env
   */
  constructor(env) {
    /**
     * @type {import("../../shared/config.js").ConfigEnvironment}
     */
    this.env = env;

    /**
     * @type {import("ansi").Cursor}
     */
    this.cursor = ansi(process.stdout);

    /**
     * @type {{
     *   ghostOutputLineCount: number,
     *   state: "idle"|"action",
     *   actionGroups: {
     *     title: string,
     *     actions: {
     *       shortcut: string,
     *       name: string,
     *     }[],
     *   }[],
     * }}
     */
    this.screen = {
      ghostOutputLineCount: 0,
      state: "idle",
      actionGroups: [],
    };

    /**
     * Set of information lines.
     *
     * @type {string[]}
     */
    this.information = [
      "Thank you for trying out the new Compas CLI. This is still a work in progress. Checkout https://github.com/compasjs/compas/issues/2774 for planned features and known issues.",
    ];

    /**
     * @type {import("./integrations/base.js").BaseIntegration[]}
     */
    this.integrations = [];

    /**
     *
     * @type {{
     *   glob: string,
     *   integration: import("./integrations/base.js").BaseIntegration,
     *   debounceDelay: number,
     *   existingTimeout?: NodeJS.Timeout
     * }[]}
     */
    this.fileChangeRegister = [];

    /**
     * @type {import("../../generated/common/types.js").CompasCache}
     */
    this.cache = {
      version: "unknown",
    };
  }

  // ==== generic ====

  async init() {
    debugTimeStart(`State#init`);
    debugPrint("State#init");

    tuiInit(this);

    const { empty, cache } = await cacheLoad(this.env.compasVersion);

    if (empty) {
      this.logInformation("Starting up...");
    } else {
      this.logInformation("Starting up from cache...");
    }

    this.cache = cache;

    // We start with a separate array, to make sure that we init things in order, without
    // causing reactivity loops.
    const integrations = [
      new ConfigLoaderIntegration(this),
      new RootDirectoriesIntegration(this),
      new CacheCleanupIntegration(this),
      new ActionsIntegration(this),
      new PackageManagerIntegration(this),

      // Should be the last integration, since it will
      new FileWatcherIntegration(this),
    ];

    // Init and add to state
    for (const integration of integrations) {
      await integration.init();

      this.integrations.push(integration);
    }

    debugTimeEnd(`State#init`);
  }

  async exit() {
    debugPrint("State#exit");

    for (const integration of this.integrations) {
      await integration.onExit();
    }

    tuiExit(this);
    process.exit();
  }

  // === user information ===

  /**
   * @param {string} line
   */
  logInformation(line) {
    debugPrint(`State#logInformation :: ${line}`);

    this.information.push(line);

    while (this.information.length > 10) {
      this.information.shift();
    }

    if (this.screen.state === "idle") {
      this.paintScreen();
    }
  }

  /**
   * @param {(cursor: import("ansi").Cursor)=> void} callback
   */
  logPersistent(callback) {
    if (this.screen.state !== "action") {
      throw AppError.serverError({
        message: `Invariant failed. Expected screen state to be in 'action', found '${this.screen.state}'.`,
      });
    }

    this.cursor.reset().buffer();
    callback(this.cursor);
    this.cursor.reset().flush();
  }

  // ==== screen ====

  paintScreen() {
    debugPrint(`State#paintScreen :: ${this.screen.state}`);

    if (this.screen.state !== "idle") {
      throw AppError.serverError({
        message: `Invariant failed. Expected screen state to be in 'idle', found '${this.screen.state}'.`,
      });
    }

    this.clearScreen();

    this.screen.ghostOutputLineCount = tuiPaint(this, {
      compasVersion: this.env.compasVersion,
      appName: this.env.appName,
      information: this.information,
      actionGroups: this.screen.actionGroups,
    });
  }

  clearScreen() {
    debugPrint(`State#clearScreen :: ${this.screen.state}`);

    tuiClearScreen(this, this.screen.ghostOutputLineCount);

    this.screen.ghostOutputLineCount = 0;
  }

  resizeScreen() {
    debugPrint(`State#resizeScreen :: ${this.screen.state}`);

    if (this.screen.state === "idle") {
      this.paintScreen();
    }
  }

  // ==== integrations ====

  /**
   * Notify that the cache is updated.
   *
   * @returns {Promise<void>}
   */
  async emitCacheUpdated() {
    debugPrint(`State#emitCacheUpdated`);

    if (!this.cachePersistTimer) {
      const _self = this;
      this.cachePersistTimer = setTimeout(() => {
        debugPrint("State#emitCacheUpdated :: Running cachePersist");
        cachePersist(_self.cache);
      }, 50);
    } else {
      this.cachePersistTimer.refresh();
    }

    for (const integration of this.integrations) {
      await integration.onCacheUpdated();
    }
  }

  /**
   *
   * @param {{
   *   name: string,
   * }} key
   * @returns {Promise<void>}
   */
  async emitKeypress(key) {
    debugPrint(`State#emitKeypress :: ${JSON.stringify(key)}`);

    if (!key.name) {
      return;
    }

    // Rename a few keypress for easier matching and shorter shortcuts, we may want to expand this setup later.
    if (key.name === "escape") {
      key.name = "esc";
    }

    for (const integration of this.integrations) {
      await integration.onKeypress(key);
    }
  }

  /**
   * Emit file changes to integrations.
   *
   * This is different from most other integrations, in that we match on the registered
   * glob, added to {@link State#fileChangeRegister}, and call with the specified
   * debounce-delay.
   *
   * @param paths
   */
  emitFileChange(paths) {
    debugPrint(`State#emitFileChange :: ${JSON.stringify(paths)}}`);

    for (const integration of this.fileChangeRegister) {
      if (micromatch.some(paths, integration.glob)) {
        debugPrint(
          `State#emitFileChange :: Matched ${integration.glob} for ${integration.integration.name} debouncing with ${integration.debounceDelay}.`,
        );

        if (integration.existingTimeout) {
          integration.existingTimeout.refresh();
        } else {
          integration.existingTimeout = setTimeout(() => {
            // We don't ever clear the timeout, since refreshing will restart the timeout.

            // Dangling promise!
            integration.integration.onFileChanged(paths);
          }, integration.debounceDelay);
        }
      }
    }
  }

  async emitConfigUpdated() {
    debugPrint(`State#emitConfigUpdated`);

    for (const integration of this.integrations) {
      await integration.onConfigUpdated();
    }
  }
}
