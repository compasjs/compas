#!/usr/bin/env node

import { Logger } from "../insight";
import { runCommand } from "./cli";

if (module !== require.main) {
  throw new Error("This can only be executed as `lbf` or `npx lbf`");
} else {
  runCommand(new Logger(3, { type: "CLI" }), process.argv.slice(2));
}
