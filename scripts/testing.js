import { log } from "@lbu/insight";
import { AppError, createBodyParsers, getApp } from "@lbu/server";
import { getSecondsSinceEpoch, isNil, mainFn } from "@lbu/stdlib";
import {
  createApiClient,
  todoGet,
  todoGetList,
  todoPostItems,
  todoPostNew,
  todoPostTick,
} from "../generated/apiClient.js";
import { routeHandlers, router } from "../generated/router.js";

const main = async logger => {
  const app = getApp({
    enableHealthRoute: true,
    errorOptions: {
      leakError: true,
    },
    disableHeaders: true,
  });

  createBodyParsers();

  app.use(router);

  app.listen(3000, () => {
    logger.info("Listening...");
  });

  mount();

  setTimeout(() => runClient(logger), 500);
};

mainFn(import.meta, log, main);

function mount() {
  let nextId = 0;
  /** @type {Object.<number, TodoResponse.data>} */
  let store = {};

  routeHandlers.todoGetList = (ctx, next) => {
    ctx.body = {
      data: Object.values(store),
      pagination: {
        count: Object.keys(store).length,
      },
    };

    return next();
  };

  routeHandlers.todoPostNew = (ctx, next) => {
    let id = nextId++;
    store[id] = {
      id,
      name: ctx.validatedBody.name,
      items: [],
    };

    ctx.body = {
      data: store[id],
    };

    return next();
  };

  routeHandlers.todoGet = (ctx, next) => {
    const { id } = ctx.validatedParams;
    if (isNil(store[id])) {
      throw AppError.validationError("error.todo.unknown", {
        id,
      });
    }

    ctx.body = {
      data: store[id],
    };

    return next();
  };

  routeHandlers.todoPostItems = (ctx, next) => {
    const { items } = ctx.validatedBody;
    const { id } = ctx.validatedParams;

    if (isNil(store[id])) {
      throw AppError.validationError("error.todo.unknown", {
        id,
      });
    }
    const data = store[id];

    for (const item of items) {
      data.items.push({
        createdAt: getSecondsSinceEpoch(),
        completedAt: undefined,
        item,
      });
    }

    ctx.body = {
      data,
    };

    return next();
  };

  routeHandlers.todoPostTick = (ctx, next) => {
    const { index } = ctx.validatedBody;
    const { id } = ctx.validatedParams;

    if (isNil(store[id])) {
      throw AppError.validationError("error.todo.unknown", {
        id,
      });
    }
    const data = store[id];
    if (data.items.length <= index) {
      throw AppError.validationError("error.todo.item.unknown", {
        id,
      });
    }

    data.items[index].completedAt = isNil(data.items[index].completedAt)
      ? getSecondsSinceEpoch()
      : undefined;

    ctx.body = {
      data,
    };

    return next();
  };
}

async function runClient(logger) {
  try {
    createApiClient({
      baseURL: "http://localhost:3000/",
      headers: {},
      timeout: 2400,
    });
    logger.info(await todoGetList({}));
    logger.info(await todoPostNew({ name: "Foo" }));
    logger.info(await todoGet({ id: 0 }));
    logger.info(await todoPostItems({ id: 0 }, { items: ["Foo ", " Bar"] }));
    logger.info(await todoGetList({}));
    logger.info(await todoPostTick({ id: 0 }, { index: 1 }));
    logger.info(await todoPostTick({ id: 0 }, { index: 0 }));
    logger.info(await todoPostTick({ id: 0 }, { index: 0 }));
  } catch (e) {
    logger.error(e.toJSON());
  }
}
