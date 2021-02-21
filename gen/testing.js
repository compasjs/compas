import { readFileSync } from "fs";
import { loadFromOpenAPISpec, TypeCreator } from "@compas/code-gen";
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

  app.extend(
    loadFromOpenAPISpec(
      "githubApi",
      JSON.parse(readFileSync(githubApiFixture, "utf-8")),
    ),
  );
}

export function applyTestingValidatorsStructure(app) {
  const T = new TypeCreator("validator");

  // AnyOf
  app.add(T.anyOf("anyOf").values(T.bool(), T.number(), T.bool()));

  // Array
  app.add(
    T.array("array").values(T.bool()),
    T.array("arrayConvert").values(T.bool()).convert(),
    T.array("arrayMinMax").values(T.bool()).min(1).max(10),
  );

  // Boolean
  app.add(
    T.bool("bool"),
    T.bool("boolOneOf").oneOf(true),
    T.bool("boolConvert").convert(),
    T.bool("boolOptional").optional(),
    T.bool("boolDefault").default("true"),
    T.bool("boolAllowNull").allowNull(),
  );

  // Date
  app.add(
    T.date("date"),
    T.date("dateOptional").optional(),
    T.date("dateAllowNull").allowNull(),
    T.date("dateDefault").defaultToNow(),
  );

  // Generic
  app.add(T.generic("generic").keys(T.number().convert()).values(T.bool()));

  // Number
  app.add(
    T.number("number"),
    T.number("numberOneOf").oneOf(1, 3, 5),
    T.number("numberConvert").convert(),
    T.number("numberFloat").float(),
    T.number("numberMinMax").min(1).max(10),
  );

  // Object
  app.add(
    T.object("object").keys({
      bool: T.bool(),
      string: T.string(),
    }),
    T.object("objectLoose")
      .keys({
        bool: T.bool(),
        string: T.string(),
      })
      .loose(),
  );

  // String
  app.add(
    T.string("string"),
    T.string("stringAllowNull").allowNull(),
    T.string("stringOneOf").oneOf("north", "east"),
    T.string("stringConvert").convert(),
    T.string("stringTrim").trim(),
    T.string("stringUpper").upperCase(),
    T.string("stringLower").lowerCase(),
    T.string("stringMinMax").min(1).max(10),
    T.string("stringPattern").pattern(/[a-z]+/gi),
  );

  // UUID
  app.add(T.uuid("uuid"));

  // Recursive
  app.add(
    T.object("recursive").keys({
      recursive: T.reference("validator", "recursive").optional(),
    }),
  );

  // Nested named objects
  app.add(
    T.object("namedLevelOne").keys({
      levelOne: T.object("namedLevelTwo").keys({
        two: T.object("namedLevelThree").keys({
          foo: T.reference("validator", "namedLevelOne").optional(),
        }),
      }),
    }),
  );
}

export function applyTestingServerStructure(app) {
  const T = new TypeCreator("server");
  const R = T.router("/");

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
    T.object("user")
      .keys({
        nickName: T.string(),
        email: T.string().searchable(),
        authKey: T.string(),
      })
      .enableQueries({ withSoftDeletes: true })
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
        title: T.string(),
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
      })
      .enableQueries()
      .relations(
        T.oneToOne("category", T.reference("sql", "category"), "meta"),
      ),
  );
}
