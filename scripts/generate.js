import { readFileSync } from "fs";
import { App, loadFromOpenAPISpec, TypeCreator } from "@lbu/code-gen";
import { mainFn } from "@lbu/stdlib";
import { storeStructure } from "@lbu/store";

mainFn(import.meta, main);

/** @type {CliWatchOptions} */
export const cliWatchOptions = {
  ignoredPatterns: ["generated", "stubs"],
  extensions: ["tmpl", "js", "json"],
};

async function main() {
  const app = await App.new({
    verbose: true,
  });

  const T = new TypeCreator();
  const openApiT = new TypeCreator("openapi");
  const R = T.router("/");

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
    T.number("number").convert().min(0).max(10).optional().integer(),
    T.string("string").trim().lowerCase().min(1).max(10).convert(),
    T.array("array").values(T.reference("app", "boolean")),
    T.object("object").keys({ foo: T.bool() }),
    T.generic("generic").keys(T.string()).values(T.reference("app", "number")),
    T.anyOf("anyOf").values(T.bool(), T.string()),
    T.uuid("uuid"),
    T.date("date").defaultToNow(),
    T.any("any"),

    // SQL
    T.object("account")
      .keys({
        id: T.uuid().primary(),
        name: T.string(),
      })
      .enableQueries({ withHistory: true }),
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
    T.relation().manyToOne(
      T.reference("app", "listItem"),
      "list",
      T.reference("app", "list"),
      "id",
      "list",
    ),
    T.relation()
      .manyToOne(
        T.reference("app", "list"),
        "account",
        T.reference("app", "account"),
        "id",
        "account",
      )
      .optional(),
    T.relation().oneToMany(
      T.reference("app", "list"),
      "id",
      T.reference("app", "listItem"),
      "list",
      "items",
    ),

    // Router
    R.get("/", "getLists")
      .query({
        checked: T.bool().optional(),
      })
      .response({
        lists: [T.reference("app", "list")],
      }),
    R.post("/:id/icon", "postIcon")
      .files({
        icon: T.file(),
      })
      .params({
        id: T.uuid(),
      })
      .response({
        lists: [T.reference("app", "list")],
      }), // Infer params
    R.get("/:id/icon", "getIcon").response(T.file()),

    // Reference router items in 'openapi' group so we can check file generation for browser usage
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
    enabledGenerators: ["sql", "validator", "router", "type", "apiClient"],
    dumpStructure: true,
    dumpPostgres: true,
  });

  await app.generate({
    outputDirectory: "./generated/store",
    enabledGroups: ["store"],
    enabledGenerators: ["sql", "validator", "type"],
    dumpStructure: true,
  });

  await app.generate({
    outputDirectory: "./generated/openapi/server",
    enabledGroups: ["openapi"],
    enabledGenerators: ["sql", "validator", "router", "type", "apiClient"],
    dumpStructure: true,
  });

  await app.generate({
    outputDirectory: "./generated/openapi/client",
    enabledGroups: ["openapi"],
    enabledGenerators: ["validator", "type", "apiClient", "reactQuery"],
    useTypescript: true,
    validatorCollectErrors: true,
  });
}
