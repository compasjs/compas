import { exec } from "@compas/stdlib";
import {
  PACKAGE_MANAGER_LOCK_FILES,
  packageManagerDetermine,
} from "../../../shared/package-manager.js";
import { BaseIntegration } from "./base.js";

export class PackageManagerIntegration extends BaseIntegration {
  constructor(state) {
    super(state, "packageManager");
  }

  async init() {
    await super.init();

    if (!this.state.cache.packageManager) {
      await this.resolve();

      this.state.runTask("packageManagerExecute", this.execute());
    }

    this.state.fileChangeRegister.push({
      glob: "**/package.json",
      integration: this,
      debounceDelay: 150,
    });

    this.state.fileChangeRegister.push({
      glob: `**/{${PACKAGE_MANAGER_LOCK_FILES.join(",")}}`,
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

      for (const lockfile of PACKAGE_MANAGER_LOCK_FILES) {
        if (path.endsWith(lockfile)) {
          updateCache = true;
        }
      }
    }

    if (updateCache) {
      await this.resolve();
    }

    if (installCommand) {
      this.state.runTask("packageManagerExecute", this.execute());
    }
  }

  async resolve() {
    const existingMapping = {
      ...this.state.cache.packageManager,
    };

    const newMapping = {};
    for (const dir of this.state.cache.rootDirectories ?? []) {
      newMapping[dir] = packageManagerDetermine(dir);
    }

    // @ts-expect-error
    this.state.cache.packageManager = newMapping;

    let hasDiff =
      Object.keys(existingMapping).length !== Object.keys(newMapping).length;

    for (const key of Object.keys(existingMapping)) {
      if (existingMapping[key]?.name !== newMapping[key]?.name) {
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

    for (const [dir, config] of Object.entries(
      this.state.cache.packageManager ?? {},
    )) {
      await exec(config.installCommand, {
        cwd: dir,
      });
    }
  }
}
