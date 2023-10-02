import { exec } from "@compas/stdlib";
import {
  PACKAGE_MANAGER_LOCK_FILES,
  packageManagerDetermine,
} from "../../../shared/package-manager.js";

/**
 * @type {import("./base.js").Integration}
 */
export const packageManagerIntegration = {
  getStaticName() {
    return "packageManager";
  },

  async onColdStart(state) {
    state.cache.packageManager = {};

    for (const dir of state.cache.rootDirectories ?? []) {
      state.cache.packageManager[dir] = packageManagerDetermine(dir);
    }

    await packageManagerExec(state);
  },

  async onExternalChanges(state, { filePaths }) {
    const hasPackageJsonChange = filePaths.some((it) =>
      it.endsWith("package.json"),
    );
    const hasLockFileChange = filePaths.some((it) =>
      PACKAGE_MANAGER_LOCK_FILES.some((lockfile) => it.endsWith(lockfile)),
    );

    if (hasLockFileChange) {
      state.cache.packageManager = {};

      for (const dir of state.cache.rootDirectories ?? []) {
        state.cache.packageManager[dir] = packageManagerDetermine(dir);
      }
    }

    if (hasLockFileChange || hasPackageJsonChange) {
      await packageManagerExec(state);
    }
  },
};

/**
 * @param {import("../state.js").State} state
 * @returns {Promise<void>}
 */
async function packageManagerExec(state) {
  await Promise.all(
    Object.entries(state.cache.packageManager ?? {}).map(([dir, config]) => {
      return exec(config.installCommand, {
        cwd: dir,
      });
    }),
  );
}
