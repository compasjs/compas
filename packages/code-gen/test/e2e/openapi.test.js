import { readFile } from "fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { pathJoin, uuid } from "@compas/stdlib";
import { temporaryDirectory } from "../../../../src/testing.js";
import { App } from "../../src/App.js";
import { TypeCreator } from "../../src/builders/index.js";
import { codeGenToTemporaryDirectory } from "../utils.test.js";

mainTestFn(import.meta);

test("code-gen/e2e/openapi", async (t) => {
  const T = new TypeCreator("server");
  const R = T.router("/");
  const testR = R.group("group", "/group");

  const {
    exitCode: serverExitCode,
    generatedDirectory: serverGeneratedDirectory,
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
        .params({ full: T.string(), color: T.number().convert() })
        .body({
          foo: T.anyOf().values(T.string()),
          bar: T.reference("server", "options"),
        })
        .response({
          items: [{ foo: T.string(), bar: T.reference("server", "item") }],
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
        .query({ throwError: T.bool().optional().convert() })
        .response(T.file()),

      R.post("/file", "setFile").files({ myFile: T.file() }).response({
        success: true,
      }),

      R.post("/file/mime", "setMimeCheckedFile")
        .files({ myFile: T.file().mimeTypes("application/json") })
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

  const outputFile = pathJoin(temporaryDirectory, uuid(), "openapi.json");

  t.test("generate spec", async (t) => {
    const app = new App();
    await app.generateOpenApi({
      inputPath: serverGeneratedDirectory,
      outputFile,
      enabledGroups: ["server", "group"],
      openApiOptions: {
        version: "0.0.99",
        title: "Compas Test server OpenAPI Docs",
        description: "Lorem ipsum",
        servers: [{ url: "https://api.compasjs.com" }],
      },
    });

    t.pass();
  });

  t.test("assert spec version", async (t) => {
    const contents = JSON.parse(await readFile(outputFile, "utf-8"));

    t.equal(contents.openapi, "3.0.3");
    t.equal(contents.info.version, "0.0.99");
  });

  t.test("assert on path conversion", async (t) => {
    const { paths } = JSON.parse(await readFile(outputFile, "utf-8"));

    for (const path of Object.keys(paths)) {
      t.ok(!path.includes(":"), "path contains compas path identifier");
    }
  });

  t.test("assert that structure can be imported", async (t) => {
    const contents = JSON.parse(await readFile(outputFile, "utf-8"));

    const { exitCode } = await codeGenToTemporaryDirectory(
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
  });
});
