import { mainTestFn, test } from "@lbu/cli";
import {
  closeTestApp,
  createBodyParsers,
  createTestAppAndClient,
  getApp,
} from "@lbu/server";
import { AppError } from "@lbu/stdlib";
import Axios from "axios";
import { loadFromRemote } from "../index.js";
import { TypeCreator } from "../src/types/index.js";
import { generateAndLoad } from "./utils.js";

mainTestFn(import.meta);

const name = "code-gen/e2e/server-and-client";

test(name, async (t) => {
  // Server setup
  const serverImports = await generateAndLoad(
    `${name}/server`,
    applyServerStructure,
  );
  t.ok(serverImports);

  const app = buildTestApp(serverImports);
  const client = Axios.create({});
  await createTestAppAndClient(app, client);

  // Client setup
  const clientImports = await generateAndLoad(
    `${name}/client`,
    applyClientStructure(client),
  );
  t.ok(clientImports);
  clientImports.apiClient.createApiClient(client);
  serverImports.apiClient.createApiClient(client);

  t.test("client - GET /:id validation", async (t) => {
    try {
      await clientImports.apiClient.appApi.getId({});
      t.fail("Expected validator error for missing id");
    } catch (e) {
      t.equal(e.response.status, 400);
      t.equal(e.response.data.info.propertyPath, "$.id");
    }
  });

  t.test("client - GET /:id", async (t) => {
    const result = await clientImports.apiClient.appApi.getId({
      id: "5",
    });

    t.deepEqual(result, { id: 5 });
  });

  t.test("client - POST /", async (t) => {
    const result = await clientImports.apiClient.appApi.create(
      {},
      { foo: false },
    );

    t.deepEqual(result, { foo: false });
  });

  t.test("server - GET /:id validation", async (t) => {
    try {
      await serverImports.apiClient.appApi.getId({});
      t.fail("Expected validator error for missing id");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 400);
      t.equal(e.info.propertyPath, "$.id");
    }
  });

  t.test("server - GET /:id", async (t) => {
    const result = await serverImports.apiClient.appApi.getId({
      id: "5",
    });

    t.deepEqual(result, { id: 5 });
  });

  t.test("server - POST /", async (t) => {
    const result = await serverImports.apiClient.appApi.create(
      {},
      { foo: false },
    );

    t.deepEqual(result, { foo: false });
  });

  t.test("server - POST /invalid-response", async (t) => {
    try {
      await serverImports.apiClient.appApi.invalidResponse();
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 400);
      t.equal(e.key, "response.app.invalidResponse.validator.string.type");
    }
  });

  t.test("server - router - tags are available", (t) => {
    t.deepEqual(serverImports.router.appTags.getId, ["tag"]);
    t.deepEqual(serverImports.router.appTags.create, []);
  });

  t.test("apiClient - caught server error", async (t) => {
    try {
      await serverImports.apiClient.appApi.serverError();
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, "server.error");
      t.equal(e.status, 499);
      t.equal(e.originalError.isAxiosError, true);
    }
  });

  t.test("Cleanup server", async () => {
    await closeTestApp(app);
  });
});

function applyServerStructure(app) {
  const T = new TypeCreator();
  const R = T.router("/");

  app.add(
    R.get("/:id", "getId")
      .params({
        id: T.number().convert(),
      })
      .response({
        id: T.number(),
      })
      .tags("tag"),

    R.post("/", "create")
      .query({
        alwaysTrue: T.bool().optional(),
      })
      .body({
        foo: T.bool(),
      })
      .response({
        foo: T.bool(),
      }),

    R.get("/invalid-response", "invalidResponse").response({
      id: T.string(),
    }),

    R.post("/server-error", "serverError").response({}),
  );

  return {
    isNodeServer: true,
    enabledGenerators: ["router", "validator", "apiClient"],
  };
}

function applyClientStructure(apiClient) {
  return async (app) => {
    app.extend(await loadFromRemote(apiClient, apiClient.defaults.baseURL));

    return {
      isBrowser: true,
      enabledGenerators: ["apiClient", "type"],
      useTypescript: false,
    };
  };
}

function buildTestApp(serverImports) {
  const app = getApp();
  app.use(serverImports.router?.router);
  serverImports.router.setBodyParsers(createBodyParsers({}));

  serverImports.router.appHandlers.getId = (ctx, next) => {
    const { id } = ctx.validatedParams;
    ctx.body = { id };
    return next();
  };

  serverImports.router.appHandlers.create = (ctx, next) => {
    const { alwaysTrue } = ctx.validatedQuery;
    const { foo } = ctx.validatedBody;
    if (alwaysTrue) {
      ctx.body = {
        foo: true,
      };
    } else {
      ctx.body = {
        foo,
      };
    }
    return next();
  };

  serverImports.router.appHandlers.invalidResponse = (ctx, next) => {
    ctx.body = {
      id: 5,
    };

    return next();
  };

  serverImports.router.appHandlers.serverError = () => {
    throw new AppError("server.error", 499, {
      test: "X",
    });
  };

  serverImports.validator.validatorSetError(AppError.validationError);
  return app;
}
