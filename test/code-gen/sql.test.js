/* eslint-disable import/no-unresolved */
import { mainTestFn, test } from "@compas/cli";
import { uuid } from "@compas/stdlib";
import { queries } from "../../generated/testing/sql/database/index.js";
import { queryPost } from "../../generated/testing/sql/database/post.js";
import { queryUser } from "../../generated/testing/sql/database/user.js";
import { sql } from "../../src/testing.js";

mainTestFn(import.meta);

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
 * @returns {Promise<{category: SqlCategory[], user: SqlUser, posts: SqlPost[]}>}
 */
async function sqlTestSeed() {
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

const SQL_REPEAT_ROUNDS = 5;

test("code-gen/sql/where", async (t) => {
  for (let i = 0; i < SQL_REPEAT_ROUNDS; ++i) {
    const { user, posts } = await sqlTestSeed();

    t.test("id equal - user", async (t) => {
      const result = await queryUser({
        where: {
          id: user.id,
        },
      }).exec(sql);

      t.ok(result.length, 1);
      t.equal(result[0].id, user.id);
    });

    t.test("viaXxx - post.viaWriter", async (t) => {
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

    t.test("viaXxx offset+limit - user.viaPosts{0,1}", async (t) => {
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
  }
});
