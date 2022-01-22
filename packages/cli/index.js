/**
 * @typedef {import("./src/generated/common/types").CliCommandDefinition} CliCommandDefinitionInput
 */

/**
 * @typedef {import("./src/generated/common/types").CliCompletion} CliCompletion
 */

/**
 * @typedef {import("./src/cli/types").CliResult} CliResult
 */

/**
 * @typedef {import("./src/cli/types").CliExecutorState} CliExecutorState
 */

export { test, mainTestFn, newTestEvent } from "./src/testing/index.js";
export { bench, mainBenchFn } from "./src/benchmarking/index.js";
