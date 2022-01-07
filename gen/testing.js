import { TypeCreator } from "@compas/code-gen";

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
