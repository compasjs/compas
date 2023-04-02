/* eslint-disable import/no-unresolved */
import { pathToFileURL } from "url";
import { mainTestFn, test } from "@compas/cli";
import { AppError, isNil, pathJoin, uuid } from "@compas/stdlib";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
  query,
  storeGetStructure,
} from "@compas/store";
import { sql as rootSql } from "../../../../../src/testing.js";
import { TypeCreator } from "../../../src/builders/index.js";
import { codeGenToTemporaryDirectory } from "../utils.test.js";

mainTestFn(import.meta);

test("code-gen/e2e/sql", async (t) => {
  const T = new TypeCreator("sql");
  const { exitCode, generatedDirectory, cleanupGeneratedDirectory } =
    await codeGenToTemporaryDirectory(
      {
        add: [
          T.string("coolString").oneOf("true", "false").optional(),

          T.object("user")
            .keys({
              nickName: T.string(),
              email: T.string().searchable(),
              authKey: T.string(),
              isCool: T.reference("sql", "coolString").searchable(),
            })
            .enableQueries({
              withSoftDeletes: true,
              schema: "public",
            })
            .relations(T.oneToMany("posts", T.reference("sql", "post"))),

          T.object("category")
            .keys({
              id: T.uuid().primary(),
              label: T.string().searchable(),
            })
            .enableQueries({ withDates: true })
            .relations(
              T.oneToMany("posts", T.reference("sql", "postCategory")),
            ),

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
            ),

          T.extendNamedObject(T.reference(T.group, "post")).relations(
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
            ),

          // m-m
          // join
          // table
          T.object("postCategory")
            .keys({})
            .enableQueries({ withDates: true })
            .relations(
              T.manyToOne("post", T.reference("sql", "post"), "categories"),
              T.manyToOne("category", T.reference("sql", "category"), "posts"),
            ),

          // 1-1
          // test
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

          // Reference
          // to
          // number
          // primary
          // key
          T.object("jobStatusAggregate")
            .keys({})
            .relations(T.oneToOne("job", T.reference("store", "job"), "status"))
            .enableQueries(),

          T.object("settings")
            .keys({
              toggles: T.object()
                .keys({
                  darkMode: T.bool(),
                })
                .optional()
                .searchable(),
            })
            .enableQueries(),
        ],
        extend: [[storeGetStructure()]],
      },
      {
        enabledGenerators: ["sql", "validator"],
        isNodeServer: true,
        dumpApiStructure: false,
        dumpStructure: true,
      },
    );

  t.equal(exitCode, 0);

  const { queries } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "database/index.js"))
  );
  const { queryCategory } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "database/category.js"))
  );
  const { queryPost } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "database/post.js"))
  );
  const { queryPostage } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "database/postage.js"))
  );
  const { queryUser } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "database/user.js"))
  );

  let sql = undefined;

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`
      SELECT 1 + 2 AS sum
    `;
    t.equal(result[0].sum, 3);
  });

  t.test("init 'settings' table", async (t) => {
    await sql`
      CREATE TABLE "settings"
      (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        toggles jsonb NULL
      );
    `;

    t.pass();
  });

  let user, category, post;

  t.test("insert user", async (t) => {
    const [dbUser] = await queries.userInsert(sql, {
      nickName: "test",
      authKey: uuid(),
      email: "test@test.com",
    });

    t.ok(dbUser);
    t.ok(isNil(dbUser.deletedAt));
    t.equal(dbUser.nickName, "test");

    // Transformer
    t.equal(typeof dbUser.createdAt, "object");
    t.equal(typeof dbUser.updatedAt, "object");
    t.ok(dbUser.createdAt.toISOString());
    t.equal(dbUser.deletedAt, undefined);

    user = dbUser;
  });

  t.test("insert category", async (t) => {
    const [dbCategory] = await queries.categoryInsert(sql, [
      {
        label: "Category A",
      },
      {
        label: "Category B",
      },
    ]);

    t.ok(dbCategory);
    t.equal(dbCategory.label, "Category A");

    // Transformer
    t.equal(typeof dbCategory.createdAt, "object");
    t.equal(typeof dbCategory.updatedAt, "object");
    t.ok(dbCategory.createdAt.toISOString());
    t.equal(dbCategory.deletedAt, undefined);

    category = dbCategory;
  });

  t.test("insert posts", async (t) => {
    const [dbPost1, dbPost2] = await queries.postInsert(sql, [
      {
        writer: user.id,
        title: "Post 1",
        body: "Body 1",
      },
      {
        writer: user.id,
        title: "Post 2",
        body: "Body 2",
      },
    ]);

    t.ok(dbPost1);
    t.ok(dbPost2);

    t.equal(dbPost1.writer, user.id);
    t.equal(dbPost2.writer, user.id);

    // Transformer
    t.equal(typeof dbPost1.createdAt, "object");
    t.equal(typeof dbPost1.updatedAt, "object");
    t.ok(dbPost1.createdAt.toISOString());
    t.equal(dbPost1.deletedAt, undefined);

    await queries.postCategoryInsert(sql, [
      {
        category: category.id,
        post: dbPost1.id,
      },
      {
        category: category.id,
        post: dbPost2.id,
      },
    ]);

    // where.$or testing
    const postCount = await queries.postCount(sql, {
      $or: [
        {
          id: dbPost1.id,
        },
        {
          id: dbPost2.id,
        },
      ],
    });

    t.equal(postCount, 2);

    post = dbPost1;
  });

  t.test("where iLike", async (t) => {
    const noUsers = await queryUser({
      where: {
        emailILike: "foo",
      },
    }).exec(sql);

    t.equal(noUsers.length, 0);

    const users = await queryUser({
      where: {
        emailILike: "test@test",
      },
    }).exec(sql);

    t.equal(users.length, 1);
  });

  t.test("where exists", async (t) => {
    const categories = await queryCategory({
      where: {
        viaPosts: {},
      },
    }).exec(sql);

    t.equal(categories.length, 1);
    t.equal(categories[0].id, category.id);
  });

  t.test("where not exists", async (t) => {
    const categories = await queryCategory({
      where: {
        postsNotExists: {},
      },
    }).exec(sql);

    t.equal(categories.length, 1);
    t.notEqual(categories[0].id, category.id);
  });

  t.test("insert jsonb null behavior", async (t) => {
    const [inserted] = await queries.settingsInsert(sql, {});

    const plainIsNull = await sql`SELECT *
                                  FROM "settings"
                                  WHERE
                                    "toggles" IS NULL;`;

    const jsonIsNull = await sql`SELECT *
                                 FROM "settings"
                                 WHERE
                                   "toggles" = 'null';`;

    t.ok(
      !plainIsNull.find((it) => it.id === inserted.id),
      "null is inserted as jsonb null, so no match here.",
    );
    t.ok(jsonIsNull.find((it) => it.id === inserted.id));
  });

  t.test("add category meta", async (t) => {
    const categories = await queryCategory().exec(sql);

    for (const cat of categories) {
      await queries.categoryMetaInsert(sql, {
        category: cat.id,
        postCount: await queries.postCategoryCount(sql, {
          category: cat.id,
        }),
        isHighlighted: category.id !== cat.id,
      });
    }

    t.equal(await queries.categoryMetaCount(sql), 2);
  });

  t.test("get posts for user", async (t) => {
    const result = await queryPost({
      where: {
        viaWriter: {
          where: {
            viaPosts: {
              where: {
                id: post.id,
              },
            },
          },
        },
      },
    }).exec(sql);

    t.equal(result.length, 2);

    // Transformer
    t.equal(typeof result[0].createdAt, "object");
    t.equal(typeof result[0].updatedAt, "object");
    t.notEqual(result[0].deletedAt, null, "deletedAt is undefined");
  });

  t.test("queryBuilder - select & nested usage", async (t) => {
    const result = await queryPost({
      select: ["id", "writer"],
      writer: {
        select: ["id"],
      },
    }).exec(sql);

    t.ok(isNil(result[0].createdAt));
    t.ok(result[0].id);
    t.ok(result[0].writer);
    t.ok(result[0].writer.id);
    t.ok(isNil(result[0].writer.nickName));
  });

  t.test("queryBuilder - select error", async (t) => {
    try {
      await queryPost({
        select: ["bar"],
      }).exec(sql);
    } catch (e) {
      t.equal(e.key, "validator.error");
      t.equal(e.info["$.postBuilder.select[0]"].key, "validator.string.oneOf");
    }
  });

  t.test("update user nick name", async (t) => {
    const [dbUser] = await queries.userUpdate(sql, {
      update: {
        nickName: "TestUser",
      },
      where: {
        id: user.id,
      },
      returning: "*",
    });

    t.notEqual(dbUser.updatedAt.getTime(), user.updatedAt.getTime());
    t.equal(dbUser.nickName, "TestUser");

    // Transformer
    t.equal(typeof dbUser.createdAt, "object");
    t.equal(typeof dbUser.updatedAt, "object");
    t.ok(dbUser.createdAt.toISOString());
    t.equal(dbUser.deletedAt, undefined);
  });

  t.test("empty where update", async (t) => {
    try {
      await queries.categoryMetaUpdate(sql, {
        update: {
          isHighlighted: true,
        },
        where: {},
      });
    } catch (e) {
      t.equal(e.key, "error.server.internal");
    }
  });

  t.test("empty update of entity without default date columns", async (t) => {
    try {
      await queries.categoryMetaUpdate(sql, {
        update: {},
        where: {
          isHighlighted: true,
        },
      });
    } catch (e) {
      t.equal(e.key, "error.server.internal");
    }
  });

  t.test("upsert user nick name", async (t) => {
    const id = uuid();
    const [insert] = await queries.userUpsertOnId(sql, {
      id,
      email: "test",
      authKey: uuid(),
      nickName: "foo",
    });

    t.equal(insert.id, id);

    const [upsert] = await queries.userUpsertOnId(sql, {
      id,
      email: "test2",
      authKey: uuid(),
      nickName: "foo",
    });

    t.equal(upsert.id, insert.id);
    t.deepEqual(upsert.createdAt, insert.createdAt);
    t.equal(upsert.email, "test2");

    await queries.userDelete(sql, {
      id,
    });
  });

  t.test("query filter by 'in' statements", async (t) => {
    await queryUser({
      where: {
        createdAtIn: [new Date()],
        emailIn: ["Test@test.com"],
        idNotIn: [uuid()],
      },
    }).exec(sql);

    // Also combine different array lengths, since we need to place comma's and such
    await queryUser({
      where: {
        idNotIn: [uuid(), uuid()],
        createdAtIn: [],
        emailIn: ["Test@test.com"],
      },
    }).exec(sql);
    t.pass();
  });

  t.test("query filter empty 'notIn' statement", async (t) => {
    const users = await queryUser({
      where: {
        createdAtNotIn: [],
      },
    }).exec(sql);

    t.equal(users.length, 1);
  });

  t.test(
    "query filter empty 'notIn' statement with other filter",
    async (t) => {
      const users = await queryUser({
        where: {
          createdAtNotIn: [],
          email: "test@test.com",
        },
      }).exec(sql);

      t.equal(users.length, 1);
    },
  );

  t.test("query filter by 'in' sub query", async (t) => {
    await queryUser({
      where: {
        emailIn: query`SELECT 'test@test.com' AS foo`,
      },
    }).exec(sql);
    t.pass();
  });

  t.test("query filter by 'ILIKE'", async (t) => {
    const [dbUser] = await queryUser({
      where: {
        emailILike: "Test",
      },
    }).exec(sql);

    t.ok(dbUser);
  });

  t.test("query filter via $raw", async (t) => {
    const [dbUser] = await queryUser({
      where: {
        $raw: query`"email" ILIKE ${"Test@test.com"}`,
      },
    }).exec(sql);

    t.ok(dbUser);
    t.equal(dbUser.email, "test@test.com");
  });

  t.test("query filter with empty idIn", async (t) => {
    const categories = await queryCategory({
      where: {
        idIn: [],
      },
    }).exec(sql);

    t.equal(categories.length, 0);
  });

  t.test("query filter with empty idIn and other filter", async (t) => {
    const categories = await queryCategory({
      where: {
        idIn: [],
        label: "Category A",
      },
    }).exec(sql);

    t.equal(categories.length, 0);
  });

  t.test("query same 'shortName' originally", async (t) => {
    await queryUser({
      posts: {
        postages: {},
      },
    }).exec(sql);

    await queryPostage({
      post: {
        writer: {},
      },
    }).exec(sql);

    t.pass();
  });

  t.test("user via referenced searchable", async (t) => {
    await queryUser({
      where: {
        isCool: "false",
      },
    }).exec(sql);

    t.pass();
  });

  t.test("user QueryBuilder", async (t) => {
    const [dbUser] = await queryUser({
      where: {
        id: user.id,
      },
      posts: {
        writer: {
          posts: {},
        },
      },
    }).exec(sql);

    t.ok(Array.isArray(dbUser.posts));
    t.equal(dbUser.posts.length, 2);
    t.equal(dbUser.id, user.id);

    // Nested posts contain the same writer id
    for (const post of dbUser.posts) {
      t.equal(post.writer.id, user.id);
      t.ok(Array.isArray(post.writer.posts));
      t.equal(post.writer.posts.length, 2);
      t.equal(post.writer.posts[0].writer, dbUser.id);
    }
  });

  t.test("user QueryBuilder - nested limit", async (t) => {
    const [dbUser] = await queryUser({
      where: {
        id: user.id,
      },
      posts: {
        writer: {
          posts: {},
        },
        limit: 1,
      },
    }).exec(sql);

    t.ok(Array.isArray(dbUser.posts));
    t.equal(dbUser.posts.length, 1);
  });

  t.test("category queryBuilder", async (t) => {
    // For each category:
    // - Get a single post,
    // - For that post get the writer as author with all posts
    // - Also get all categories for that post
    const categories = await queryCategory({
      where: {
        label: category.label,
      },
      posts: {
        limit: 1,
        post: {
          writer: {
            as: "author",
            where: {
              id: user.id,
            },
            posts: {},
          },
          categories: {
            category: {},
          },
        },
      },
      meta: {},
    }).exec(sql);

    t.ok(Array.isArray(categories));
    t.equal(categories.length, 1);
    t.equal(categories[0].posts[0].post.author.id, user.id);
  });

  t.test("query builder calls", async (t) => {
    await queryPost({
      postages: {
        post: {
          categories: {},
          writer: {
            posts: {
              postages: {},
            },
          },
        },
      },
      where: {
        viaCategories: {
          where: {
            viaCategory: {
              where: {
                viaPosts: {
                  where: {
                    viaPost: {
                      where: {
                        viaWriter: {
                          where: {
                            viaPosts: {
                              where: {
                                viaPostages: {},
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }).exec(sql);

    t.pass();
  });

  t.test("traverse via queryUser", async (t) => {
    const [dbUser] = await queryUser({
      where: {
        viaPosts: {
          where: {
            id: post.id,
          },
        },
      },
    }).exec(sql);

    t.equal(dbUser.id, user.id);
  });

  t.test("traverse with 'via' and idIn", async (t) => {
    const [dbUser] = await queryUser({
      where: {
        idIn: [post.writer],
        viaPosts: {
          where: {
            id: post.id,
          },
        },
      },
    }).exec(sql);

    t.equal(dbUser.id, user.id);
  });

  t.test("traverse with 'via' and multiple idIn", async (t) => {
    const [dbUser] = await queryUser({
      where: {
        idIn: [post.writer, uuid()],
        viaPosts: {
          where: {
            id: post.id,
          },
        },
      },
    }).exec(sql);

    t.equal(dbUser.id, user.id);
  });

  t.test("traverse via queryCategory", async (t) => {
    const builder = {
      where: {
        viaPosts: {
          where: {
            viaPost: {
              where: {
                viaWriter: {
                  where: {
                    id: user.id,
                    viaPosts: {
                      where: {
                        viaCategories: {
                          where: {
                            viaCategory: {
                              where: {
                                viaMeta: {
                                  where: {
                                    isHighlighted: false,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      meta: {},
      posts: {
        post: {},
      },
      offset: 0,
      limit: 1,
    };

    const [dbCategory] = await queryCategory(builder).exec(sql);

    t.equal(dbCategory.id, category.id);
    t.equal(dbCategory.meta.isNew, false);
  });

  t.test("category orderBy name", async (t) => {
    const categories = await queryCategory({
      orderBy: ["label"],
      orderBySpec: {
        label: "DESC",
      },
    }).exec(sql);

    t.equal(categories.length, 2);
    t.equal(categories[0].label, "Category B");
    t.equal(categories[1].label, "Category A");
  });

  t.test("category orderBy multiple columns", async (t) => {
    const categories = await queryCategory({
      orderBy: ["label", "createdAt"],
      orderBySpec: {
        label: "ASC",
        createdAt: "DESC",
      },
    }).exec(sql);

    t.equal(categories[0].label, "Category A");
  });

  t.test("post orderBy nested ordering", async (t) => {
    const [user] = await queryUser({
      posts: {
        orderBy: ["title"],
        orderBySpec: {
          title: "DESC",
        },
      },
    }).exec(sql);

    t.equal(user.posts.length, 2);
    t.equal(user.posts[0].title, "Post 2");
    t.equal(user.posts[1].title, "Post 1");
  });

  t.test("post orderBy nested defaults to ascending", async (t) => {
    const [user] = await queryUser({
      posts: {
        orderBy: ["title"],
      },
    }).exec(sql);

    t.equal(user.posts.length, 2);
    t.equal(user.posts[0].title, "Post 1");
    t.equal(user.posts[1].title, "Post 2");
  });

  t.test("soft delete post", async (t) => {
    const originalCount = await queries.postCount(sql);
    await queries.postUpdate(sql, {
      update: {
        deletedAt: new Date(new Date().getTime() - rootSql.systemTimeOffset),
      },
      where: { id: post.id },
    });

    const newCount = await queries.postCount(sql);
    const newCountWithDeleted = await queries.postCount(sql, {
      deletedAtIncludeNotNull: true,
    });

    t.notEqual(originalCount, newCount);
    t.equal(originalCount, newCountWithDeleted);
  });

  t.test("soft delete user", async (t) => {
    await queries.userUpdate(sql, {
      update: {
        deletedAt: new Date(new Date().getTime() - rootSql.systemTimeOffset),
      },
      where: { id: user.id },
    });

    await new Promise((r) => {
      setTimeout(r, 10);
    });

    const userCount = await queries.userCount(sql);
    t.equal(userCount, 0);

    const [dbUser] = await queryUser({
      where: {
        id: user.id,
        deletedAtIncludeNotNull: true,
      },
    }).exec(sql);

    // Transformer
    t.equal(typeof dbUser.createdAt, "object");
    t.ok(dbUser.createdAt.toISOString());
    t.equal(typeof dbUser.updatedAt, "object");
    t.ok(dbUser.updatedAt.toISOString());
    t.equal(typeof dbUser.deletedAt, "object");
    t.ok(dbUser.deletedAt.toISOString());
  });

  t.test("unknown key 'where'", async (t) => {
    try {
      await queryUser({
        where: { foo: "bar" },
      }).exec(sql);
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, `validator.error`);
      t.equal(e.info["$.userBuilder.where"].key, "validator.object.strict");
      t.deepEqual(e.info["$.userBuilder.where"].info.foundKeys, ["foo"]);
    }
  });

  t.test("extra key 'update'", async (t) => {
    try {
      await queries.postUpdate(sql, {
        update: {
          baz: true,
        },
        where: {
          foo: "bar",
        },
      });
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, "validator.error");
      t.ok(e.info["$.SqlPostUpdate.update"]);
      t.equal(e.info["$.SqlPostUpdate.update"].key, "validator.object.strict");
    }
  });

  t.test("extra key 'insert'", async (t) => {
    try {
      await queries.categoryInsert(sql, { quix: 6 });
      t.fail("Should throw with AppError, based on checkFields function.");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, `query.category.insertFields`);
      t.equal(e.info.extraKey, "quix");
    }
  });

  t.test("Insert with primary key", async (t) => {
    const id = uuid();
    const [category] = await queries.categoryInsert(
      sql,
      { id, label: "TestPK" },
      { withPrimaryKey: true },
    );

    t.equal(category.id, id);
  });

  t.test("deletedAt in the future should return result", async (t) => {
    const future = new Date();
    future.setUTCDate(future.getUTCDate() + 1);
    const [user] = await queries.userInsert(sql, {
      nickName: "Foo",
      email: "foo@example.com",
      authKey: uuid(),
      deletedAt: future,
    });
    const [selectUser] = await queryUser({
      where: {
        id: user.id,
      },
    }).exec(sql);

    t.ok(selectUser);
    t.deepEqual(selectUser.deletedAt, future);
  });

  t.test("await of queryBuilder should throw", async (t) => {
    try {
      await queryUser({});
      t.fail("QueryBuilder should throw");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 500);
    }
  });

  for (let i = 0; i < 5; ++i) {
    t.test(`${i}: testing sql where with more results`, async (t) => {
      const { user, posts } = await sqlTestSeed(sql, generatedDirectory);

      t.test(`id equal - user`, async (t) => {
        const result = await queryUser({
          where: {
            id: user.id,
          },
        }).exec(sql);

        t.ok(result.length, 1);
        t.equal(result[0].id, user.id);
      });

      t.test(`viaXxx - post.viaWriter`, async (t) => {
        const result = await queryPost({
          where: {
            viaWriter: {
              where: {
                id: user.id,
              },
            },
          },
        }).exec(sql);

        t.equal(result.length, 2);
        for (const post of result) {
          t.ok(posts.find((it) => it.id === post.id));
        }
      });

      t.test(`viaXxx offset+limit - user.viaPosts{0,1}`, async (t) => {
        const result = await queryUser({
          where: {
            viaPosts: {
              where: {
                writer: user.id,
              },
              offset: 1,
              limit: 1,
            },
          },
        }).exec(sql);

        t.equal(result.length, 1);
        t.equal(result[0].id, user.id);
      });
    });
  }

  t.test("too big insert error", async (t) => {
    try {
      await queries.postInsert(
        sql,
        Array.from({ length: 80000 }).map(() => ({
          writer: user.id,
          body: "Post 1",
          title: "Post 1",
        })),
      );
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 500);
    }
  });

  t.test("teardown", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    await cleanupGeneratedDirectory();

    t.ok(true);
  });
});

/**
 * Seeds the following:
 *
 * - categories: [
 *     category1: Category{},
 *     category2: Category{},
 *   ]
 * - user: User{}
 * - posts: [
 *     post1: Post{ categories: [category1], },
 *     post2: Post{ categories: [category1, category2] }
 *   ]
 *
 * @param {Postgres} sql
 * @param {string} generatedDirectory
 * @returns {Promise<{category: SqlCategory[], user: SqlUser, posts: SqlPost[]}>}
 */
async function sqlTestSeed(sql, generatedDirectory) {
  const { queries } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "database/index.js"))
  );

  const [user] = await queries.userInsert(sql, {
    email: `${uuid()}@test.com`,
    authKey: uuid(),
    isCool: "true",
    nickName: "Test user",
  });

  const [category1, category2] = await queries.categoryInsert(sql, [
    {
      label: uuid(),
    },
    { label: uuid() },
  ]);

  const [post1, post2] = await queries.postInsert(sql, [
    {
      writer: user.id,
      body: "Post 1",
      title: "Post 1",
    },
    {
      writer: user.id,
      body: "Post 2",
      title: "Post 2",
    },
  ]);

  await queries.postCategoryInsert(sql, [
    {
      post: post1.id,
      category: category1.id,
    },
    {
      post: post2.id,
      category: category1.id,
    },
    {
      post: post2.id,
      category: category2.id,
    },
  ]);

  return {
    user,
    posts: [post1, post2],
    category: [category1, category2],
  };
}
