#!/usr/bin/env node

import { createReadStream } from "node:fs";
import { configResolve } from "./config/resolve.js";
import { debugEnable } from "./output/debug.js";
import {
  tuiAttachStream,
  tuiEnable,
  tuiPrintInformation,
  tuiStateSetMetadata,
} from "./output/tui.js";

tuiEnable();

tuiStateSetMetadata({
  appName: "Temp",
  compasVersion: "Compas v0.1.0",
});

tuiPrintInformation("Hello world");

let i = 0;

// keep running;
setInterval(() => {
  configResolve("", true);
  tuiPrintInformation(`oops i did it again... ${i++}`);

  if (i === 3) {
    debugEnable();
  }

  if (Math.random() > 0.5) {
    tuiAttachStream(createReadStream("./packages/compas/package.json"));
  }
}, 1500);
