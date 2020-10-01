import { readFileSync } from "fs";
import { App, loadFromOpenAPISpec, TypeCreator } from "@lbu/code-gen";
import { mainFn } from "@lbu/stdlib";
import { storeStructure } from "@lbu/store";

mainFn(import.meta, main);

/** @type {CliWatchOptions} */
export const cliWatchOptions = {
  ignoredPatterns: ["generated"],
  extensions: ["tmpl", "js", "json"],
};

async function main() {
  const app = await App.new({
    verbose: true,
  });

  const T = new TypeCreator();
  const openApiT = new TypeCreator("openapi");
  const R = T.router("/");
  const idR = T.router("/:id").params({
    id: T.uuid(),
  });

  app.add(
    // Base types and validators
    T.object("inferTypes").keys({
      inferred: [
        {
          infer: "string",
          number: 5,
          boolean: true,
        },
      ],
    }),
    T.bool("boolean").convert().default(false),
    T.bool("boolean2").oneOf(true),
    T.number("number").convert().min(0).max(10).optional(),
    T.string("string").trim().lowerCase().min(1).max(10).convert(),
    T.array("array").values(T.reference("app", "boolean")),
    T.object("object").keys({ foo: T.bool() }),
    T.generic("generic").keys(T.string()).values(T.reference("app", "number")),
    T.anyOf("anyOf").values(T.bool(), T.string()),
    T.uuid("uuid"),
    T.date("date").defaultToNow(),
    T.any("any"),

    // Advanced types
    T.optional("optionalBoolean").value(T.bool()),
    T.omit("omitObject")
      .object({
        foo: T.bool(),
        bar: T.string(),
        onlyProp: T.number(),
      })
      .keys("foo", "bar"),
    T.pick("pickObject")
      .object({
        foo: T.bool(),
        bar: T.string(),
        onlyProp: T.number(),
      })
      .keys("onlyProp"),

    // SQL
    T.object("settings")
      .keys({
        id: T.uuid().primary(),
        name: T.string("settingKey").oneOf("foo", "bar").searchable(),
        value: T.bool(),
      })
      .enableQueries({ withSoftDeletes: true }),
    T.object("list")
      .keys({
        id: T.uuid().primary(),
        name: T.string(),
      })
      .enableQueries({ withDates: true }),
    T.object("listItem")
      .keys({
        id: T.uuid().primary(),
        checked: T.bool().default(false).searchable(),
        value: T.string(),
      })
      .enableQueries({ withDates: true }),
    T.object("listSetting")
      .keys({
        id: T.uuid().primary(),
        key: T.string(),
        value: T.generic("settingValue")
          .keys(T.string())
          .values(T.any())
          .default(JSON.stringify({ editable: true })),
      })
      .enableQueries(),
    T.relation().manyToOne(
      T.reference("app", "listItem"),
      "list",
      T.reference("app", "list"),
      "id",
      "list",
    ),
    T.relation().manyToOne(
      T.reference("app", "listSetting"),
      "list",
      T.reference("app", "list"),
      "id",
      "list",
    ),
    T.relation().oneToMany(
      T.reference("app", "list"),
      "id",
      T.reference("app", "listItem"),
      "list",
      "items",
    ),
    T.relation().oneToMany(
      T.reference("app", "list"),
      "id",
      T.reference("app", "listSetting"),
      "list",
      "settings",
    ),

    // Router
    R.get("/", "getLists")
      .query({
        checked: T.bool().convert().optional(),
      })
      .response({
        lists: [T.reference("app", "list")],
      }),
    idR
      .post("/:id/icon", "postIcon")
      .files({
        icon: T.file(),
      })
      .response({
        lists: [T.reference("app", "list")],
      }), // Infer params
    idR.get("/:id/icon", "getIcon").response(T.file()),

    // Reference router items in 'openapi' group so we can check file generation
    // for browser usage
    openApiT.object("referencingIn").keys({
      postIcon: openApiT.reference("app", "postIcon"),
      getIcon: openApiT.reference("app", "getIcon"),
    }),
  );

  // OpenAPI conversion
  app.extend(
    await loadFromOpenAPISpec(
      "openapi",
      JSON.parse(
        readFileSync(
          "./packages/code-gen/src/__fixtures__/openapi.json",
          "utf-8",
        ),
      ),
    ),
  );

  // Lbu structures
  app.extend(storeStructure);

  // Generate calls
  await app.generate({
    outputDirectory: "./generated/app",
    enabledGroups: ["app"],
    isNodeServer: true,
  });

  await app.generate({
    outputDirectory: "./generated/store",
    enabledGroups: ["store"],
    isNode: true,
    enabledGenerators: ["sql", "validator", "type"],
    dumpStructure: true,
  });

  await app.generate({
    outputDirectory: "./generated/openapi/server",
    enabledGroups: ["openapi"],
    isNodeServer: true,
  });

  await app.generate({
    outputDirectory: "./generated/openapi/client",
    enabledGroups: ["openapi"],
    isBrowser: true,
  });
}
