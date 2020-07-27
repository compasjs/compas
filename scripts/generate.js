import { readFileSync } from "fs";
import { App, loadFromOpenAPISpec, TypeCreator } from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";
import { storeStructure } from "@lbu/store";

mainFn(import.meta, log, main);

export const nodemonArgs =
  "--ignore generated --ignore stubs --ignore **/generated/*.js -e tmpl,js,json";

/**
 *
 */
async function main() {
  const app = await App.new({
    verbose: true,
  });

  const T = new TypeCreator();

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
