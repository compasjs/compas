/* eslint-disable import/no-unresolved */
import { createReadStream } from "fs";
import { writeFile } from "fs/promises";
import { pathToFileURL } from "url";
import { mainTestFn, test } from "@compas/cli";
import {
  closeTestApp,
  createBodyParsers,
  createTestAppAndClient,
  getApp,
} from "@compas/server";
import {
  AppError,
  isPlainObject,
  pathJoin,
  spawn,
  streamToBuffer,
} from "@compas/stdlib";
import axios from "axios";
import { TypeCreator } from "../../../src/builders/index.js";
import { codeGenToTemporaryDirectory } from "../utils.test.js";

mainTestFn(import.meta);

test("code-gen/e2e/server", async (t) => {
  const Tstore = new TypeCreator("store");
  const T = new TypeCreator("server");
  const R = T.router("/");
  const testR = R.group("group", "/group");

  const {
    exitCode: serverExitCode,
    stdout: serverStdout,
    generatedDirectory: serverGeneratedDirectory,
    cleanupGeneratedDirectory: serverCleanupGeneratedDirectory,
  } = await codeGenToTemporaryDirectory(
    [
      Tstore.object("imageTransformOptions").keys({
        width: T.number().convert(),
        quality: T.number().default(75).convert(),
      }),

      T.object("item").keys({
        A: T.string(),
        B: T.number(),
        C: T.number().float(),
        D: T.bool(),
        E: T.date(),
      }),

      T.number("input").convert().docs("WITH DOCS"),

      R.get("/route-with-referenced-types", "routeWithReferencedTypes")
        .query(T.reference("store", "imageTransformOptions"))
        .response(T.reference("store", "imageTransformOptions")),

      testR
        .post("/file", "upload")
        .files({
          input1: T.file(),
        })
        .response(T.file()),

      testR
        .delete("/:id", "refRoute")
        .query({ ref: T.string(), ref2: T.string() })
        .params({ id: T.reference("server", "input") })
        .response(
          T.object("root").keys({
            value: T.object("nested").keys({
              bool: T.bool(),
            }),
          }),
        ),

      testR
        .put("/:full/:color/route", "fullRoute")
        .params({
          full: T.string(),
          color: T.number().convert(),
        })
        .body({
          foo: T.anyOf().values(T.string()),
          bar: T.reference("server", "options"),
        })
        .response({
          items: [
            {
              foo: T.string(),
              bar: T.reference("server", "item"),
            },
          ],
        }),

      T.string("options").oneOf("A", "B", "C"),
      T.generic("answers")
        .keys(T.reference("server", "options"))
        .values(T.string()),
      R.get("/:id", "getId")
        .params({
          id: T.number().convert(),
        })
        .response({
          id: T.number(),
        })
        .tags("tag"),

      R.post("/search", "search")
        .idempotent()
        .body({
          foo: T.bool(),
        })
        .response({
          bar: T.bool(),
        }),

      R.post("/", "create")
        .query({
          alwaysTrue: T.bool().optional(),
        })
        .body({
          foo: T.bool(),
          string: T.string().allowNull(),
        })
        .response({
          foo: T.bool(),
        }),

      R.get("/invalid-response", "invalidResponse").response({
        id: T.string(),
      }),

      R.post("/server-error", "serverError").response({}),

      R.patch("/patch", "patchTest").response({}),

      R.get("/file", "getFile")
        .query({
          throwError: T.bool().optional().convert(),
        })
        .response(T.file()),

      R.post("/file", "setFile").files({ myFile: T.file() }).response({
        success: true,
      }),

      R.post("/file/mime", "setMimeCheckedFile")
        .files({
          myFile: T.file().mimeTypes("application/json"),
        })
        .response({
          success: true,
        }),

      R.post("/validate", "validatorShim")
        .body({
          anyOf: T.anyOf().values(T.bool(), T.string()),
        })
        .response({
          success: true,
        }),

      R.get("/empty-response", "emptyResponse").query({
        foo: T.string().optional(),
      }),
    ],
    {
      enabledGenerators: ["apiClient", "router", "validator"],
      isNodeServer: true,
      dumpStructure: true,
    },
  );

  t.equal(serverExitCode, 0);
  if (serverExitCode !== 0) {
    t.log.info(serverStdout);
  }

  const { structure: serverStructure } = await import(
    pathToFileURL(
      pathJoin(serverGeneratedDirectory, "../structure/common/structure.js"),
    )
  );
  const {
    exitCode: clientExitCode,
    stdout: clientStdout,
    generatedDirectory: clientGeneratedDirectory,
    cleanupGeneratedDirectory: clientCleanupGeneratedDirectory,
  } = await codeGenToTemporaryDirectory(
    {
      extend: [[serverStructure]],
    },
    {
      enabledGenerators: ["type", "apiClient" /*, "reactQuery"*/],
      isBrowser: true,
    },
  );

  t.equal(clientExitCode, 0);

  if (clientExitCode !== 0) {
    t.log.info(clientStdout);
  }

  t.timeout = 20000;

  const serverApiClientImport = await import(
    pathToFileURL(pathJoin(serverGeneratedDirectory, "server/apiClient.js"))
  );
  const serverControllerImport = await import(
    pathToFileURL(pathJoin(serverGeneratedDirectory, "server/controller.js"))
  );
  let clientApiClientImport;

  const app = await buildTestApp(serverGeneratedDirectory);
  const axiosInstance = axios.create({});
  await createTestAppAndClient(app, axiosInstance);

  t.test("client - transpile and import", async (t) => {
    await writeFile(
      pathJoin(clientGeneratedDirectory, "../tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          allowJs: true,
          noErrorTruncation: true,
          moduleResolution: "node",
          esModuleInterop: true,
          downlevelIteration: true,
          jsx: "preserve",
          module: "ES6",
          lib: ["ESNext", "DOM"],
          target: "ESNext",
        },
        include: ["./**/*.ts"],
      }),
    );

    const { exitCode: transpileExitCode } = await spawn(
      "npx",
      ["tsc", "-p", pathJoin(clientGeneratedDirectory, "../")],
      {},
    );

    t.equal(transpileExitCode, 0);

    clientApiClientImport = await import(
      pathToFileURL(pathJoin(clientGeneratedDirectory, "server/apiClient.js"))
    );
  });

  t.test("client - request cancellation works", async (t) => {
    try {
      const abortController = new AbortController();

      const requestPromise = clientApiClientImport.apiServerGetId(
        axiosInstance,
        { id: "5" },
        { signal: abortController.signal },
      );
      await Promise.all([
        new Promise((r) => {
          setTimeout(r, 0);
        }).then(() => abortController.abort()),
        requestPromise,
      ]);
    } catch (e) {
      t.equal(e.message, "canceled");
    }
  });

  t.test("client - GET /:id validation", async (t) => {
    try {
      // @ts-expect-error
      await clientApiClientImport.apiServerGetId(axiosInstance, {});
      t.fail("Expected validator error for missing id");
    } catch (e) {
      t.equal(e.response.status, 400);
      t.ok(isPlainObject(e.response.data.info["$.id"]));
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

  t.test("server - routeWithReferencedTypes", async (t) => {
    await clientApiClientImport.apiServerRouteWithReferencedTypes(
      axiosInstance,
      {
        width: 75,
      },
    );

    t.pass();
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
      // @ts-expect-error
      await serverApiClientImport.apiServerGetId(axiosInstance, {});
      t.fail("Expected validator error for missing id");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 400);
      t.ok(isPlainObject(e.info["$.id"]));
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
      t.equal(e.key, "response.server.invalidResponse.validator.error");
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
    "server - serverside validator of file with mime types is error",
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
        t.equal(e.key, "validator.error");
        t.equal(e.info["$.myFile"].key, "validator.file.mimeType");
        t.ok(Array.isArray(e.info["$.myFile"].info.mimeTypes));
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
      t.equal(e.cause.isAxiosError, true);
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

  t.test("routerClearMemoizedHandlers", async (t) => {
    const controllerImport = await import(
      pathToFileURL(pathJoin(serverGeneratedDirectory, "server/controller.js"))
    );

    const commonImport = await import(
      pathToFileURL(pathJoin(serverGeneratedDirectory, "common/router.js"))
    );

    controllerImport.serverHandlers.getId = () => {
      throw AppError.serverError({
        error: "foo.bar",
      });
    };

    commonImport.routerClearMemoizedHandlers();

    try {
      await serverApiClientImport.apiServerGetId(axiosInstance, { id: 5 });
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, "error.server.internal");
      t.equal(e.status, 500);
      t.equal(e.info.error, "foo.bar");
    }
  });

  t.test("teardown", async (t) => {
    await closeTestApp(app);
    await serverCleanupGeneratedDirectory();
    await clientCleanupGeneratedDirectory();

    t.pass();
  });
});

async function buildTestApp(importDir) {
  const controllerImport = await import(
    pathToFileURL(pathJoin(importDir, "server/controller.js"))
  );
  const commonImport = await import(
    pathToFileURL(pathJoin(importDir, "common/router.js"))
  );

  const app = getApp({
    logOptions: {
      requestInformation: {
        includePath: true,
        includeEventName: true,
        includeValidatedQuery: true,
        includeValidatedParams: true,
      },
    },
  });
  app.use(commonImport.router);
  commonImport.setBodyParsers(createBodyParsers({}));

  controllerImport.serverHandlers.routeWithReferencedTypes = (ctx, next) => {
    ctx.body = ctx.validatedQuery;

    return next();
  };

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
