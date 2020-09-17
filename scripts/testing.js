import { createBodyParsers, getApp, session } from "@lbu/server";
import { isProduction, isStaging, mainFn } from "@lbu/stdlib";
import { newPostgresConnection, newSessionStore } from "@lbu/store";

mainFn(import.meta, main);

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

  // validatorSetError(AppError.validationError);
  // setBodyParsers(createBodyParsers({}));
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

function mount() {}
