import {
  closeTestApp,
  createBodyParsers,
  createTestAppAndClient,
  getApp,
} from "@lbu/server";
import { AppError } from "@lbu/stdlib";
import Axios from "axios";
import dotenv from "dotenv";
import test from "tape";
import { loadFromRemote } from "../index.js";
import { TypeCreator } from "../src/types/index.js";
import { generateAndLoad } from "./utils.js";

const name = "code-gen/e2e/server-and-client";

dotenv.config();

test(name, async (t) => {
  // Server setup
  const serverImports = await generateAndLoad(
    name + "/server",
    applyServerStructure,
  );
  t.ok(serverImports);

  const app = buildTestApp(serverImports);
  const client = Axios.create({});
  await createTestAppAndClient(app, client);

  // Client setup
  const clientImports = await generateAndLoad(
    name + "/client",
    applyClientStructure(client),
  );
  t.ok(clientImports);
  clientImports.apiClient.createApiClient(client);

  t.test("GET /:id validation", async (t) => {
    try {
      await clientImports.apiClient.appApi.getId({});
      t.fail("Expected validator error for missing id");
    } catch (e) {
      t.equal(e.response.status, 400);
      t.equal(e.response.data.info.propertyPath, "$.id");
    }
  });

  t.test("GET /:id", async (t) => {
    const result = await clientImports.apiClient.appApi.getId({
      id: "5",
    });

    t.deepEqual(result, { id: 5 });
  });

  t.test("POST /", async (t) => {
    const result = await clientImports.apiClient.appApi.create(
      {},
      { foo: false },
    );

    t.deepEqual(result, { foo: false });
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
        id: T.number().integer().convert(),
      })
      .response({
        id: T.number().integer(),
      }),

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
  );

  return {
    enabledGenerators: ["router", "validator"],
  };
}

function applyClientStructure(apiClient) {
  return async (app) => {
    app.extend(await loadFromRemote(apiClient, apiClient.defaults.baseURL));

    return {
      enabledGenerators: ["apiClient", "mock", "type"],
    };
  };
}

function buildTestApp(serverImports) {
  const app = getApp();
  app.use(serverImports.router?.router);
  serverImports.router.setBodyParser(createBodyParsers({}).bodyParser);

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

  serverImports.validator.validatorSetError(AppError.validationError);
  return app;
}
