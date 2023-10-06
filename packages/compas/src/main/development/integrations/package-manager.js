import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { exec, isNil, pathJoin } from "@compas/stdlib";
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
    state.cache.packageManagerSourceFiles = {};

    for (const dir of state.cache.rootDirectories ?? []) {
      state.cache.packageManager[dir] = packageManagerDetermine(dir);
    }

    state.logInformation("Checking if node_modules is up-to-date...");
    await packageManagerExec(state);
  },

  async onExternalChanges(state, { filePaths }) {
    state.cache.packageManagerSourceFiles ??= {};

    const packageManagerFiles = filePaths.filter(
      (it) =>
        it.endsWith("package.json") ||
        PACKAGE_MANAGER_LOCK_FILES.some((lockfile) => it.endsWith(lockfile)),
    );

    let hasPackageManagerChange = false;

    for (const packageManagerFile of packageManagerFiles) {
      if (!existsSync(packageManagerFile)) {
        // File is deleted
        delete state.cache.packageManagerSourceFiles[packageManagerFile];
        hasPackageManagerChange = true;
        continue;
      }

      const sourceHash = createHash("sha256")
        .update(await readFile(packageManagerFile, "utf-8"))
        .digest("hex");

      if (
        isNil(state.cache.packageManagerSourceFiles[packageManagerFile]) ||
        state.cache.packageManagerSourceFiles[packageManagerFile] !== sourceHash
      ) {
        // First change for this cached start.
        state.cache.packageManagerSourceFiles[packageManagerFile] = sourceHash;
        hasPackageManagerChange = true;

        // TODO: We currently exec the package manager in all root directories. A first
        //   optimization should be to only run the package manager in the changed root
        //   directories instead of in all root directories.
      }
    }

    let hasLockFileChange = false;

    // Cleanup old rootDirectories
    for (const key of Object.keys(state.cache.packageManager ?? {})) {
      if (!state.cache.rootDirectories?.includes(key)) {
        delete state.cache.packageManager?.[key];
      }
    }

    for (const rootDirectory of state.cache.rootDirectories ?? []) {
      // Unknown root directory
      if (isNil(state.cache.packageManager?.[rootDirectory])) {
        // @ts-expect-error
        state.cache.packageManager[rootDirectory] =
          packageManagerDetermine(rootDirectory);
        hasLockFileChange = true;

        continue;
      }

      const lockfilePaths = PACKAGE_MANAGER_LOCK_FILES.map((it) =>
        pathJoin(rootDirectory, it),
      );

      // The package manager changed for this root directory.
      if (filePaths.some((it) => lockfilePaths.includes(it))) {
        const packageManager = packageManagerDetermine(rootDirectory);
        if (
          packageManager.name !==
          state.cache.packageManager?.[rootDirectory]?.name
        ) {
          // @ts-expect-error
          state.cache.packageManager[rootDirectory] = packageManager;
          hasLockFileChange = true;
        }
      }
    }

    if (hasLockFileChange || hasPackageManagerChange) {
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
