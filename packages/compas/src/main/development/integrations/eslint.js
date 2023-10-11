import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { exec, isNil, pathJoin } from "@compas/stdlib";
import { writeFileChecked } from "../../../shared/fs.js";
import { actionsSpawnAction } from "../actions.js";
import { cacheRemoveDynamicAction } from "../cache.js";

const ESLINT_RUN_ACTION = "eslintRunAction";

let _eslintTimeout = undefined;

/**
 * @type {import("./base.js").Integration}
 */
export const eslintIntegration = {
  getStaticName() {
    return "eslint";
  },

  async onColdStart(state) {
    state.dynamicActionCallbacks ??= {};
    state.dynamicActionCallbacks[ESLINT_RUN_ACTION] = eslintRunAction;

    await eslintDetectInformation(state);

    if (state.cache.eslint) {
      eslintRefreshBackgroundCheckTimeout(state);
    }
  },

  onCachedStart(state) {
    state.dynamicActionCallbacks ??= {};
    state.dynamicActionCallbacks[ESLINT_RUN_ACTION] = eslintRunAction;

    if (state.cache.eslint) {
      eslintRefreshBackgroundCheckTimeout(state);
    }
  },

  async onExternalChanges(state, { filePaths }) {
    const packageJsonChange = filePaths.some((it) =>
      it.endsWith("./package.json"),
    );
    const configChange = filePaths.some(
      (it) =>
        it.endsWith(".eslintrc") ||
        it.endsWith(".eslintrc.js") ||
        it.endsWith(".eslintrc.cjs") ||
        it.endsWith(".eslintrc.mjs") ||
        it.endsWith(".eslintrc.json"),
    );

    if (packageJsonChange || configChange) {
      await eslintDetectInformation(state);
    }

    if (packageJsonChange || configChange || filePaths.length > 0) {
      if (state.cache.eslint) {
        eslintRefreshBackgroundCheckTimeout(state);
      } else if (isNil(state.cache.eslint) && !isNil(_eslintTimeout)) {
        clearTimeout(_eslintTimeout);
        _eslintTimeout = undefined;
      }
    }
  },
};

/**
 * @param {import("../state.js").State} state
 * @param {string} rootDirectory
 * @returns {Promise<void>}
 */
async function eslintRunAction(state, rootDirectory) {
  cacheRemoveDynamicAction(state.cache, ESLINT_RUN_ACTION, rootDirectory);

  const eslintConfig = state.cache.eslint?.[rootDirectory];

  if (isNil(eslintConfig)) {
    return;
  }

  const eslintCommand = await eslintFormatCommand(state, rootDirectory);

  // TODO: Pretty command for display. Currently the whole list of args is displayed.
  actionsSpawnAction(state, {
    command: ["eslint", "--fix", ...eslintCommand, "."],
    workingDirectory: rootDirectory,
  });
}

async function eslintFormatCommand(state, rootDirectory) {
  const eslintCacheLocation = "./.cache/eslint/";

  const eslintConfig = state.cache.eslint[rootDirectory];

  const eslintCommand = [
    "--no-error-on-unmatched-pattern",
    "--cache",
    "--cache-strategy",
    "content",
    "--cache-location",
    eslintCacheLocation,
    "--no-error-on-unmatched-pattern",
  ];

  if (eslintConfig.configValue.type === "compasEslintPlugin") {
    await writeFileChecked(
      pathJoin(rootDirectory, "./.cache/compas/.eslintrc"),
      `{ "extends": ["plugin:@compas/full"] }\n`,
    );

    eslintCommand.push(
      "--config",
      pathJoin(rootDirectory, "./.cache/compas/.eslintrc"),
      "--no-eslintrc",
    );
  }

  return eslintCommand;
}

/**
 * @param {import("../state.js").State} state
 * @returns {Promise<void>}
 */
async function eslintDetectInformation(state) {
  state.cache.eslint = {};

  for (const rootDirectory of state.cache.rootDirectories ?? []) {
    const packageJson = JSON.parse(
      await readFile(pathJoin(rootDirectory, "package.json"), "utf-8"),
    );

    const hasCompasEslintPlugin =
      !!packageJson.dependencies?.["@compas/eslint-plugin"] ||
      !!packageJson.devDependencies?.["@compas/eslint-plugin"];

    const hasConfig =
      !!packageJson.eslintConfig ||
      existsSync(pathJoin(rootDirectory, ".eslintrc")) ||
      existsSync(pathJoin(rootDirectory, ".eslintrc.js")) ||
      existsSync(pathJoin(rootDirectory, ".eslintrc.cjs")) ||
      existsSync(pathJoin(rootDirectory, ".eslintrc.mjs")) ||
      existsSync(pathJoin(rootDirectory, ".eslintrc.json"));

    if (hasCompasEslintPlugin && !hasConfig) {
      state.cache.eslint[rootDirectory] = {
        configValue: {
          type: "compasEslintPlugin",
        },
      };
    } else if (hasConfig) {
      state.cache.eslint[rootDirectory] = {
        configValue: {
          type: "default",
        },
      };
    }
  }

  if (Object.keys(state.cache.eslint).length === 0) {
    delete state.cache.eslint;
  }
}

function eslintRefreshBackgroundCheckTimeout(state) {
  if (_eslintTimeout) {
    _eslintTimeout.refresh();
  } else {
    _eslintTimeout = setTimeout(() => {
      state.runTask("eslintBackgroundCheck", eslintBackgroundCheck);
    }, 200);
  }
}

/**
 * @param {import("../state.js").State} state
 * @returns {Promise<void>}
 */
async function eslintBackgroundCheck(state) {
  await Promise.all(
    (state.cache.rootDirectories ?? []).map(async (rootDirectory) => {
      cacheRemoveDynamicAction(state.cache, ESLINT_RUN_ACTION, rootDirectory);

      const eslintConfig = state.cache.eslint?.[rootDirectory];

      if (isNil(eslintConfig)) {
        return;
      }

      const eslintCommand = await eslintFormatCommand(state, rootDirectory);

      const { exitCode } = await exec(`eslint ${eslintCommand.join(" ")} .`, {
        cwd: rootDirectory,
      });

      if (exitCode !== 0) {
        state.cache.dynamicAvailableActions.push({
          name: `Lint files with ESLint`,
          shortcut: "L",
          callback: ESLINT_RUN_ACTION,
          rootDirectory,
        });
        state.debouncedOnExternalChanges.refresh();
      }
    }),
  );
}
