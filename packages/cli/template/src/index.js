import "dotenv/config";

import { mainFn } from "@lbu/stdlib";
import { log } from "@lbu/insight";
import { getApp, createBodyParsers } from "@lbu/server";

mainFn(import.meta, log, async logger => {
  logger.info("Hello from my src/index.js");

  const app = getApp({
    proxy: process.env.NODE_ENV === "production",
    enableHealthRoute: true,
    headers: {},
  });

  createBodyParsers({});

  app.listen(3000);
});
