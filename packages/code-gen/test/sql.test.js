import { mainTestFn, test } from "@compas/cli";
import { AppError, isNil, uuid } from "@compas/stdlib";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
  query,
} from "@compas/store";

mainTestFn(import.meta);

test("code-gen/e2e/sql", async (t) => {
  const client = await import("../../../generated/testing/sql/index.js");
  const validators = await import(
    "../../../generated/testing/sql/anonymous-validators.js"
  );

  validators.validatorSetError(AppError.validationError);

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
    const [dbUser] = await client.queries.userInsert(sql, {
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
    const [dbCategory] = await client.queries.categoryInsert(sql, [
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
    const [dbPost1, dbPost2] = await client.queries.postInsert(sql, [
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

    await client.queries.postCategoryInsert(sql, [
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
    const postCount = await client.queries.postCount(sql, {
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
    const categories = await client.queries.categorySelect(sql);

    for (const cat of categories) {
      await client.queries.categoryMetaInsert(sql, {
        category: cat.id,
        postCount: await client.queries.postCategoryCount(sql, {
          category: cat.id,
        }),
        isHighlighted: category.id !== cat.id,
      });
    }

    t.equal(await client.queries.categoryMetaCount(sql), 2);
  });

  t.test("get posts for user", async (t) => {
    const result = await client
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
    const [dbUser] = await client.queries.userUpdate(
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

  t.test("query filter by 'in' statements", async () => {
    await client.queries.userSelect(sql, {
      createdAtIn: [new Date()],
      emailIn: ["Test@test.com"],
      idNotIn: [uuid()],
    });
  });

  t.test("query filter by 'in' sub query", async () => {
    await client.queries.userSelect(sql, {
      emailIn: query`SELECT 'test@test.com' as foo`,
    });
  });

  t.test("user QueryBuilder", async (t) => {
    const [dbUser] = await client
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

  t.test("category queryBuilder", async (t) => {
    // For each category:
    // - Get a single post,
    // - For that post get the writer as author with all posts
    // - Also get all categories for that post
    const categories = await client
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

  t.test("traverse via queryUser", async (t) => {
    const [dbUser] = await client
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

    const [dbCategory] = await client.queryCategory(builder).exec(sql);

    t.equal(dbCategory.id, category.id);
  });

  t.test("soft delete post", async (t) => {
    const originalCount = await client.queries.postCount(sql);
    await client.queries.postDelete(sql, { id: post.id });

    const newCount = await client.queries.postCount(sql);
    const newCountWithDeleted = await client.queries.postCount(sql, {
      deletedAtIncludeNotNull: true,
    });

    t.notEqual(originalCount, newCount);
    t.equal(originalCount, newCountWithDeleted);
  });

  t.test("soft delete user", async (t) => {
    await client.queries.userDelete(sql, { id: user.id });

    const userCount = await client.queries.userCount(sql);
    t.equal(userCount, 0);

    const postCount = await client.queries.postCount(sql);
    t.equal(postCount, 0, "soft cascading deletes");

    const [dbUser] = await client.queries.userSelect(sql, {
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
      await client.queries.userSelect(sql, { foo: "bar" });
      t.fail("Should throw with AppError, based on checkFields function.");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, `validator.object.strict`);

      t.equal(e.info.extraKey, "foo");
    }
  });

  t.test("extra key 'update'", async (t) => {
    try {
      await client.queries.postUpdate(sql, { baz: true }, { foo: "bar" });
      t.fail("Should throw with AppError, based on checkFields function.");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, `query.post.updateFields`);
      t.equal(e.info.extraKey, "baz");
    }
  });

  t.test("extra key 'insert'", async (t) => {
    try {
      await client.queries.categoryInsert(sql, { quix: 6 });
      t.fail("Should throw with AppError, based on checkFields function.");
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, `query.category.insertFields`);
      t.equal(e.info.extraKey, "quix");
    }
  });

  t.test("Insert with primary key", async (t) => {
    const id = uuid();
    const [category] = await client.queries.categoryInsert(
      sql,
      { id, label: "TestPK" },
      { withPrimaryKey: true },
    );

    t.equal(category.id, id);
  });

  t.test("deletedAt in the future", async (t) => {
    const future = new Date();
    future.setUTCDate(future.getUTCDate() + 1);
    const [user] = await client.queries.userInsert(sql, {
      nickName: "Foo",
      email: "foo@example.com",
      authKey: uuid(),
      deletedAt: future,
    });
    const [selectUser] = await client.queries.userSelect(sql, { id: user.id });

    t.ok(selectUser);
    t.deepEqual(selectUser.deletedAt, future);
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true);
  });
});
