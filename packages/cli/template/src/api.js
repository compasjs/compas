import { createBodyParsers, getApp } from "@lbu/server";
import { AppError, uuid } from "@lbu/stdlib";
import { appHandlers, router } from "./generated/router.js";
import { validatorSetErrorFn } from "./generated/validators.js";

export function constructApp() {
  const app = getApp({
    errorOptions: {
      leakError: true,
    },
    headers: {
      cors: {
        origin: (ctx) => ctx.get("origin") === "http://localhost:3000",
      },
    },
    proxy: process.env.NODE_ENV === "production",
  });

  validatorSetErrorFn(AppError.validationError);
  createBodyParsers({});

  app.use(router);

  mountHandlers();

  return app;
}

function mountHandlers() {
  appHandlers.get = (ctx, next) => {
    ctx.body = {
      id: uuid(),
      userName: "Dirk",
    };
    return next();
  };
}
