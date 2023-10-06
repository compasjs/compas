import { configFlatten } from "../../../shared/config.js";

/**
 * @type {import("./base.js").Integration}
 */
export const rootDirectoriesIntegration = {
  getStaticName() {
    return "rootDirectories";
  },

  onColdStart(state) {
    state.cache.rootDirectories = rootDirectoriesResolve(state);
  },

  onExternalChanges(state) {
    state.cache.rootDirectories = rootDirectoriesResolve(state);
  },
};

/**
 * @param {import("../state.js").State} state
 */
function rootDirectoriesResolve(state) {
  const resolved = [process.cwd()];
  const configs = configFlatten(state.cache.config);

  for (const config of configs) {
    for (const dir of resolved) {
      if (config.rootDirectory.startsWith(dir)) {
        // Project is in subdirectory of current directory.
        break;
      }

      if (dir.startsWith(config.rootDirectory)) {
        // More root directory than existing one.
        resolved.splice(resolved.indexOf(dir), 1);
        resolved.push(dir);
        break;
      }
      resolved.push(config.rootDirectory);
    }
  }

  return resolved;
}
