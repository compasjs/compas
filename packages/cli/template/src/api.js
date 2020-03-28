import { log } from "@lbu/insight";
import { AppError, createBodyParsers, getApp } from "@lbu/server";
import { mainFn } from "@lbu/stdlib";
import { validatorSetErrorFn } from "./generated/validators.js";

mainFn(import.meta, log, main);

async function main(logger) {
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
  validatorSetErrorFn(AppError.validationError);

  app.listen(process.env.API_PORT, () => {
    logger.info(`Listening on port ${process.env.API_PORT}`);
  });
}
