import { BaseIntegration } from "./base.js";

export class RootDirectoriesIntegration extends BaseIntegration {
  constructor(state) {
    super(state, "rootDirectories");
  }

  async init() {
    await super.init();

    if (!this.state.cache.rootDirectories) {
      this.state.cache.rootDirectories = this.resolveRootDirectories();

      await this.state.emitCacheUpdated();
    }
  }

  async onCacheUpdated() {
    await super.onCacheUpdated();

    const existingRootDirectories = [
      ...(this.state.cache.rootDirectories ?? []),
    ];

    const newRootDirectories = this.resolveRootDirectories();

    if (existingRootDirectories.length !== newRootDirectories.length) {
      this.state.cache.rootDirectories = newRootDirectories;
      return this.state.emitCacheUpdated();
    }

    for (const dir of newRootDirectories) {
      if (!existingRootDirectories.includes(dir)) {
        this.state.cache.rootDirectories = newRootDirectories;
        return this.state.emitCacheUpdated();
      }
    }
  }

  resolveRootDirectories() {
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

    handleProject(this.state.cache.config);

    return resolved;
  }
}
