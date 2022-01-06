import { readFileSync } from "fs";
import { TypeCreator } from "@compas/code-gen";
import { pathJoin } from "../packages/stdlib/index.js";

const githubApiFixture = pathJoin(
  process.cwd(),
  "__fixtures__/code-gen/githubapi.json",
);

/**
 * @param {App} app
 */
export function applyBenchStructure(app) {
  const T = new TypeCreator("bench");

  app.add(
    T.object("simple").keys({
      foo: T.bool(),
      bar: T.number(),
      baz: T.string().trim().lowerCase(),
    }),
    T.object("nested").keys({
      foo: true,
      bar: 5,
      nest: [T.reference("bench", "simple")],
    }),
  );

  app.extendWithOpenApi(
    "githubApi",
    JSON.parse(readFileSync(githubApiFixture, "utf-8")),
  );
}

export function applyTestingServerStructure(app) {
  const T = new TypeCreator("server");
  const R = T.router("/");

  // Group test
  const testR = R.group("group", "/group");
  app.add(
    T.object("item").keys({
      A: T.string(),
      B: T.number(),
      C: T.number().float(),
      D: T.bool(),
      E: T.date(),
    }),

    T.number("input").convert().docs("WITH DOCS"),

    testR
      .post("/file", "upload")
      .files({
        input1: T.file(),
      })
      .response(T.file()),

    testR
      .delete("/:id", "refRoute")
      .query({ ref: T.string(), ref2: T.string() })
      .params({ id: T.reference("server", "input") })
      .response(T.reference("bench", "nested")),

    testR
      .put("/:full/:color/route", "fullRoute")
      .params({ full: T.string(), color: T.number().convert() })
      .body({
        foo: T.anyOf().values(T.string()),
        bar: T.reference("server", "options"),
      })
      .response({
        items: [{ foo: T.string(), bar: T.reference("server", "item") }],
      }),
  );

  // Reference (validate TS output)
  app.add(
    T.string("options").oneOf("A", "B", "C"),
    T.generic("answers")
      .keys(T.reference("server", "options"))
      .values(T.string()),
  );

  app.add(
    R.get("/:id", "getId")
      .params({
        id: T.number().convert(),
      })
      .response({
        id: T.number(),
      })
      .tags("tag"),

    R.post("/search", "search")
      .idempotent()
      .body({
        foo: T.bool(),
      })
      .response({
        bar: T.bool(),
      }),

    R.post("/", "create")
      .query({
        alwaysTrue: T.bool().optional(),
      })
      .body({
        foo: T.bool(),
        string: T.string().allowNull(),
      })
      .response({
        foo: T.bool(),
      }),

    R.get("/invalid-response", "invalidResponse").response({
      id: T.string(),
    }),

    R.post("/server-error", "serverError").response({}),

    R.patch("/patch", "patchTest").response({}),

    R.get("/file", "getFile")
      .query({ throwError: T.bool().optional().convert() })
      .response(T.file()),

    R.post("/file", "setFile").files({ myFile: T.file() }).response({
      success: true,
    }),

    R.post("/file/mime", "setMimeCheckedFile")
      .files({ myFile: T.file().mimeTypes("application/json") })
      .response({
        success: true,
      }),

    R.post("/validate", "validatorShim")
      .body({
        anyOf: T.anyOf().values(T.bool(), T.string()),
      })
      .response({
        success: true,
      }),

    R.get("/empty-response", "emptyResponse").query({
      foo: T.string().optional(),
    }),
  );
}

/**
 * Test stuff for sql.
 * - User creates posts
 * - Many Post belongs to many categories
 * - Category can have optional 'categoryMeta'
 *
 * @param {App} app
 */
export function applyTestingSqlStructure(app) {
  const T = new TypeCreator("sql");

  app.add(
    T.string("coolString").oneOf("true", "false").optional(),

    T.object("user")
      .keys({
        nickName: T.string(),
        email: T.string().searchable(),
        authKey: T.string(),
        isCool: T.reference("sql", "coolString").searchable(),
      })
      .enableQueries({ withSoftDeletes: true, schema: "public" })
      .relations(T.oneToMany("posts", T.reference("sql", "post"))),

    T.object("category")
      .keys({
        id: T.uuid().primary(),
        label: T.string().searchable(),
      })
      .enableQueries({ withDates: true })
      .relations(T.oneToMany("posts", T.reference("sql", "postCategory"))),

    T.object("post")
      .docs("Store a 'user' post.")
      .keys({
        title: T.string().searchable(),
        body: T.string(),
      })
      .enableQueries({ withSoftDeletes: true })
      .relations(
        T.manyToOne("writer", T.reference("sql", "user"), "posts"),

        T.oneToMany("categories", T.reference("sql", "postCategory")),
        T.oneToMany("postages", T.reference("sql", "postage")),
      ),

    T.object("postage")
      .shortName("pst")
      .docs("o.0")
      .keys({
        value: T.number(),
      })
      .enableQueries({ withSoftDeletes: true })
      .relations(
        T.manyToOne("post", T.reference("sql", "post"), "postages"),
        T.oneToOne(
          "images",
          T.reference("store", "fileGroup"),
          "postageImages",
        ),
      ),

    // m-m join table
    T.object("postCategory")
      .keys({})
      .enableQueries({ withDates: true })
      .relations(
        T.manyToOne("post", T.reference("sql", "post"), "categories"),
        T.manyToOne("category", T.reference("sql", "category"), "posts"),
      ),

    // 1-1 test
    T.object("categoryMeta")
      .keys({
        postCount: T.number(),
        isHighlighted: T.bool().optional().searchable(),
        isNew: T.bool().sqlDefault(),
      })
      .enableQueries()
      .relations(
        T.oneToOne("category", T.reference("sql", "category"), "meta"),
      ),

    // Reference to number primary key
    T.object("jobStatusAggregate")
      .keys({})
      .relations(T.oneToOne("job", T.reference("store", "job"), "status"))
      .enableQueries(),
  );
}
