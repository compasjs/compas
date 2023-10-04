import { spawn as cpSpawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { isNil } from "@compas/stdlib";
import treeKill from "tree-kill";
import { debugPrint } from "../../shared/output.js";

/**
 * Setup exit listener
 *
 * @param {import("./state.js").State} state
 */
export function actionsInit(state) {
  const exitHandler = () => {
    if (state.screen.activeProcess?.cp) {
      // @ts-expect-error
      process.kill(state.screen.activeProcess.cp.pid);
    }
  };

  process.once("exit", exitHandler);
}

/**
 * Determine which actions are available from the config.
 *
 * @param {import("./state.js").State} state
 */
export function actionsUpdateInfo(state) {
  if (isNil(state.cache.config)) {
    state.screen.navigationStack = [];
    return;
  }

  if (state.screen.navigationStack[0] !== state.cache.config) {
    state.screen.navigationStack = [state.cache.config];
  }

  /**
   * @type {import("../../generated/common/types.js").CompasResolvedConfig}
   */
  // @ts-expect-error
  const currentProject = state.screen.navigationStack.at(-1);

  state.screen.actionGroups = [
    {
      title: "Navigation",
      actions: [
        state.screen.navigationStack.length > 1
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

  if (Object.keys(state.cache.dynamicAvailableActions ?? {}).length > 0) {
    state.screen.actionGroups.push({
      title: "Dynamic actions:",
      actions: Object.values(state.cache.dynamicAvailableActions).map((it) => ({
        shortcut: it.shortcut,
        name: it.name,
      })),
    });
  }

  if (currentProject.actions?.length) {
    state.screen.actionGroups.push(
      {
        title: "Configured actions:",
        actions: [
          ...currentProject.actions.map((it) => ({
            shortcut: it.shortcut,
            name: it.name,
          })),
        ],
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
 * Handle keypress events
 *
 * @param {import("./state.js").State} state
 * @param {{
 *   name: string
 * }} key
 * @returns {Promise<void>}
 */
export async function actionsHandleKeypress(state, key) {
  const name = key.name.toLowerCase();

  if (state.screen.state === "action") {
    if (name === "k") {
      return actionsKillAction(state);
    } else if (name === "r") {
      return actionsRestartAction(state);
    }

    // Ignore any other keypress when an action is running.
    return;
  }

  if (name === "b" && state.screen.navigationStack.length > 1) {
    state.screen.navigationStack.pop();
    return;
  }

  if (name === "q" && state.screen.navigationStack.length <= 1) {
    return state.exit();
  }

  if (Object.keys(state.cache.dynamicAvailableActions ?? {}).length > 0) {
    for (const [key, action] of Object.entries(
      state.cache.dynamicAvailableActions,
    )) {
      if (action.shortcut.toLowerCase() === name) {
        state.logInformation(`Executing '${action.name}'...`);

        if (isNil(state.dynamicActionCallbacks[key])) {
          debugPrint(`Couldn't find a dynamicActionCallback for '${name}'`);
          return;
        }

        await state.dynamicActionCallbacks[key](state);

        return;
      }
    }
  }

  /**
   * @type {import("../../generated/common/types.js").CompasResolvedConfig}
   */
  // @ts-expect-error
  const currentProject = state.screen.navigationStack.at(-1);

  for (let i = 0; i < currentProject.projects.length; ++i) {
    if (name === String(i + 1)) {
      state.screen.navigationStack.push(currentProject.projects[i]);
      return;
    }
  }

  for (const action of currentProject.actions ?? []) {
    if (action.shortcut.toLowerCase() === name) {
      await actionsSpawnAction(state, {
        command: action.command,
        workingDirectory: currentProject.rootDirectory,
      });
      return;
    }
  }
}

/**
 * Spawn the provided action
 *
 * @param {import("./state.js").State} state
 * @param {{
 *   command: string[],
 *   workingDirectory: string,
 * }} action
 * @returns {void}
 */
function actionsSpawnAction(state, action) {
  state.clearScreen();
  state.screen.state = "action";

  state.logPersistent((cursor) =>
    cursor
      .reset()
      .write("> Spawning '")
      .fg.magenta()
      .write(action.command.join(" "))
      .reset()
      .write("'\n"),
  );

  state.screen.activeProcess = {
    command: action.command,
    workingDirectory: action.workingDirectory,
    startTime: Date.now(),
    cp: cpSpawn(action.command[0], action.command.slice(1), {
      cwd: action.workingDirectory,
      env: {
        ...state.env.hostEnv,
      },
      stdio: ["ignore", "inherit", "inherit"],
    }),
  };

  // Separate listeners for screen reset and user information
  state.screen.activeProcess.cp.once("exit", (status) => {
    actionsOnExit(state, status);
  });
  state.screen.activeProcess.cp.once("exit", () => {
    actionsResetState(state);
  });
}

/**
 * Force kill the active action
 *
 * @param {import("./state.js").State} state
 * @returns {Promise<void>}
 */
async function actionsKillAction(state) {
  if (!state.screen.activeProcess) {
    return;
  }

  await Promise.all([
    once(state.screen.activeProcess.cp, "exit"),
    new Promise((r) => {
      // @ts-expect-error
      treeKill(state.screen.activeProcess.cp.pid, r);
    }),
  ]);
}

/**
 * Restart the active action
 *
 * @param {import("./state.js").State} state
 * @returns {Promise<void>}
 */
async function actionsRestartAction(state) {
  if (!state.screen.activeProcess) {
    return;
  }

  state.screen.activeProcess.cp.removeAllListeners("exit");
  state.screen.activeProcess.cp.once("exit", (status) => {
    actionsOnExit(state, status);
  });

  await Promise.all([
    once(state.screen.activeProcess.cp, "exit"),
    new Promise((r) => {
      if (state.screen.activeProcess) {
        // @ts-expect-error
        treeKill(state.screen.activeProcess.cp.pid, r);
      } else {
        // @ts-expect-error
        r();
      }
    }),
  ]);

  // Respawn action
  actionsSpawnAction(state, {
    command: state.screen.activeProcess.command,
    workingDirectory: state.screen.activeProcess.workingDirectory,
  });
}

/**
 * Cleanup process state
 *
 * @param {import("./state.js").State} state
 * @returns {void}
 */
function actionsResetState(state) {
  delete state.screen.activeProcess;

  state.screen.state = "idle";
  state.paintScreen();
}

/**
 * Handle process exit
 *
 * @param {import("./state.js").State} state
 * @param {any} status
 * @returns {void}
 */
function actionsOnExit(state, status) {
  if (isNil(state.screen.activeProcess)) {
    return;
  }

  const elapsedTime = Number(
    (Date.now() - state.screen.activeProcess.startTime) / 1000,
  ).toFixed(1);

  if (status === 0) {
    state.logPersistent((cursor) =>
      cursor
        .reset()
        .fg.green()
        .write(`> Action completed in ${elapsedTime}s.\n`)
        .reset(),
    );
  } else if (status) {
    state.logPersistent((cursor) =>
      cursor
        .reset()
        .fg.red()
        .write(`> Action failed in ${elapsedTime}s.\n`)
        .reset(),
    );
  } else {
    state.logPersistent((cursor) =>
      cursor
        .reset()
        .fg.yellow()
        .write(`> Action stopped after ${elapsedTime}s.\n`)
        .reset(),
    );
  }
}
