/* eslint-disable import/no-unresolved */
import { mainTestFn, test } from "@compas/cli";
import { AppError, isNil, uuid } from "@compas/stdlib";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
  query,
} from "@compas/store";

mainTestFn(import.meta);

test("code-gen/e2e/sql", async (t) => {
  const queriesImport = await import(
    "../../../generated/testing/sql/database/index.js"
  );
  const postEntityImport = await import(
    "../../../generated/testing/sql/database/post.js"
  );
  const userEntityImport = await import(
    "../../../generated/testing/sql/database/user.js"
  );
  const postageEntityImport = await import(
    "../../../generated/testing/sql/database/postage.js"
  );
  const categoryEntityImport = await import(
    "../../../generated/testing/sql/database/category.js"
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

  let user, category, post;

  t.test("insert user", async (t) => {
    const [dbUser] = await queriesImport.queries.userInsert(sql, {
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
    const [dbCategory] = await queriesImport.queries.categoryInsert(sql, [
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
    const [dbPost1, dbPost2] = await queriesImport.queries.postInsert(sql, [
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

    await queriesImport.queries.postCategoryInsert(sql, [
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
    const postCount = await queriesImport.queries.postCount(sql, {
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

  t.test("add category meta", async (t) => {
    const categories = await queriesImport.queries.categorySelect(sql);

    for (const cat of categories) {
      await queriesImport.queries.categoryMetaInsert(sql, {
        category: cat.id,
        postCount: await queriesImport.queries.postCategoryCount(sql, {
          category: cat.id,
        }),
        isHighlighted: category.id !== cat.id,
      });
    }

    t.equal(await queriesImport.queries.categoryMetaCount(sql), 2);
  });

  t.test("get posts for user", async (t) => {
    const result = await postEntityImport
      .queryPost({
        viaWriter: {
          viaPosts: {
            where: {
              id: post.id,
            },
          },
        },
      })
      .exec(sql);

    t.equal(result.length, 2);

    // Transformer
    t.equal(typeof result[0].createdAt, "object");
    t.equal(typeof result[0].updatedAt, "object");
    t.notEqual(result[0].deletedAt, null, "deletedAt is undefined");
  });

  t.test("update user nick name", async (t) => {
    const [dbUser] = await queriesImport.queries.userUpdate(
      sql,
      { nickName: "TestUser" },
      { id: user.id },
    );

    t.notEqual(dbUser.updatedAt.getTime(), user.updatedAt.getTime());
    t.equal(dbUser.nickName, "TestUser");

    // Transformer
    t.equal(typeof dbUser.createdAt, "object");
    t.equal(typeof dbUser.updatedAt, "object");
    t.ok(dbUser.createdAt.toISOString());
    t.equal(dbUser.deletedAt, undefined);
  });

  t.test("query filter by 'in' statements", async (t) => {
    await queriesImport.queries.userSelect(sql, {
      createdAtIn: [new Date()],
      emailIn: ["Test@test.com"],
      idNotIn: [uuid()],
    });

    // Also combine different array lengths, since we need to place comma's and such
    await queriesImport.queries.userSelect(sql, {
      idNotIn: [uuid(), uuid()],
      createdAtIn: [],
      emailIn: ["Test@test.com"],
    });
    t.pass();
  });

  t.test("query filter empty 'notIn' statement", async (t) => {
    const users = await userEntityImport
      .queryUser({
        where: {
          createdAtNotIn: [],
        },
      })
      .exec(sql);

    t.equal(users.length, 1);
  });

  t.test(
    "query filter empty 'notIn' statement with other filter",
    async (t) => {
      const users = await userEntityImport
        .queryUser({
          where: {
            createdAtNotIn: [],
            email: "test@test.com",
          },
        })
        .exec(sql);

      t.equal(users.length, 1);
    },
  );

  t.test("query filter by 'in' sub query", async (t) => {
    await queriesImport.queries.userSelect(sql, {
      emailIn: query`SELECT 'test@test.com' as foo`,
    });
    t.pass();
  });

  t.test("query filter by 'ILIKE'", async (t) => {
    const [dbUser] = await queriesImport.queries.userSelect(sql, {
      emailILike: "Test",
    });

    t.ok(dbUser);
  });

  t.test("query filter via $raw", async (t) => {
    const [dbUser] = await queriesImport.queries.userSelect(sql, {
      $raw: query`"email" ILIKE ${"Test@test.com"}`,
    });

    t.ok(dbUser);
    t.equal(dbUser.email, "test@test.com");
  });

  t.test("query filter with empty idIn", async (t) => {
    const categories = await queriesImport.queries.categorySelect(sql, {
      idIn: [],
    });

    t.equal(categories.length, 0);
  });

  t.test("query filter with empty idIn and other filter", async (t) => {
    const categories = await queriesImport.queries.categorySelect(sql, {
      idIn: [],
      label: "Category A",
    });

    t.equal(categories.length, 0);
  });

  t.test("query same 'shortName' originally", async (t) => {
    await userEntityImport
      .queryUser({
        posts: {
          postages: {},
        },
      })
      .exec(sql);

    await postageEntityImport
      .queryPostage({
        post: {
          writer: {},
        },
      })
      .exec(sql);
    t.pass();
  });

  t.test("user QueryBuilder", async (t) => {
    const [dbUser] = await userEntityImport
      .queryUser({
        where: {
          id: user.id,
        },
        posts: {
          writer: {
            posts: {},
          },
        },
      })
      .exec(sql);

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
    const [dbUser] = await userEntityImport
      .queryUser({
        where: {
          id: user.id,
        },
        posts: {
          writer: {
            posts: {},
          },
          limit: 1,
        },
      })
      .exec(sql);

    t.ok(Array.isArray(dbUser.posts));
    t.equal(dbUser.posts.length, 1);
  });

  t.test("category queryBuilder", async (t) => {
    // For each category:
    // - Get a single post,
    // - For that post get the writer as author with all posts
    // - Also get all categories for that post
    const categories = await categoryEntityImport
      .queryCategory({
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
      })
      .exec(sql);

    t.ok(Array.isArray(categories));
    t.equal(categories.length, 1);
    t.equal(categories[0].posts[0].post.author.id, user.id);
  });

  t.test("query builder calls", async (t) => {
    await postEntityImport
      .queryPost({
        postages: {
          images: {
            file: {
              group: {
                postageImages: {},
                children: {
                  file: {
                    group: {
                      parent: {},
                    },
                  },
                },
              },
            },
          },
        },
        viaCategories: {
          viaCategory: {
            viaPosts: {
              viaPost: {
                viaWriter: {
                  viaPosts: {
                    viaPostages: {},
                  },
                },
              },
            },
          },
        },
      })
      .exec(sql);

    t.pass();
  });

  t.test("traverse via queryUser", async (t) => {
    const [dbUser] = await userEntityImport
      .queryUser({
        viaPosts: {
          where: {
            id: post.id,
          },
        },
      })
      .exec(sql);

    t.equal(dbUser.id, user.id);
  });

  t.test("traverse with 'via' and idIn", async (t) => {
    const [dbUser] = await userEntityImport
      .queryUser({
        where: {
          idIn: [post.writer],
        },
        viaPosts: {
          where: {
            id: post.id,
          },
        },
      })
      .exec(sql);

    t.equal(dbUser.id, user.id);
  });

  t.test("traverse with 'via' and multiple idIn", async (t) => {
    const [dbUser] = await userEntityImport
      .queryUser({
        where: {
          idIn: [post.writer, uuid()],
        },
        viaPosts: {
          where: {
            id: post.id,
          },
        },
      })
      .exec(sql);

    t.equal(dbUser.id, user.id);
  });

  t.test("traverse via queryCategory", async (t) => {
    const builder = {
      viaPosts: {
        viaPost: {
          viaWriter: {
            where: {
              id: user.id,
            },
            viaPosts: {
              viaCategories: {
                viaCategory: {
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
      meta: {},
      posts: {
        post: {},
      },
      offset: 0,
      limit: 1,
    };

    const [dbCategory] = await categoryEntityImport
      .queryCategory(builder)
      .exec(sql);

    t.equal(dbCategory.id, category.id);
  });

  t.test("category orderBy name", async (t) => {
    const categories = await categoryEntityImport
      .queryCategory({
        orderBy: ["label"],
        orderBySpec: {
          label: "DESC",
        },
      })
      .exec(sql);

    t.equal(categories.length, 2);
    t.equal(categories[0].label, "Category B");
    t.equal(categories[1].label, "Category A");
  });

  t.test("category orderBy multiple columns", async (t) => {
    const categories = await categoryEntityImport
      .queryCategory({
        orderBy: ["label", "createdAt"],
        orderBySpec: {
          label: "ASC",
          createdAt: "DESC",
        },
      })
      .exec(sql);

    t.equal(categories[0].label, "Category A");
  });

  t.test("post orderBy nested ordering", async (t) => {
    const [user] = await userEntityImport
      .queryUser({
        posts: {
          orderBy: ["title"],
          orderBySpec: {
            title: "DESC",
          },
        },
      })
      .exec(sql);

    t.equal(user.posts.length, 2);
    t.equal(user.posts[0].title, "Post 2");
    t.equal(user.posts[1].title, "Post 1");
  });

  t.test("post orderBy nested defaults to ascending", async (t) => {
    const [user] = await userEntityImport
      .queryUser({
        posts: {
          orderBy: ["title"],
        },
      })
      .exec(sql);

    t.equal(user.posts.length, 2);
    t.equal(user.posts[0].title, "Post 1");
    t.equal(user.posts[1].title, "Post 2");
  });

  t.test("soft delete post", async (t) => {
    const originalCount = await queriesImport.queries.postCount(sql);
    await queriesImport.queries.postDelete(sql, { id: post.id });

    const newCount = await queriesImport.queries.postCount(sql);
    const newCountWithDeleted = await queriesImport.queries.postCount(sql, {
      deletedAtIncludeNotNull: true,
    });

    t.notEqual(originalCount, newCount);
    t.equal(originalCount, newCountWithDeleted);
  });

  t.test("soft delete user", async (t) => {
    await queriesImport.queries.userDelete(sql, { id: user.id });

    const userCount = await queriesImport.queries.userCount(sql);
    t.equal(userCount, 0);

    const postCount = await queriesImport.queries.postCount(sql);
    t.equal(postCount, 0, "soft cascading deletes");

    const [dbUser] = await queriesImport.queries.userSelect(sql, {
      id: user.id,
      deletedAtIncludeNotNull: true,
    });

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
      await queriesImport.queries.userSelect(sql, { foo: "bar" });
      t.fail("Should throw with AppError, based on checkFields function.");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, `validator.object.strict`);

      t.equal(e.info.extraKey, "foo");
    }
  });

  t.test("extra key 'update'", async (t) => {
    try {
      await queriesImport.queries.postUpdate(
        sql,
        { baz: true },
        { foo: "bar" },
      );
      t.fail("Should throw with AppError, based on checkFields function.");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, `query.post.updateFields`);
      t.equal(e.info.extraKey, "baz");
    }
  });

  t.test("extra key 'insert'", async (t) => {
    try {
      await queriesImport.queries.categoryInsert(sql, { quix: 6 });
      t.fail("Should throw with AppError, based on checkFields function.");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, `query.category.insertFields`);
      t.equal(e.info.extraKey, "quix");
    }
  });

  t.test("Insert with primary key", async (t) => {
    const id = uuid();
    const [category] = await queriesImport.queries.categoryInsert(
      sql,
      { id, label: "TestPK" },
      { withPrimaryKey: true },
    );

    t.equal(category.id, id);
  });

  t.test("deletedAt in the future should return result", async (t) => {
    const future = new Date();
    future.setUTCDate(future.getUTCDate() + 1);
    const [user] = await queriesImport.queries.userInsert(sql, {
      nickName: "Foo",
      email: "foo@example.com",
      authKey: uuid(),
      deletedAt: future,
    });
    const [selectUser] = await queriesImport.queries.userSelect(sql, {
      id: user.id,
    });

    t.ok(selectUser);
    t.deepEqual(selectUser.deletedAt, future);
  });

  t.test("await of queryBuilder should throw", async (t) => {
    try {
      await userEntityImport.queryUser({});
      t.fail("QueryBuilder should throw");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 500);
    }
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true);
  });
});
