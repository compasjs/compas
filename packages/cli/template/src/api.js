import { getApp } from "@lbu/server";
import { AppError } from "@lbu/stdlib";
import { router, setBodyParser } from "./generated/router.js";
import { validatorSetError } from "./generated/validators.js";
import { app, bodyParsers } from "./services/index.js";

/**
 * Create a basic LBU app
 */
export function createApp() {
  return getApp({
    errorOptions: {
      leakError: process.env.NODE_ENV !== "production",
    },
    headers: {
      cors: {
        origin: (ctx) => ctx.get("origin") === "http://localhost:3000",
      },
    },
    proxy: process.env.NODE_ENV === "production",
  });
}

export function constructApp() {
  validatorSetError(AppError.validationError);
  setBodyParser(bodyParsers.bodyParser);

  app.use(router);

  mountHandlers();

  return app;
}

function mountHandlers() {}
