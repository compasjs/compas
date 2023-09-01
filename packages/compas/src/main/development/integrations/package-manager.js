import { exec } from "@compas/stdlib";
import { packageManagerDetermineInstallCommand } from "../../../shared/package-manager.js";
import { BaseIntegration } from "./base.js";

export class PackageManagerIntegration extends BaseIntegration {
  constructor(state) {
    super(state, "packageManager");
  }

  async init() {
    await super.init();

    if (!this.state.cache.packageManagerInstallCommand) {
      await this.resolve();

      // TODO: do we want to start with an 'await this.execute();'
      //  May want to do that as background task.
    }

    this.state.fileChangeRegister.push({
      glob: "**/package.json",
      integration: this,
      debounceDelay: 150,
    });

    this.state.fileChangeRegister.push({
      glob: "**/{package-lock.json,yarn.lock,pnpm-lock.yaml}",
      integration: this,
      debounceDelay: 100,
    });
  }

  async onCacheUpdated() {
    await super.onCacheUpdated();

    await this.resolve();
  }

  async onFileChanged(paths) {
    await super.onFileChanged(paths);

    let installCommand = false;
    let updateCache = false;

    for (const path of paths) {
      if (path.endsWith("package.json")) {
        installCommand = true;
      }

      if (
        path.endsWith("pnpm-lock.yaml") ||
        path.endsWith("package-lock.json") ||
        path.endsWith("yarn.lock")
      ) {
        updateCache = true;
      }
    }

    if (updateCache) {
      await this.resolve();
    }

    if (installCommand) {
      return this.execute();
    }
  }

  async resolve() {
    const existingMapping = {
      ...this.state.cache.packageManagerInstallCommand,
    };

    const newMapping = {};
    for (const dir of this.state.cache.rootDirectories ?? []) {
      newMapping[dir] = packageManagerDetermineInstallCommand(dir);
    }

    // @ts-expect-error
    this.state.cache.packageManagerInstallCommand = newMapping;

    let hasDiff =
      Object.keys(existingMapping).length !== Object.keys(newMapping).length;

    for (const key of Object.keys(existingMapping)) {
      if (existingMapping[key]?.join(" ") !== newMapping[key]?.join(" ")) {
        hasDiff = true;
      }

      if (hasDiff) {
        break;
      }
    }

    if (hasDiff) {
      await this.state.emitCacheUpdated();
    }
  }

  async execute() {
    // TODO: this again write the package.json on changes, so we may want to prevent
    //  triggering shortly after the last run.

    for (const [dir, command] of Object.entries(
      this.state.cache.packageManagerInstallCommand ?? {},
    )) {
      await exec(command.join(" "), {
        cwd: dir,
      });
    }
  }
}
