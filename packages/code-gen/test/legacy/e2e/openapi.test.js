import { readFile, rm } from "fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { isNil, pathJoin, uuid } from "@compas/stdlib";
import { testTemporaryDirectory } from "../../../../../src/testing.js";
import { App } from "../../../src/App.js";
import { TypeCreator } from "../../../src/builders/index.js";
import { codeGenToTemporaryDirectory } from "../utils.test.js";

mainTestFn(import.meta);

test("code-gen/e2e/openapi", async (t) => {
  const T = new TypeCreator("server");
  const R = T.router("/");
  const testR = R.group("group", "/group");

  const {
    exitCode: serverExitCode,
    generatedDirectory: serverGeneratedDirectory,
    cleanupGeneratedDirectory,
  } = await codeGenToTemporaryDirectory(
    [
      T.object("item").keys({
        A: T.string(),
        B: T.number(),
        C: T.number().float(),
        D: T.bool(),
        E: T.date(),
      }),

      T.number("input").convert().docs("WITH DOCS"),

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

  const outputFile = pathJoin(
    process.cwd(),
    testTemporaryDirectory,
    uuid(),
    "openapi.json",
  );

  t.test("generate spec", async (t) => {
    const app = new App();
    await app.generateOpenApi({
      inputPath: serverGeneratedDirectory,
      outputFile,
      enabledGroups: ["server", "group"],
      openApiExtensions: {
        info: {
          version: "0.0.99",
          title: "Compas Test server OpenAPI Docs",
          description: "Lorem ipsum",
        },
        servers: [{ url: "https://api.compasjs.com" }],
        components: {
          securitySchemes: {
            production: {
              type: "oauth2",
              flows: {
                clientCredentials: {
                  tokenUrl: "https://api.compasjs.com/token",
                  scopes: {
                    read: "Allow to read",
                  },
                },
              },
            },
            acceptance: {
              type: "oauth2",
              flows: {
                clientCredentials: {
                  tokenUrl: "https://api.compasjs.com/token",
                  scopes: {
                    read: "Allow to read",
                    write: "Allow to write",
                  },
                },
              },
            },
          },
        },
      },
      openApiRouteExtensions: {
        GroupUpload: {
          // used one of server routes
          security: [
            { acceptance: ["read", "write"] },
            { production: ["read"] },
          ],
        },
      },
    });

    t.pass();
  });

  t.test("error with unknown uniqueName / routes", async (t) => {
    try {
      const app = new App();
      await app.generateOpenApi({
        inputPath: serverGeneratedDirectory,
        outputFile,
        enabledGroups: ["server"],
        openApiExtensions: {},
        openApiRouteExtensions: {
          NonExistingKey: {}, // <-- incorrect
        },
      });
    } catch (e) {
      t.equal(
        e.message,
        `RouteExtension(s) provided for non existing uniqueName: NonExistingKey`,
      );
    }
  });

  t.test("assert spec version", async (t) => {
    const contents = JSON.parse(await readFile(outputFile, "utf-8"));

    t.equal(contents.openapi, "3.0.3");
    t.equal(contents.info.version, "0.0.99");

    t.ok(contents.info.title.length > 0);
    t.ok(contents.info.description.length > 0);
  });

  t.test("assert pass-through props", async (t) => {
    const contents = JSON.parse(await readFile(outputFile, "utf-8"));

    t.equal(contents.servers.length, 1);

    t.ok(!!contents.components.securitySchemes);
    t.equal(Object.keys(contents.components.securitySchemes).length, 2);
  });

  t.test("assert on path conversion", async (t) => {
    const { paths } = JSON.parse(await readFile(outputFile, "utf-8"));

    for (const path of Object.keys(paths)) {
      t.ok(!path.includes(":"), "path contains compas path identifier");
    }
  });

  t.test("assert on RouteExtensions", async (t) => {
    const { paths } = JSON.parse(await readFile(outputFile, "utf-8"));

    // find and destructure route with uniqueName: `GroupUpload`
    const [, { post: groupUpload }] = Object.entries(paths).find(
      ([path]) => path === "/group/file",
    );

    t.ok(groupUpload.security);
    t.equal(Object.keys(groupUpload.security).length, 2);
  });

  t.test("assert that structure can be imported", async (t) => {
    const contents = JSON.parse(await readFile(outputFile, "utf-8"));

    const { exitCode, generatedDirectory, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        {
          extendWithOpenApi: [["server", contents]],
        },
        {
          enabledGenerators: ["apiClient", "router", "validator"],
          isNodeServer: true,
          dumpStructure: true,
        },
      );

    t.equal(exitCode, 0);

    // ensure stripTrailingSlash is correctly set
    const {
      structure: { group },
    } = await import(
      pathJoin(generatedDirectory, "../structure/common/structure.js")
    );

    await cleanupGeneratedDirectory();

    t.equal(group.groupFullRoute.internalSettings.stripTrailingSlash, true);
  });

  t.test("regenerate does not contain old routes", async (t) => {
    const T = new TypeCreator("app");
    const R = T.router("/app");

    const { exitCode, generatedDirectory, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          R.get("/user", "user").response({
            foo: T.bool(),
          }),
        ],
        {
          isNodeServer: true,
          enabledGenerators: [],
          dumpStructure: true,
        },
      );

    t.equal(exitCode, 0);

    const outputFile = pathJoin(generatedDirectory, "./openapi.json");
    await new App().generateOpenApi({
      inputPath: generatedDirectory,
      enabledGroups: ["app"],
      openApiExtensions: {},
      openApiRouteExtensions: {},
      outputFile,
    });

    const source = JSON.parse(await readFile(outputFile, "utf-8"));

    await cleanupGeneratedDirectory();

    t.ok(!isNil(source.paths["/app/user"]));
    t.equal(Object.keys(source.paths).length, 1);
  });

  t.test("nested references across groups are included", async (t) => {
    const T = new TypeCreator("app");
    const R = T.router("/app");

    const Tuser = new TypeCreator("user");

    const { exitCode, generatedDirectory, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.string("houseNumber").min(1),

          Tuser.object("user").keys({
            address: T.reference("user", "address"),
          }),
          Tuser.object("address").keys({
            city: T.string(),
            houseNumber: T.reference("app", "houseNumber"),
          }),

          R.get("/user", "user").response({
            user: T.reference("user", "user"),
          }),
        ],
        {
          isNodeServer: true,
          enabledGenerators: [],
          dumpStructure: true,
        },
      );

    t.equal(exitCode, 0);

    const outputFile = pathJoin(generatedDirectory, "./openapi.json");
    await new App().generateOpenApi({
      inputPath: generatedDirectory,
      enabledGroups: ["app"],
      openApiExtensions: {},
      openApiRouteExtensions: {},
      outputFile,
    });

    const source = JSON.parse(await readFile(outputFile, "utf-8"));

    await cleanupGeneratedDirectory();

    t.ok(!isNil(source.components.schemas.AppHouseNumber));
  });

  t.test("does not contain unused schemas", async (t) => {
    const T = new TypeCreator("app");
    const R = T.router("/app");

    const Tuser = new TypeCreator("user");

    const { exitCode, generatedDirectory, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.string("houseNumber").min(1),

          Tuser.object("user").keys({
            address: T.reference("user", "address"),
          }),
          Tuser.object("address").keys({
            city: T.string(),
          }),

          R.get("/user", "user").response({
            user: T.reference("user", "user"),
          }),
        ],
        {
          isNodeServer: true,
          enabledGenerators: [],
          dumpStructure: true,
        },
      );

    t.equal(exitCode, 0);

    const outputFile = pathJoin(generatedDirectory, "./openapi.json");
    await new App().generateOpenApi({
      inputPath: generatedDirectory,
      enabledGroups: ["app"],
      openApiExtensions: {},
      openApiRouteExtensions: {},
      outputFile,
    });

    const source = JSON.parse(await readFile(outputFile, "utf-8"));

    await cleanupGeneratedDirectory();

    t.ok(isNil(source.components.schemas.AppHouseNumber));
  });

  t.test("does work with recursive types", async (t) => {
    const T = new TypeCreator("app");
    const R = T.router("/app");

    const { exitCode, generatedDirectory, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("recursive").keys({
            property: T.object("recursiveNested").keys({
              nested: T.reference("app", "recursive").optional(),
            }),
          }),

          R.get("/user", "user").response({
            recursive: T.reference("app", "recursive"),
          }),
        ],
        {
          isNodeServer: true,
          enabledGenerators: [],
          dumpStructure: true,
        },
      );

    t.equal(exitCode, 0);

    const outputFile = pathJoin(generatedDirectory, "./openapi.json");
    await new App().generateOpenApi({
      inputPath: generatedDirectory,
      enabledGroups: ["app"],
      openApiExtensions: {},
      openApiRouteExtensions: {},
      outputFile,
    });

    const source = JSON.parse(await readFile(outputFile, "utf-8"));

    await cleanupGeneratedDirectory();

    t.ok(!isNil(source.components.schemas.AppRecursive));
    t.ok(!isNil(source.components.schemas.AppRecursiveNested));
  });

  t.test("does work with referenced query/param types", async (t) => {
    const T = new TypeCreator("app");
    const R = T.router("/app");

    const { exitCode, generatedDirectory, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          R.get("/single", "get").query({
            title: T.string("titleFilter"),
          }),
          R.get("/", "list").query({
            title: T.reference("app", "titleFilter").optional(),
          }),
        ],
        {
          isNodeServer: true,
          enabledGenerators: [],
          dumpStructure: true,
        },
      );

    t.equal(exitCode, 0);

    const outputFile = pathJoin(generatedDirectory, "./openapi.json");
    await new App().generateOpenApi({
      inputPath: generatedDirectory,
      enabledGroups: ["app"],
      openApiExtensions: {},
      openApiRouteExtensions: {},
      outputFile,
    });

    const source = JSON.parse(await readFile(outputFile, "utf-8"));

    await cleanupGeneratedDirectory();

    t.equal(source.paths["/app/single"].get.parameters[0].required, true);
    t.equal(source.paths["/app"].get.parameters[0].required, false);

    t.ok(!isNil(source.components.schemas.AppTitleFilter));
  });

  t.test("teardown", async (t) => {
    await cleanupGeneratedDirectory();
    await rm(outputFile.split("/").slice(0, -1).join("/"), {
      recursive: true,
      force: true,
    });

    t.pass();
  });
});
