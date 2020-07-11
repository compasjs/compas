import { App, loadFromOpenAPISpec, TypeCreator } from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";
import { storeStructure } from "@lbu/store";
import { readFileSync } from "fs";

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

  const M = new TypeCreator();

  app.add(
    M.bool("Foo").optional().convert().default(true),
    M.anyOf("Bar").values(M.reference("app", "foo"), M.string()),
  );

  app.add(M.bool("Foo").optional().convert().default(true));
  app.add(M.anyOf("Bar").values(M.bool(), M.bool().optional().default(true)));
  app.add(
    M.object("Obj").keys({
      foo: M.array().values(M.number().optional()),
    }),
  );

  app.add(M.string("Str"));
  app.add(
    M.object("Objec").keys({
      str: M.reference("App", "Str"),
    }),
  );
  app.add(
    M.object("User").keys({
      id: M.uuid(),
      name: M.string().min(1).max(15).mock("__.first"),
      age: M.number().integer().min(0).max(150).convert().mock("__.age"),
    }),
  );

  app.add(
    M.object("Items").keys({
      id: M.uuid(),
      userId: M.reference("App", "User").field("id", "user"),
      name: M.string(),
      count: M.number().integer(),
      createdAt: M.date().defaultToNow(),
      updatedAt: M.date(),
    }),
  );

  const myGeneric = M.generic("MyGeneric")
    .keys(M.string())
    .values(M.anyOf().values(M.bool().convert(), M.number()))
    .docs("Foo");

  app.add(M.array("GenericArray").values(myGeneric));

  const T = new TypeCreator("Todo");

  app.add(T.bool("Boolean"));
  app.add(T.array("MyArr").values(T.reference("App", "Items")));

  const G = T.router("/foo");
  app.add(
    G.get().query(M.reference("App", "User")).params({
      bar: T.bool().optional(),
    }),
  );
  app.add(
    G.post("/:id")
      .body({
        foo: M.string(),
      })
      .query({
        id: M.bool().convert(),
      })
      .response(
        M.object().keys({
          bar: M.string(),
        }),
      ),
  );

  const tmp = M.object("Temporary").keys({ foo: M.number().min(10) });

  app.add(
    M.object("Foo").keys({
      id: M.uuid().primary(),
      bar: M.reference("App", "User").field("id", "user"),
      baz: M.reference("App", "Items").field("id", "items"),
      tmp: tmp,
    }),
  );

  app.add(M.array("ArrayThing").values(M.reference("App", "Foo").field("id")));

  app.extend(storeStructure);

  app.add(
    M.object("fileMeta")
      .keys({
        id: M.uuid().primary(),
        fileId: M.reference("Store", "fileStore").field("id", "file"),
        isProcessed: M.bool().default("false"),
      })
      .enableQueries({ withHistory: true }),
  );

  const externalApi = "apiName";

  app.add(
    new TypeCreator(externalApi).object("Foo").keys({
      bar: T.string(),
      baz: T.string(),
      tag: T.number(),
    }),
  );

  app.extend(
    loadFromOpenAPISpec(
      externalApi,
      JSON.parse(
        readFileSync(
          "./packages/code-gen/src/__fixtures__/openapi.json",
          "utf-8",
        ),
      ),
    ),
  );

  app.add(
    T.object("inferMe").keys({
      look: "Ma",
      i: {
        am: true,
      },
      years: 18,
      old: [T.number()],
    }),
  );

  await app.generate({
    outputDirectory: "./generated",
    enabledGenerators: [
      "type",
      "router",
      "apiClient",
      "sql",
      "validator",
      "mock",
    ],
    useTypescript: false,
    dumpStructure: true,
    dumpPostgres: true,
  });

  await app.generate({
    outputDirectory: "./stubs/app_stubs",
    enabledGroups: ["app", "todo"],
    useStubGenerators: true,
    dumpStructure: true,
    enabledGenerators: ["type", "mock", "router", "apiClient"],
  });

  await app.generate({
    outputDirectory: "./stubs/pet_stubs",
    enabledGroups: ["todo", externalApi],
    useTypescript: true,
    validatorCollectErrors: true,
    enabledGenerators: ["validator", "type", "mock", "apiClient", "reactQuery"],
  });
}
