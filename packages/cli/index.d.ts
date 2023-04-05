export type CliCommandDefinitionInput =
  import("./src/generated/common/types").CliCommandDefinitionInput;
export type CliCompletion =
  import("./src/generated/common/types").CliCompletion;
export type CliResult = import("./src/cli/types").CliResult;
export type CliExecutorState = import("./src/cli/types").CliExecutorState;
export type TestRunner = import("./types/advanced-types.js").TestRunner;
export { test, mainTestFn, newTestEvent } from "./src/testing/index.js";
export { bench, mainBenchFn } from "./src/benchmarking/index.js";
//# sourceMappingURL=index.d.ts.map
