import { TypeCreator } from "@compas/code-gen";
import { Generator } from "@compas/code-gen/experimental";
import { mainFn } from "@compas/stdlib";

mainFn(import.meta, main);

function main() {
  const generator = new Generator();
  const T = new TypeCreator("todo");

  generator.add(
    new TypeCreator("database")
      .object("todo")
      .keys({
        title: T.string().min(3).searchable(),
        completedAt: T.date().optional().searchable(),
      })
      .enableQueries({
        withDates: true,
      }),

    T.crud("/todo")
      .entity(T.reference("database", "todo"))
      .routes({
        listRoute: true,
        singleRoute: true,
        createRoute: true,
        updateRoute: true,
        deleteRoute: true,
      })
      .fields({
        readable: T.object("readable").keys({
          id: T.uuid(),
          title: T.string(),
          isCompleted: T.bool(),
          createdAt: T.date(),
        }),
        writable: {},
      }),
  );

  generator.generate({
    targetLanguage: "js",
    outputDirectory: "./src/generated",
    generators: {
      database: {
        target: {
          dialect: "postgres",
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
