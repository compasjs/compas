import { log } from "@lbu/insight";
import { AppError, createBodyParsers, getApp } from "@lbu/server";
import { isNil, mainFn } from "@lbu/stdlib";
import { groupMiddleware, router, todoHandlers } from "./generated/router.js";
import { validatorSetErrorFn } from "./generated/validators.js";
import { TodoStore } from "./services/TodoStore.js";

mainFn(import.meta, log, main);

async function main(logger) {
  const app = constructApp();

  const port = process.env.API_PORT || 3000;
  app.listen(port, () => {
    logger.info("Listening", { port });
  });
}

export function constructApp() {
  const app = getApp({
    errorOptions: {
      leakError: true,
    },
    headers: {
      cors: {
        origin: (ctx) =>
          ctx.get("origin") === "http://localhost:3000" ||
          ctx.get("origin") === "https://lbu-e2e.lightbase.nl",
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
  const store = new TodoStore();
  groupMiddleware.todo = (ctx, next) => {
    ctx.user = store.get(ctx.request.ip);

    return next();
  };

  todoHandlers.all = (ctx, next) => {
    ctx.body = {
      store: ctx.user,
    };

    return next();
  };

  todoHandlers.one = (ctx, next) => {
    const todo = ctx.user[ctx.validatedParams.name];
    if (isNil(todo)) {
      throw AppError.validationError("todo.unknown", ctx.validatedParams);
    }

    ctx.body = {
      todo,
    };

    return next();
  };

  todoHandlers.new = (ctx, next) => {
    ctx.user[ctx.validatedBody.name] = {
      name: ctx.validatedBody.name,
      items: [],
    };

    ctx.body = {
      todo: ctx.user[ctx.validatedBody.name],
    };

    return next();
  };

  todoHandlers.createItem = (ctx, next) => {
    const todo = ctx.user[ctx.validatedParams.name];
    if (isNil(todo)) {
      throw AppError.validationError("todo.unknown", ctx.validatedParams);
    }

    todo.items.push({ completed: false, name: ctx.validatedBody.name });

    ctx.body = {
      todo,
    };

    return next();
  };

  todoHandlers.toggleItem = (ctx, next) => {
    const todo = ctx.user[ctx.validatedParams.name];
    if (isNil(todo)) {
      throw AppError.validationError("todo.unknown", ctx.validatedParams);
    }

    if (ctx.validatedBody.index >= todo.items.length) {
      throw AppError.validationError("todo.item.index", ctx.validatedBody);
    }

    todo.items[ctx.validatedBody.index].completed = !todo.items[
      ctx.validatedBody.index
    ].completed;

    ctx.body = {
      todo,
    };

    return next();
  };

  todoHandlers.delete = (ctx, next) => {
    const todo = ctx.user[ctx.validatedParams.name];
    if (isNil(todo)) {
      throw AppError.validationError("todo.unknown", ctx.validatedParams);
    }

    delete ctx.user[ctx.validatedParams.name];

    ctx.body = {
      deleted: true,
    };

    return next();
  };
}
