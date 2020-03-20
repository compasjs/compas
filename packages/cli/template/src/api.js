import { log } from "@lbu/insight";
import { createBodyParsers, getApp } from "@lbu/server";
import { mainFn } from "@lbu/stdlib";

const main = async logger => {
  logger.info("Hello from my src/api.js");

  const app = getApp({
    errorOptions: {
      leakError: process.env.NODE_ENV === "development",
    },
    headers: {
      cors: {
        origin: "http://localhost:3000",
      },
    },
  });

  createBodyParsers({});

  app.listen(process.env.API_PORT, () => {
    logger.info(`Listening on port ${process.env.API_PORT}`);
  });
};

mainFn(import.meta, log, main);
