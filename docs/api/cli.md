---
editLink: false
---

# @compas\/cli

::: v-pre

## mainTestFn

_Available since 0.1.0_

_function mainTestFn(meta): void_

Wraps `mainFn` and starts the test runner if not already started. By calling
this in your test files, it allows the test file to be directly executed via
`node file.test.js`. When the runner is already active, this function will be a
no op.

**Parameters**:

- meta `ImportMeta`

_[source](https://github.com/compasjs/compas/blob/main/packages/cli/src/testing/utils.js#L25)_

## newTestEvent

_Available since 0.1.0_

_function newTestEvent({import("./state").TestRunner} t):
{import("@compas/stdlib").InsightEvent}_

Create a new test event

**Parameters**:

- {import("./state").TestRunner} t `{import("./state").TestRunner} t`:
  {import("./state").TestRunner} t

_[source](https://github.com/compasjs/compas/blob/main/packages/cli/src/testing/events.js#L11)_

## bench

_Available since 0.1.0_

_function bench(name, callback): void_

Benchmark entry point. The benchmark runner will wait a bit till now new
benchmarks are registered and then start execution.

**Parameters**:

- name `string`
- callback `BenchCallback`

_[source](https://github.com/compasjs/compas/blob/main/packages/cli/src/benchmarking/runner.js#L48)_

## mainBenchFn

_Available since 0.1.0_

_function mainBenchFn(meta): void_

Wraps `mainFn` and starts the benchmark runner if not already started. By
calling this in your bench files, it allows the benchmark file to be directly
executed via `node file.bench.js`. When the runner is already active, this
function will be a no op.

**Parameters**:

- meta `ImportMeta`

_[source](https://github.com/compasjs/compas/blob/main/packages/cli/src/benchmarking/utils.js#L22)_

:::
