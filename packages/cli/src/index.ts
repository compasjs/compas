#!/usr/bin/env node

import { Logger } from "@lightbase/insight";
import { runCommand } from "./cli";

if (module !== require.main) {
  throw new Error(
    "This can only be executed as `node @lightbase/cli` or `lb` or `lightbase`",
  );
} else {
  runCommand(process.argv.slice(2), new Logger(3, { type: "CLI" }));
}
