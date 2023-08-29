import { spawn as cpSpawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import treeKill from "tree-kill";
import { BaseIntegration } from "./base.js";

export class ActionsIntegration extends BaseIntegration {
  constructor(state) {
    super(state, "actions");

    /**
     * @type {import("../../../generated/common/types.js").CompasResolvedConfig[]}
     */
    this.navigationStack = [];
  }

  async init() {
    await super.init();

    if (this.state.cache.config) {
      this.navigationStack = [this.state.cache.config];
    }

    /**
     * @type {undefined|{
     *   cp: import("child_process").ChildProcess,
     *   command: string[],
     *   workingDirectory: string,
     *   startTime: number,
     *   boundResetState: () => void,
     * }}
     */
    this.activeProcess = undefined;

    this.setActionsGroups();

    if (this.state.screen.state === "idle") {
      this.state.paintScreen();
    }
  }

  async onConfigUpdated() {
    await super.onConfigUpdated();

    // @ts-expect-error
    this.navigationStack = [this.state.cache.config];
    this.setActionsGroups();

    if (this.state.screen.state === "idle") {
      this.state.paintScreen();
    }
  }

  async onExit() {
    await new Promise((r) => {
      if (this.activeProcess) {
        // @ts-expect-error
        treeKill(this.activeProcess.cp.pid, r);
      } else {
        // @ts-expect-error
        r();
      }
    });
  }

  async onKeypress(key) {
    await super.onKeypress(key);

    const name = key.name.toLowerCase();

    if (this.state.screen.state === "action") {
      if (name === "k") {
        return this.killAction();
      } else if (name === "r") {
        return this.restartAction();
      }

      // Ignore any other keypress when an action is running.
      return;
    }

    if (name === "b" && this.navigationStack.length > 1) {
      this.navigationStack.pop();

      this.setActionsGroups();
      this.state.paintScreen();
      return;
    }

    if (name === "q" && this.navigationStack.length === 1) {
      return this.state.exit();
    }

    /**
     * @type {import("../../../generated/common/types.js").CompasResolvedConfig}
     */
    // @ts-expect-error
    const currentProject = this.navigationStack.at(-1);

    for (let i = 0; i < currentProject.projects.length; ++i) {
      if (name === String(i + 1)) {
        this.navigationStack.push(currentProject.projects[i]);

        this.setActionsGroups();
        this.state.paintScreen();
        return;
      }
    }

    for (const action of currentProject.actions ?? []) {
      if (action.shortcut.toLowerCase() === name) {
        await this.spawnAction({
          command: action.command,
          workingDirectory: currentProject.rootDirectory,
        });
        return;
      }
    }
  }

  setActionsGroups() {
    /**
     * @type {import("../../../generated/common/types.js").CompasResolvedConfig}
     */
    // @ts-expect-error
    const currentProject = this.navigationStack.at(-1);

    this.state.screen.actionGroups = [
      {
        title: "Navigation",
        actions: [
          this.navigationStack.length > 1
            ? {
                shortcut: "B",
                name: "Back",
              }
            : {
                shortcut: "Q",
                name: "Quit",
              },
          ...currentProject.projects.map((it, idx) => ({
            shortcut: String(idx + 1),
            name: path.relative(currentProject.rootDirectory, it.rootDirectory),
          })),
        ],
      },
    ];

    if (currentProject.actions?.length) {
      this.state.screen.actionGroups.push(
        {
          title: "Available actions:",
          actions: currentProject.actions.map((it) => ({
            shortcut: it.shortcut,
            name: it.name,
          })),
        },
        {
          title: "Shortcuts while an action is active:",
          actions: [
            {
              shortcut: "K",
              name: "Kill action",
            },
            {
              shortcut: "R",
              name: "Restart action",
            },
          ],
        },
      );
    }
  }

  /**
   * @param {{
   *   command: string[],
   *   workingDirectory: string
   * }} action
   * @returns {void}
   */
  spawnAction(action) {
    this.state.clearScreen();
    this.state.screen.state = "action";

    this.state.logPersistent((cursor) =>
      cursor
        .reset()
        .write("> Spawning '")
        .fg.magenta()
        .write(action.command.join(" "))
        .reset()
        .write("'\n"),
    );

    this.activeProcess = {
      command: action.command,
      workingDirectory: action.workingDirectory,
      startTime: Date.now(),
      cp: cpSpawn(action.command[0], action.command.slice(1), {
        cwd: action.workingDirectory,
        stdio: ["ignore", "inherit", "inherit"],
      }),
      boundResetState: this.resetState.bind(this),
    };

    // Separate listeners for screen reset and user information
    this.activeProcess.cp.once("exit", this.onActionExit.bind(this));
    this.activeProcess.cp.once("exit", this.activeProcess.boundResetState);
  }

  async killAction() {
    if (!this.activeProcess) {
      return;
    }

    await Promise.all([
      once(this.activeProcess.cp, "exit"),
      new Promise((r) => {
        // @ts-expect-error
        treeKill(this.activeProcess.cp.pid, r);
      }),
    ]);
  }

  async restartAction() {
    if (!this.activeProcess) {
      return;
    }

    this.activeProcess.cp.removeAllListeners("exit");
    this.activeProcess.cp.once("exit", this.onActionExit.bind(this));

    await Promise.all([
      once(this.activeProcess.cp, "exit"),
      new Promise((r) => {
        if (this.activeProcess) {
          // @ts-expect-error
          treeKill(this.activeProcess.cp.pid, r);
        } else {
          // @ts-expect-error
          r();
        }
      }),
    ]);

    // Respawn action
    this.spawnAction({
      command: this.activeProcess.command,
      workingDirectory: this.activeProcess.workingDirectory,
    });
  }

  resetState() {
    delete this.activeProcess;

    this.state.screen.state = "idle";
    this.state.paintScreen();
  }

  onActionExit(status) {
    if (!this.activeProcess) {
      return;
    }

    const elapsedTime = Number(
      (Date.now() - this.activeProcess.startTime) / 1000,
    ).toFixed(1);

    if (status === 0) {
      this.state.logPersistent((cursor) =>
        cursor
          .reset()
          .fg.green()
          .write(`> Action completed in ${elapsedTime}s.\n`)
          .reset(),
      );
    } else if (status) {
      this.state.logPersistent((cursor) =>
        cursor
          .reset()
          .fg.red()
          .write(`> Action failed in ${elapsedTime}s.\n`)
          .reset(),
      );
    } else {
      this.state.logPersistent((cursor) =>
        cursor
          .reset()
          .fg.yellow()
          .write(`> Action stopped after ${elapsedTime}s.\n`)
          .reset(),
      );
    }
  }
}
