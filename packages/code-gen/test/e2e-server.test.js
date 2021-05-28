/* eslint-disable import/no-unresolved */
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
  const commonApiClientImport = await import(
    "../../../generated/testing/server/common/apiClient.js"
  );
  const serverApiClientImport = await import(
    "../../../generated/testing/server/server/apiClient.js"
  );
  const serverControllerImport = await import(
    "../../../generated/testing/server/server/controller.js"
  );
  const clientApiClientImport = await import(
    "../../../generated/testing/client/server/apiClient.js"
  );

  const app = await buildTestApp();
  const axiosInstance = Axios.create({});
  await createTestAppAndClient(app, axiosInstance);

  commonApiClientImport.addRequestIdInterceptors(axiosInstance);

  t.test("client - request cancellation works", async (t) => {
    try {
      const cancelToken = Axios.CancelToken.source();

      const requestPromise = clientApiClientImport.apiServerGetId(
        axiosInstance,
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
      await clientApiClientImport.apiServerGetId(axiosInstance, {});
      t.fail("Expected validator error for missing id");
    } catch (e) {
      t.equal(e.response.status, 400);
      t.equal(e.response.data.info.propertyPath, "$.id");
    }
  });

  t.test("client - GET /:id", async (t) => {
    const result = await clientApiClientImport.apiServerGetId(axiosInstance, {
      id: "5",
    });

    t.deepEqual(result, { id: 5 });
  });

  t.test("client - POST /", async (t) => {
    const result = await clientApiClientImport.apiServerCreate(
      axiosInstance,
      {},
      { foo: false },
    );

    t.deepEqual(result, { foo: false });
  });

  t.test("server - GET /:id param decoding", async (t) => {
    try {
      await axiosInstance.get("/%f");
      t.fail("Should throw invalid encoding");
    } catch (e) {
      t.ok(e.isAxiosError);
      t.equal(e.response.status, 400);
      t.equal(e.response.data.key, "router.param.invalidEncoding");
    }
  });

  t.test("server - GET /:id validation", async (t) => {
    try {
      await serverApiClientImport.apiServerGetId(axiosInstance, {});
      t.fail("Expected validator error for missing id");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 400);
      t.equal(e.info.propertyPath, "$.id");
    }
  });

  t.test("server - GET /:id", async (t) => {
    const result = await serverApiClientImport.apiServerGetId(axiosInstance, {
      id: "5",
    });

    t.deepEqual(result, { id: 5 });
  });

  t.test("server - POST /", async (t) => {
    const result = await serverApiClientImport.apiServerCreate(
      axiosInstance,
      {},
      { foo: false },
    );

    t.deepEqual(result, { foo: false });
  });

  t.test("server - POST /invalid-response", async (t) => {
    try {
      await serverApiClientImport.apiServerInvalidResponse(axiosInstance);
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 400);
      t.equal(e.key, "response.server.invalidResponse.validator.string.type");
    }
  });

  t.test("server - PATCH throws not implemented", async (t) => {
    try {
      await serverApiClientImport.apiServerPatchTest(axiosInstance);
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 405);
    }
  });

  t.test("server - files are passed through as well", async (t) => {
    const response = await serverApiClientImport.apiServerGetFile(
      axiosInstance,
      {
        throwError: false,
      },
    );
    const buffer = await streamToBuffer(response);

    t.equal(buffer.toString("utf-8"), "Hello!");
  });

  t.test(
    "server - errors are handled even if response is a stream",
    async (t) => {
      try {
        await serverApiClientImport.apiServerGetFile(axiosInstance, {
          throwError: true,
        });
        t.fail("Should throw");
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.equal(e.status, 400);
        t.equal(e.key, "whoops");
      }
    },
  );

  t.test("server - serverside validator of file is ok", async (t) => {
    const { success } = await serverApiClientImport.apiServerSetFile(
      axiosInstance,
      {
        myFile: {
          name: "foo.json",
          data: createReadStream("./__fixtures__/code-gen/openapi.json"),
        },
      },
    );

    t.ok(success);
  });

  t.test(
    "server - serverside validator of file with mime types is ok",
    async (t) => {
      const { success } =
        await serverApiClientImport.apiServerSetMimeCheckedFile(axiosInstance, {
          myFile: {
            name: "foo.json",
            data: createReadStream("./__fixtures__/code-gen/openapi.json"),
          },
        });

      t.ok(success);
    },
  );

  t.test(
    "server - serverside validator of file wit mime types is ok",
    async (t) => {
      try {
        await serverApiClientImport.apiServerSetMimeCheckedFile(axiosInstance, {
          myFile: {
            name: "foo.sql",
            data: createReadStream("./migrations/001-compas-store.sql"),
          },
        });
        t.fail("Should throw");
      } catch (e) {
        t.equal(e.status, 400);
        t.equal(e.key, "validator.file.mimeType");
        t.ok(Array.isArray(e.info.mimeTypes));
      }
    },
  );

  t.test("server - router - tags are available", (t) => {
    t.deepEqual(serverControllerImport.serverTags.getId, ["tag"]);
    t.deepEqual(serverControllerImport.serverTags.create, []);
  });

  t.test("apiClient - caught server error", async (t) => {
    try {
      await serverApiClientImport.apiServerServerError(axiosInstance);
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, "server.error");
      t.equal(e.status, 499);
      t.equal(e.originalError.isAxiosError, true);
    }
  });

  t.test("server - invalid json payload", async (t) => {
    try {
      await axiosInstance.request({
        url: "/validate",
        method: "POST",
        data: `{ 
        "foo": "bar",
        "bar": {
           "baz": true,
           }
         }`,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      t.ok(e.isAxiosError);

      t.equal(e.response.status, 400);
      t.equal(e.response.data.key, "error.server.unsupportedBodyFormat");
    }
  });

  t.test("teardown", async (t) => {
    await closeTestApp(app);
    t.pass();
  });
});

async function buildTestApp() {
  const controllerImport = await import(
    "../../../generated/testing/server/server/controller.js"
  );
  const commonImport = await import(
    "../../../generated/testing/server/common/router.js"
  );

  const app = getApp();
  app.use(commonImport.router);
  commonImport.setBodyParsers(createBodyParsers({}));

  controllerImport.serverHandlers.getId = (ctx, next) => {
    const { id } = ctx.validatedParams;
    ctx.body = { id };
    return next();
  };

  controllerImport.serverHandlers.create = (ctx, next) => {
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

  controllerImport.serverHandlers.invalidResponse = (ctx, next) => {
    ctx.body = {
      id: 5,
    };

    return next();
  };

  controllerImport.serverHandlers.serverError = () => {
    throw new AppError("server.error", 499, {
      test: "X",
    });
  };

  controllerImport.serverHandlers.getFile = (ctx, next) => {
    if (ctx.validatedQuery.throwError) {
      throw AppError.validationError("whoops");
    }

    ctx.body = Buffer.from("Hello!", "utf-8");

    return next();
  };

  controllerImport.serverHandlers.setFile = (ctx, next) => {
    ctx.body = {
      success: true,
    };

    return next();
  };

  controllerImport.serverHandlers.setMimeCheckedFile = (ctx, next) => {
    ctx.body = {
      success: true,
    };

    return next();
  };

  return app;
}
