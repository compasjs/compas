import { configFlatten } from "../../../shared/config.js";
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
  const rootDirectories = state.cache.rootDirectories ?? [];
  const configs = configFlatten(state.cache.config);

  for (const config of configs) {
    if (!rootDirectories.includes(config.rootDirectory)) {
      continue;
    }

    const [dev, lint, test] = await Promise.all([
      inferDevCommand(config.rootDirectory),
      inferLintCommand(config.rootDirectory),
      inferTestCommand(config.rootDirectory),
    ]);
    if (test && !config.actions.find((it) => it.name === "Test")) {
      config.actions.unshift({
        name: "Test",
        shortcut: "T",
        command: test,
      });
    }
    if (
      lint &&
      !config.actions.find((it) => it.name === "Lint" || it.name === "Format")
    ) {
      config.actions.unshift({
        name: "Lint",
        shortcut: "L",
        command: lint,
      });
    }
    if (dev && !config.actions.find((it) => it.name === "Dev")) {
      config.actions.unshift({
        name: "Dev",
        shortcut: "D",
        command: dev,
      });
    }
  }
}
