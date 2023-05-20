import { TypeCreator, Generator } from "@compas/code-gen";
import { mainFn } from "@compas/stdlib";
import { storeGetStructure } from "@compas/store";

mainFn(import.meta, main);

function main() {
  const generator = new Generator();
  const T = new TypeCreator("post");
  const R = T.router("/post");
  const Tdatabase = new TypeCreator("database");

  generator.addStructure(storeGetStructure());

  generator.add(
    Tdatabase.object("post")
      .keys({
        title: T.string().min(3).searchable(),
        contents: T.string(),
      })
      .enableQueries({
        withDates: true,
      })
      .relations(
        T.oneToOne(
          "headerImage",
          T.reference("store", "file"),
          "postHeaderImage",
        ).optional(),
      ),

    R.get("/list", "list").response({
      posts: [
        {
          id: T.uuid(),
          title: T.string(),
          contents: T.string(),
          headerImage: T.reference("store", "fileResponse").optional(),
        },
      ],
    }),

    R.post("/create", "create")
      .body({
        title: T.string(),
        contents: T.string(),
        headerImage: T.file().optional(),
      })
      .response({}),

    R.get("/:id/header-image", "headerImage")
      .params({
        id: T.uuid(),
      })
      .query(T.reference("store", "imageTransformOptions"))
      .response(T.file()),
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
