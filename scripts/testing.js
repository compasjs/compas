import { newLogger } from "@lbu/insight";
import { createBodyParsers, getApp, session } from "@lbu/server";
import { isProduction, isStaging, mainFn } from "@lbu/stdlib";
import { newSessionStore, newPostgresConnection } from "@lbu/store";
import { app } from "../packages/cli/template/src/services/core.js";
// import { router } from "../generated/router.js";
// import { validatorSetErrorFn } from "../generated/validators.js";

mainFn(import.meta, newLogger(), main);

/**
 * @param logger
 */
async function main(logger) {
  const sql = await newPostgresConnection({
    createIfNotExists: true,
  });
  const app = getApp();

  createBodyParsers();
  app.use(
    session(app, {
      store: newSessionStore(sql),
    }),
  );

  app.use((ctx, next) => {
    if (ctx.session.isNew) {
      ctx.session = {
        foo: "bar",
      };
    }

    ctx.body = ctx.session.toJSON();
    return next();
  });
  // validatorSetErrorFn(AppError.validationError);
  //
  // app.use(router);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info({
      msg: "Listening",
      port,
      isProduction: isProduction(),
      isStaging: isStaging(),
    });
  });

  mount();
}

/**
 *
 */
function mount() {}
