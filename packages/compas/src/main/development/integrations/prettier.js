import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { exec, isNil, pathJoin } from "@compas/stdlib";
import { writeFileChecked } from "../../../shared/fs.js";
import { actionsSpawnAction } from "../actions.js";
import { cacheRemoveDynamicAction } from "../cache.js";

const PRETTIER_RUN_ACTION = "prettierRunAction";

let _prettierInterval = undefined;

/**
 * @type {import("./base.js").Integration}
 */
export const prettierIntegration = {
  getStaticName() {
    return "prettier";
  },

  async onColdStart(state) {
    state.dynamicActionCallbacks ??= {};
    state.dynamicActionCallbacks[PRETTIER_RUN_ACTION] = prettierRunAction;

    await prettierDetectInformation(state);

    if (state.cache.prettier) {
      _prettierInterval = prettierCheckFilesInterval(state);
    }
  },

  onCachedStart(state) {
    state.dynamicActionCallbacks ??= {};
    state.dynamicActionCallbacks[PRETTIER_RUN_ACTION] = prettierRunAction;

    if (state.cache.prettier) {
      _prettierInterval = prettierCheckFilesInterval(state);
    }
  },

  async onExternalChanges(state, { filePaths }) {
    const packageJsonChange = filePaths.some((it) =>
      it.endsWith("./package.json"),
    );
    const configChange = filePaths.some(
      (it) =>
        it.endsWith(".prettierrc") ||
        it.endsWith(".prettierrc.js") ||
        it.endsWith(".prettierrc.cjs") ||
        it.endsWith(".prettierrc.mjs") ||
        it.endsWith(".prettierrc.json"),
    );

    if (packageJsonChange || configChange) {
      await prettierDetectInformation(state);

      if (state.cache.prettier && isNil(_prettierInterval)) {
        _prettierInterval = prettierCheckFilesInterval(state);
      } else if (isNil(state.cache.prettier) && !isNil(_prettierInterval)) {
        clearInterval(_prettierInterval);
      }
    }

    // TODO: Call Prettier only on the changed files
  },
};

/**
 * @param {import("../state.js").State} state
 * @param {string} rootDirectory
 * @returns {Promise<void>}
 */
async function prettierRunAction(state, rootDirectory) {
  cacheRemoveDynamicAction(state.cache, PRETTIER_RUN_ACTION, rootDirectory);

  const prettierConfig = state.cache.prettier[rootDirectory];

  if (isNil(prettierConfig)) {
    return;
  }

  const prettierCommand = await prettierFormatCommand(state, rootDirectory);

  // TODO: Pretty command for display. Currently the whole list of args is displayed.
  actionsSpawnAction(state, {
    command: ["prettier", "--write", ...prettierCommand, "."],
    workingDirectory: rootDirectory,
  });
}

async function prettierFormatCommand(state, rootDirectory) {
  const prettierCacheLocation = "./.cache/prettier/.cache";

  const prettierConfig = state.cache.prettier[rootDirectory];

  const prettierCommand = [
    "--list-different",
    "--cache",
    "--cache-strategy",
    "content",
    "--cache-location",
    prettierCacheLocation,
    "--ignore-unknown",
    "--no-error-on-unmatched-pattern",
  ];

  if (prettierConfig.configValue.type === "compasEslintPlugin") {
    await writeFileChecked(
      pathJoin(rootDirectory, "./.cache/compas/.prettierrc.js"),
      `module.exports = require("@compas/eslint-plugin/prettierrc");\n`,
    );

    prettierCommand.push(
      "--config",
      pathJoin(rootDirectory, "./.cache/compas/.prettierrc.js"),
    );
  }

  return prettierCommand;
}

/**
 * @param {import("../state.js").State} state
 * @returns {Promise<void>}
 */
async function prettierDetectInformation(state) {
  state.cache.prettier = {};

  for (const rootDirectory of state.cache.rootDirectories) {
    const packageJson = JSON.parse(
      await readFile(pathJoin(rootDirectory, "package.json"), "utf-8"),
    );

    const hasCompasEslintPlugin =
      !!packageJson.dependencies?.["@compas/eslint-plugin"] ||
      !!packageJson.devDependencies?.["@compas/eslint-plugin"];

    const hasConfig =
      !!packageJson.prettier ||
      existsSync(pathJoin(rootDirectory, ".prettierrc")) ||
      existsSync(pathJoin(rootDirectory, ".prettierrc.js")) ||
      existsSync(pathJoin(rootDirectory, ".prettierrc.cjs")) ||
      existsSync(pathJoin(rootDirectory, ".prettierrc.mjs")) ||
      existsSync(pathJoin(rootDirectory, ".prettierrc.json"));

    if (hasCompasEslintPlugin && !hasConfig) {
      state.cache.prettier[rootDirectory] = {
        configValue: {
          type: "compasEslintPlugin",
        },
      };
    } else {
      state.cache.prettier[rootDirectory] = {
        configValue: {
          type: "default",
        },
      };
    }
  }
}

function prettierCheckFilesInterval(state) {
  return setInterval(() => {
    state.runTask("prettierBackgroundCheck", prettierBackgroundCheck);
  }, 10000);
}

/**
 * @param {import("../state.js").State} state
 * @returns {Promise<void>}
 */
async function prettierBackgroundCheck(state) {
  await Promise.all(
    state.cache.rootDirectories.map(async (rootDirectory) => {
      cacheRemoveDynamicAction(state.cache, PRETTIER_RUN_ACTION, rootDirectory);

      const prettierConfig = state.cache.prettier[rootDirectory];

      if (isNil(prettierConfig)) {
        return;
      }

      const prettierCommand = await prettierFormatCommand(state, rootDirectory);

      const { exitCode } = await exec(
        `prettier ${prettierCommand.join(" ")} .`,
        {
          cwd: rootDirectory,
        },
      );

      if (exitCode !== 0) {
        state.cache.dynamicAvailableActions.push({
          name: `Format files with Prettier`,
          shortcut: "F",
          callback: PRETTIER_RUN_ACTION,
          rootDirectory,
        });
        state.debouncedOnExternalChanges.refresh();
      }
    }),
  );
}
