import { TypeCreator } from "@compas/code-gen";
import { Generator } from "@compas/code-gen/experimental";
import { mainFn } from "@compas/stdlib";

mainFn(import.meta, main);

function main() {
  const generator = new Generator();
  const T = new TypeCreator();
  const Tdatabase = new TypeCreator("database");

  generator.add(
    Tdatabase.object("todo")
      .keys({
        title: T.string().min(3).searchable(),
        completedAt: T.date().optional().searchable(),
      })
      .enableQueries({
        withDates: true,
      }),

    Tdatabase.object("todoView")
      .keys({
        title: T.string(),
        isCompleted: T.bool().searchable(),
        completedAt: T.date().optional(),
      })
      .enableQueries({
        isView: true,
      }),

    new TypeCreator("todo")
      .crud("/todo")
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

    new TypeCreator("completedTodo")
      .crud("/completed-todo")
      .entity(T.reference("database", "todoView"))
      .routes({
        listRoute: true,
        singleRoute: true,
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
