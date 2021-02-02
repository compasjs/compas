import { createReadStream } from "fs";
import { mainTestFn, test } from "@compas/cli";
import {
  closeTestApp,
  createBodyParsers,
  createTestAppAndClient,
  getApp,
} from "@compas/server";
import { AppError, streamToBuffer } from "@compas/stdlib";
import Axios from "axios";

mainTestFn(import.meta);

test("code-gen/e2e-server", async (t) => {
  const server = await import("../../../generated/testing/server/index.js");
  const client = await import("../../../generated/testing/client/index.js");

  const app = await buildTestApp();
  const serverClient = Axios.create({});
  await createTestAppAndClient(app, serverClient);

  const apiClient = client.newApiClient(serverClient);
  server.createApiClient(serverClient);

  t.test("client - request cancellation works", async (t) => {
    try {
      const cancelToken = Axios.CancelToken.source();

      const requestPromise = apiClient.server.getId(
        { id: "5" },
        { cancelToken: cancelToken.token },
      );
      await Promise.all([
        new Promise((r) => {
          setTimeout(r, 0);
        }).then(() => cancelToken.cancel("foo")),
        requestPromise,
      ]);
      t.fail("Should throw cancel error");
    } catch (e) {
      t.equal(e.__CANCEL__, true, "Cancel token throws");
      t.equal(e.message, "foo");
    }
  });

  t.test("client - GET /:id validation", async (t) => {
    try {
      await apiClient.server.getId({});
      t.fail("Expected validator error for missing id");
    } catch (e) {
      t.equal(e.response.status, 400);
      t.equal(e.response.data.info.propertyPath, "$.id");
    }
  });

  t.test("client - GET /:id", async (t) => {
    const result = await apiClient.server.getId({
      id: "5",
    });

    t.deepEqual(result, { id: 5 });
  });

  t.test("client - POST /", async (t) => {
    const result = await apiClient.server.create({}, { foo: false });

    t.deepEqual(result, { foo: false });
  });

  t.test("server - GET /:id validation", async (t) => {
    try {
      await server.serverApi.getId({});
      t.fail("Expected validator error for missing id");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 400);
      t.equal(e.info.propertyPath, "$.id");
    }
  });

  t.test("server - GET /:id", async (t) => {
    const result = await server.serverApi.getId({
      id: "5",
    });

    t.deepEqual(result, { id: 5 });
  });

  t.test("server - POST /", async (t) => {
    const result = await server.serverApi.create({}, { foo: false });

    t.deepEqual(result, { foo: false });
  });

  t.test("server - POST /invalid-response", async (t) => {
    try {
      await server.serverApi.invalidResponse();
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 400);
      t.equal(e.key, "response.server.invalidResponse.validator.string.type");
    }
  });

  t.test("server - PATCH throws not implemented", async (t) => {
    try {
      await server.serverApi.patchTest();
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 405);
    }
  });

  t.test("server - files are passed through as well", async (t) => {
    const response = await server.serverApi.getFile({ throwError: false });
    const buffer = await streamToBuffer(response);

    t.equal(buffer.toString("utf-8"), "Hello!");
  });

  t.test(
    "server - errors are handled even if response is a stream",
    async (t) => {
      try {
        await server.serverApi.getFile({ throwError: true });
        t.fail("Should throw");
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.equal(e.status, 400);
        t.equal(e.key, "whoops");
      }
    },
  );

  t.test("server - serverside validator of file is ok", async (t) => {
    const { success } = await server.serverApi.setFile({
      myFile: {
        name: "foo.json",
        data: createReadStream("./__fixtures__/code-gen/openapi.json"),
      },
    });

    t.ok(success);
  });

  t.test("server - router - tags are available", (t) => {
    t.deepEqual(server.serverTags.getId, ["tag"]);
    t.deepEqual(server.serverTags.create, []);
  });

  t.test("apiClient - caught server error", async (t) => {
    try {
      await server.serverApi.serverError();
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

async function buildTestApp() {
  const server = await import("../../../generated/testing/server/index.js");

  const app = getApp();
  app.use(server.router);
  server.setBodyParsers(createBodyParsers({}));

  server.serverHandlers.getId = (ctx, next) => {
    const { id } = ctx.validatedParams;
    ctx.body = { id };
    return next();
  };

  server.serverHandlers.create = (ctx, next) => {
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

  server.serverHandlers.invalidResponse = (ctx, next) => {
    ctx.body = {
      id: 5,
    };

    return next();
  };

  server.serverHandlers.serverError = () => {
    throw new AppError("server.error", 499, {
      test: "X",
    });
  };

  server.serverHandlers.getFile = (ctx, next) => {
    if (ctx.validatedQuery.throwError) {
      throw AppError.validationError("whoops");
    }

    ctx.body = Buffer.from("Hello!", "utf-8");

    return next();
  };

  server.serverHandlers.setFile = (ctx, next) => {
    ctx.body = {
      success: true,
    };

    return next();
  };

  return app;
}
