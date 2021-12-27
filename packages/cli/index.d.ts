export type CliWatchOptions = import("./src/utils").CliWatchOptions;
export type CliCommandDefinitionInput =
  import("./src/generated/common/types").CliCommandDefinition;
export type CliResult = import("./src/cli/types").CliResult;
export type CliExecutorState = import("./src/cli/types").CliExecutorState;
export { test, mainTestFn, newTestEvent } from "./src/testing/index.js";
export { bench, mainBenchFn } from "./src/benchmarking/index.js";
export {
  watcherKillProcess,
  watcherRun,
  watcherRunWithSpawn,
} from "./src/watcher.js";
//# sourceMappingURL=index.d.ts.map
