import { AppError } from "@compas/stdlib";
import ansi from "ansi";
import {
  debugPrint,
  debugTimeEnd,
  debugTimeStart,
} from "../../shared/output.js";
import {
  actionsHandleKeypress,
  actionsInit,
  actionsUpdateInfo,
} from "./actions.js";
import { cacheLoad, cachePersist } from "./cache.js";
import { cacheCleanupIntegration } from "./integrations/cache-cleanup.js";
import { configLoaderIntegration } from "./integrations/config-loader.js";
import { dockerIntegration } from "./integrations/docker.js";
import { inferredActionsIntegration } from "./integrations/inferred-actions.js";
import { packageManagerIntegration } from "./integrations/package-manager.js";
import { prettierIntegration } from "./integrations/prettier.js";
import { rootDirectoriesIntegration } from "./integrations/root-directories.js";
import { tuiClearScreen, tuiExit, tuiInit, tuiPaint } from "./tui.js";
import {
  watchersExit,
  watchersInit,
  watchersRefresh,
  watchersWriteSnapshot,
} from "./watchers.js";

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
     *   navigationStack:
     *   import("../../generated/common/types.js").CompasResolvedConfig[], activeProcess:
     *   (undefined|{ cp: import("child_process").ChildProcess, command: string[],
     *   workingDirectory: string, startTime: number,
     *   }),
     * }}
     */
    this.screen = {
      ghostOutputLineCount: 0,
      state: "idle",
      actionGroups: [],
      navigationStack: [],
      activeProcess: undefined,
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
     * @type {Record<string, (state: State, rootDirectory: string) => (void|Promise<void>)>}
     */
    this.dynamicActionCallbacks = {};

    /**
     * @type {import("./integrations/base.js").Integration[]}
     */
    this.integrations = [
      configLoaderIntegration,
      rootDirectoriesIntegration,
      cacheCleanupIntegration,
      packageManagerIntegration,
      inferredActionsIntegration,
      prettierIntegration,
      dockerIntegration,
    ];

    /**
     * @type {Record<string, import("@parcel/watcher").AsyncSubscription>}
     */
    this.directorySubscriptions = {};

    /**
     * @type {{
     *   filePaths: string[],
     * }}
     */
    this.externalChanges = {
      filePaths: [],
    };

    const boundOnExternalChanges = this.onExternalChanges.bind(this);

    /**
     * @type {NodeJS.Timer}
     */
    this.debouncedOnExternalChanges = setTimeout(boundOnExternalChanges, 50);

    /**
     * @type {import("../../generated/common/types.js").CompasCache}
     */
    this.cache = {
      version: "unknown",
      dynamicAvailableActions: [],
    };
  }

  // ==== generic lifecycle ====

  async init() {
    debugTimeStart(`State#init`);
    debugPrint("State#init");

    tuiInit(this);
    actionsInit(this);

    const { empty, cache } = await cacheLoad(this.env.compasVersion);

    if (empty) {
      this.logInformation("Starting up...");
    } else {
      this.logInformation("Starting up from cache...");
    }

    this.cache = cache;

    if (empty) {
      for (const integration of this.integrations) {
        if (integration.onColdStart) {
          debugPrint(`${integration.getStaticName()} :: onColdStart`);
          await integration.onColdStart(this);
        }
      }
    } else {
      for (const integration of this.integrations) {
        if (integration.onCachedStart) {
          debugPrint(`${integration.getStaticName()} :: onCachedStart`);
          await integration.onCachedStart(this);
        }
      }
    }

    actionsUpdateInfo(this);
    if (this.screen.state === "idle") {
      this.paintScreen();
    }

    await cachePersist(this.cache);
    await watchersInit(this);
    await watchersWriteSnapshot(this);

    debugTimeEnd(`State#init`);
  }

  async exit() {
    debugPrint("State#exit");

    await watchersExit(this);

    tuiExit(this);
    process.exit();
  }

  // === user information ===

  // TODO: Rethink log information.
  //   - We log a lot of duplicate info
  //   - Information is often not relevant after running an action.
  //   - In some cases information + action combined gives the full picture.

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
   * @param {string} line
   */
  logInformationUnique(line) {
    debugPrint(`State#logInformationUnique :: ${line}`);

    if (this.information.includes(line)) {
      this.information.splice(this.information.indexOf(line), 1);
    }

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

  // ==== background tasks ====

  /**
   * Start a promise in the background.
   *
   * @param {string} name
   * @param {Promise|((state: State) => Promise<any>)} task
   * @param {{
   *   exitOnFailure?: boolean,
   * }} [options]
   * @returns {*}
   */
  runTask(name, task, { exitOnFailure } = {}) {
    if (typeof task === "function") {
      return this.runTask(name, task(this), { exitOnFailure });
    }

    if (!(task instanceof Promise)) {
      throw AppError.serverError({
        message: "Received a task that isn't a promise.",
        name,
        task,
      });
    }

    const _self = this;

    debugPrint(`State#runTask :: ${name} :: registered`);

    task
      .then(() => {
        debugPrint(`State#runTask :: ${name} :: fulfilled`);
      })
      .catch((e) => {
        debugPrint(`State#runTask :: ${name} :: rejected`);
        debugPrint(AppError.format(e));

        if (exitOnFailure) {
          _self.runTask("State#exit", _self.exit());
        }
      });
  }

  // ==== integrations ====

  async onExternalChanges() {
    const changes = {
      ...this.externalChanges,
    };

    this.externalChanges = {
      filePaths: [],
    };

    debugPrint(`State#onExternalChanges`);
    debugPrint(changes);

    for (const integration of this.integrations) {
      if (integration.onExternalChanges) {
        debugPrint(`${integration.getStaticName()} :: onExternalChanges`);
        await integration.onExternalChanges(this, changes);
      }
    }

    actionsUpdateInfo(this);
    if (this.screen.state === "idle") {
      this.paintScreen();
    }

    await cachePersist(this.cache);
    await watchersRefresh(this);
    await watchersWriteSnapshot(this);
  }

  /**
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

    // Rename a few keypress for easier matching and shorter shortcuts, we may want to
    // expand this setup later.
    if (key.name === "escape") {
      key.name = "esc";
    }

    await actionsHandleKeypress(this, key);

    actionsUpdateInfo(this);
    if (this.screen.state === "idle") {
      this.paintScreen();
    }
  }
}
