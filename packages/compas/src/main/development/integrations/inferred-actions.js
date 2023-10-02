import {
  inferDevCommand,
  inferLintCommand,
  inferTestCommand,
} from "../../../shared/inferred-actions.js";

/**
 * @type {import("./base.js").Integration}
 */
export const inferredActionsIntegration = {
  getStaticName() {
    return "inferredActions";
  },

  async onColdStart(state) {
    await inferredActionsResolve(state);
  },

  async onExternalChanges(state, { filePaths }) {
    const hasPackageJsonOrConfigChange = filePaths.some(
      (it) => it.endsWith("package.json") || it.endsWith("config/compas.json"),
    );

    if (hasPackageJsonOrConfigChange) {
      await inferredActionsResolve(state);
    }
  },
};

/**
 * @param {import("../state.js").State} state
 */
async function inferredActionsResolve(state) {
  state.cache.availableActions = {};

  for (const dir of state.cache.rootDirectories ?? []) {
    // @ts-expect-error
    state.cache.availableActions[dir] = [
      {
        name: "Dev",
        command: await inferDevCommand(dir),
      },
      {
        name: "Lint",
        command: await inferLintCommand(dir),
      },
      {
        name: "Test",
        command: await inferTestCommand(dir),
      },
    ].filter((it) => it.command);
  }
}
