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
      }),

    new TypeCreator("post")
      .crud("/post")
      .entity(T.reference("database", "post"))
      .routes({
        listRoute: true,
        singleRoute: true,
        createRoute: true,
        updateRoute: true,
        deleteRoute: true,
      }),
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
