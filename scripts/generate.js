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
      name: M.string().min(1).max(15),
      age: M.number().integer().min(0).max(150).convert(),
    }),
  );

  app.add(
    M.object("Items")
      .keys({
        id: M.uuid(),
        name: M.string(),
        count: M.number().integer(),
        createdAt: M.date().defaultToNow(),
        updatedAt: M.date(),
      })
      .enableQueries({}),
  );

  app.add(
    M.relation().manyToOne(
      M.reference("app", "Items"),
      "userId",
      M.reference("app", "user"),
      "id",
      "user",
    ),
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

    G.post("/foobar", "fileTest")
      .files({
        foo: M.file(),
        bar: M.file(),
      })
      .response({
        foo: M.file(),
      }),
  );

  app.extend(storeStructure);

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
    enabledGenerators: ["type", "router", "apiClient", "sql", "validator"],
    useTypescript: false,
    dumpStructure: true,
    dumpPostgres: true,
  });

  await app.generate({
    outputDirectory: "./stubs/app_stubs",
    enabledGroups: ["app", "todo"],
    useStubGenerators: true,
    dumpStructure: true,
    enabledGenerators: ["type", "router", "apiClient"],
  });

  await app.generate({
    outputDirectory: "./stubs/pet_stubs",
    enabledGroups: ["todo", externalApi],
    useTypescript: true,
    validatorCollectErrors: true,
    enabledGenerators: ["validator", "type", "apiClient", "reactQuery"],
  });
}
