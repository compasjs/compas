import { getApp } from "@lbu/server";
import { AppError } from "@lbu/stdlib";
import { router, setBodyParsers } from "./generated/router.js";
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
    headers: {},
    proxy: process.env.NODE_ENV === "production",
  });
}

export async function constructApp() {
  validatorSetError(AppError.validationError);
  setBodyParsers(bodyParsers);

  // Import controllers
  // await Promise.all([import("./xx/controller.js")]);

  app.use(router);
}
