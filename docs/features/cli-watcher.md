# CLI Watcher

@compas/cli comes with various utilities, one of them is a file watcher based on
[chokidar](https://www.npmjs.com/package/chokidar).

#### `watcherKillProcess`

Kill a child process and it's child processes. This uses
[tree-kill](https://www.npmjs.com/package/tree-kill), since
`childProcess.kill()` does not account for any spawned child processes of that
process.

**Example**:

```js
import { spawn } from "child_process";
import { watcherKillProcess } from "@compas/cli";

const instance = spawn("ls");
await watcherKillProcess(instance, "SIGTERM");
```

#### `watcherRun`

Wraps around Chokidar, handling restarts in a debounced way. Also supports
reading `rs<enter>` from stdin, as a way of restarting.

**Example**:

```js
import { watcherRun } from "@compas/cli";

const chokidarOptions = {};

watcherRun({
  chokidarOptions,
  hooks: {
    onRestart() {
      console.log("Should restart");
    },
  },
});
```

#### `watcherRunWithSpawn`

A common use case, is restarting a spawned process. This utility helps with
exactly that use case.

**Example**:

```js
import { mainFn } from "@compas/stdlib";
import { watcherRunWithSpawn } from "@compas/cli";

mainFn(import.meta, main);

function main(logger) {
  const chokidarOptions = {};

  watcherRunWithSpawn(
    logger,
    {
      chokidarOptions,
      hooks: {}, // function overrides the `onRestart` hook, so should not be provided.
    },
    {
      cpArguments: [
        "ls",
        ["-als"],
        {
          stdio: "inherit",
        },
      ],
    },
  );
}
```
