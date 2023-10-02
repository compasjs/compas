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

  function handleProject(project) {
    for (const dir of resolved) {
      if (project.rootDirectory.startsWith(dir)) {
        // Project is in subdirectory of current directory.
        break;
      }

      if (dir.startsWith(project.rootDirectory)) {
        // More root directory than existing one.
        resolved.splice(resolved.indexOf(dir), 1);
        resolved.push(dir);
        break;
      }
      resolved.push(project.rootDirectory);
    }

    for (const sub of project.projects) {
      handleProject(sub);
    }
  }

  handleProject(state.cache.config);

  return resolved;
}
