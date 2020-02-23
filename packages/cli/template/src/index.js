require("dotenv/config");

const { mainFn } = require("@lbu/cli");
const { log } = require("@lbu/insight");
const { getApp, createBodyParsers } = require("@lbu/server");

mainFn(module, require, log, async logger => {
  logger.info("Hello from my src/index.js");

  const app = getApp({
    proxy: process.env.NODE_ENV === "production",
    enableHealthRoute: true,
    headers: {},
  });

  createBodyParsers({});

  app.listen(3000);
});
