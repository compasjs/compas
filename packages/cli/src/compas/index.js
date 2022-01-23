#!/usr/bin/env node

import {
  eventStart,
  eventStop,
  mainFn,
  newEvent,
  newEventFromEvent,
} from "@compas/stdlib";
import { compasExecCli, compasGetCli } from "./cli.js";

mainFn(import.meta, main);

async function main(mainLogger) {
  const event = newEvent(mainLogger);
  eventStart(event, "compas.cli");

  const { cli, logger } = await compasGetCli(newEventFromEvent(event), {
    commandDirectories: {
      loadScripts: true,
      loadProjectConfig: true,
      loadUserConfig: true,
    },
  });

  const { flags, result } = await compasExecCli(
    newEventFromEvent(event),
    logger,
    cli,
    process.argv.slice(2),
  );

  if (result.error) {
    logger.error(result.error.message);
    process.exit(1);
  }

  if (flags?.printTimings) {
    eventStop(event);
  }

  if (result.value?.exitStatus === "passed") {
    process.exit(0);
  } else if (result.value?.exitStatus === "failed") {
    process.exit(1);
  }
}
