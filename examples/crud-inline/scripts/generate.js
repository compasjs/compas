import { TypeCreator, Generator } from "@compas/code-gen";
import { mainFn } from "@compas/stdlib";

mainFn(import.meta, main);

function main() {
  const generator = new Generator();
  const T = new TypeCreator();
  const Tdatabase = new TypeCreator("database");

  generator.add(
    Tdatabase.object("post")
      .keys({
        title: T.string().min(3).searchable(),
        contents: T.string(),
      })
      .enableQueries({
        withDates: true,
      })
      .relations(T.oneToMany("tags", T.reference("database", "postTag"))),

    Tdatabase.object("postTag")
      .keys({
        tag: T.string().searchable(),
      })
      .enableQueries({})
      .relations(T.manyToOne("post", T.reference("database", "post"), "tags")),

    new TypeCreator("post")
      .crud("/post")
      .entity(T.reference("database", "post"))
      .routes({
        listRoute: true,
        singleRoute: true,
        createRoute: true,
        updateRoute: true,
        deleteRoute: true,
      })
      .inlineRelations(T.crud().fromParent("tags", { name: "tag" })),
  );

  generator.generate({
    targetLanguage: "js",
    outputDirectory: "./src/generated",
    generators: {
      database: {
        target: {
          dialect: "postgres",
          includeDDL: true,
        },
      },
      apiClient: {
        target: {
          targetRuntime: "node.js",
          library: "fetch",
        },
        responseValidation: {
          looseObjectValidation: false,
        },
      },
      types: {
        declareGlobalTypes: true,
      },
      router: {
        target: {
          library: "koa",
        },
      },
    },
  });
}
