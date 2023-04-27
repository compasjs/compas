import { mainTestFn, test } from "@compas/cli";
import { cleanupTestPostgresDatabase } from "@compas/store";
import {
  fetchCatchErrorAndWrapWithAppError,
  fetchWithBaseUrl,
} from "../src/generated/common/api-client.js";
import { queries } from "../src/generated/common/database.js";
import { queryPost } from "../src/generated/database/post.js";
import { queryPostTag } from "../src/generated/database/postTag.js";
import {
  apiPostCreate,
  apiPostDelete,
  apiPostList,
  apiPostSingle,
  apiPostUpdate,
} from "../src/generated/post/apiClient.js";
import { app, injectTestServices, sql } from "../src/services.js";

mainTestFn(import.meta);

test("e2e", async (t) => {
  const apiPort = 5501;

  await injectTestServices();

  const server = await new Promise((r) => {
    const server = app.listen(apiPort, () => {
      r(server);
    });
  });

  const fetchFn = fetchCatchErrorAndWrapWithAppError(
    fetchWithBaseUrl(fetch, `http://localhost:${apiPort}/`),
  );

  const posts = await queries.postInsert(
    sql,
    Array.from({ length: 10 }).map((_, idx) => ({
      title: `Title #${String(idx).padStart(2, "0")}`,
      contents: `Post contents for post #${idx}`,
    })),
  );

  await queries.postTagInsert(
    sql,
    Array.from({ length: 100 }).map((_, idx) => ({
      post: posts[Math.floor(Math.random() * (posts.length - 1))].id,
      tag: `Tag #${idx}`,
    })),
  );

  t.test("apiPostList", (t) => {
    t.test("success", async (t) => {
      const result = await apiPostList(fetchFn, {}, {});

      t.equal(result.total, 10);
      t.equal(result.list.length, 10);
    });
  });

  t.test("apiPostSingle", (t) => {
    t.test("success", async (t) => {
      const [post] = await queryPost({ limit: 1 }).exec(sql);

      const result = await apiPostSingle(fetchFn, {
        postId: post.id,
      });

      t.equal(result.item.id, post.id);
    });
  });

  t.test("apiPostCreate", (t) => {
    t.test("success", async (t) => {
      const result = await apiPostCreate(fetchFn, {
        title: "Title",
        contents: "Contents",
        tags: [{ tag: "Tag 1" }, { tag: "Tag 2" }],
      });

      const { item } = await apiPostSingle(fetchFn, {
        postId: result.item.id,
      });

      t.equal(item.title, "Title");
      t.equal(item.contents, "Contents");

      t.equal(item.tags.length, 2);
    });
  });

  t.test("apiPostUpdate", (t) => {
    t.test("success", async (t) => {
      const [post] = await queryPost({ limit: 1 }).exec(sql);

      await apiPostUpdate(
        fetchFn,
        {
          postId: post.id,
        },
        {
          title: "Updated",
          contents: "Updated",
          tags: [
            {
              tag: "Tag 1",
            },
          ],
        },
      );

      const { item } = await apiPostSingle(fetchFn, { postId: post.id });

      t.equal(item.title, "Updated");
      t.equal(item.contents, "Updated");
      t.equal(item.tags.length, 1);
      t.equal(item.tags[0].tag, "Tag 1");
    });
  });

  t.test("apiPostDelete", (t) => {
    t.test("success", async (t) => {
      const [post] = await queryPost({ limit: 1 }).exec(sql);

      await apiPostDelete(fetchFn, { postId: post.id });

      const tags = await queryPostTag({
        where: {
          post: post.id,
        },
      }).exec(sql);

      t.equal(tags.length, 0);
    });
  });

  t.test("teardown", async (t) => {
    server.close();
    await cleanupTestPostgresDatabase(sql);

    t.pass();
  });
});
