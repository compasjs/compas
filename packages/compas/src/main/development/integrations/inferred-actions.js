import { isNil } from "@compas/stdlib";
import {
  inferDevCommand,
  inferLintCommand,
  inferTestCommand,
} from "../../../shared/inferred-actions.js";
import { BaseIntegration } from "./base.js";

export class InferredActionsIntegration extends BaseIntegration {
  constructor(state) {
    super(state, "inferredActions");
  }

  async init() {
    await super.init();

    if (isNil(this.state.cache.availableActions)) {
      await this.resolveAvailableActions();
    }

    this.state.fileChangeRegister.push({
      glob: "**/package.json",
      integration: this,
      debounceDelay: 50,
    });
  }

  async onCacheUpdated() {
    await super.onCacheUpdated();
    await this.resolveAvailableActions();
  }

  async onFileChanged(paths) {
    await super.onFileChanged(paths);
    await this.resolveAvailableActions();
  }

  async resolveAvailableActions() {
    const existingActions = this.state.cache.availableActions ?? {};
    const resolvedActions = {};

    for (const dir of this.state.cache.rootDirectories ?? []) {
      resolvedActions[dir] = [
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

    // @ts-expect-error
    this.state.cache.availableActions = resolvedActions;

    if (
      Object.keys(existingActions).length !==
      Object.keys(resolvedActions).length
    ) {
      await this.state.emitCacheUpdated();
      return;
    }

    if (JSON.stringify(existingActions) !== JSON.stringify(resolvedActions)) {
      await this.state.emitCacheUpdated();
      return;
    }
  }
}
