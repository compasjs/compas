import { mainTestFn, test } from "@compas/cli";
import { uuid } from "@compas/stdlib";
import { cleanupTestPostgresDatabase } from "@compas/store";
import {
  fetchCatchErrorAndWrapWithAppError,
  fetchWithBaseUrl,
} from "../src/generated/common/api-client.js";
import { queries } from "../src/generated/common/database.js";
import { queryPost } from "../src/generated/database/post.js";
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
  const apiPort = 5500;

  await injectTestServices();

  const server = await new Promise((r) => {
    const server = app.listen(apiPort, () => {
      r(server);
    });
  });

  const fetchFn = fetchCatchErrorAndWrapWithAppError(
    fetchWithBaseUrl(fetch, `http://localhost:${apiPort}/`),
  );

  await queries.postInsert(
    sql,
    Array.from({ length: 10 }).map((_, idx) => ({
      title: `Title #${String(idx).padStart(2, "0")}`,
      contents: `Post contents for post #${idx}`,
    })),
  );

  t.test("apiPostList", (t) => {
    t.test("success", async (t) => {
      const result = await apiPostList(fetchFn, {}, {});

      t.equal(result.total, 10);
      t.equal(result.list.length, 10);
    });

    t.test("offset + limit", async (t) => {
      const result = await apiPostList(
        fetchFn,
        {
          offset: 1,
          limit: 1,
        },
        {},
      );

      t.equal(result.total, 10);
      t.equal(result.list.length, 1);
    });

    t.test("orderBy", async (t) => {
      const result = await apiPostList(
        fetchFn,
        {},
        {
          orderBy: ["title"],
          orderBySpec: {
            title: "DESC",
          },
        },
      );

      t.equal(result.list[0].title, `Title #09`);
      t.equal(result.list.at(-1).title, `Title #00`);
    });

    t.test("where", (t) => {
      t.test("contents - not allowed", async (t) => {
        try {
          await apiPostList(
            fetchFn,
            {},
            {
              where: {
                contents: "fail",
              },
            },
          );
        } catch (e) {
          t.equal(e.key, "validator.error");
        }
      });

      t.test("title - exact match", async (t) => {
        const result = await apiPostList(
          fetchFn,
          {},
          {
            where: {
              title: "Title #00",
            },
          },
        );

        t.equal(result.total, 1);
        t.equal(result.list[0].title, "Title #00");
      });
    });
  });

  t.test("apiPostSingle", (t) => {
    t.test("post.single.notFound", async (t) => {
      try {
        await apiPostSingle(fetchFn, {
          postId: uuid(),
        });
      } catch (e) {
        t.equal(e.key, "post.single.notFound");
      }
    });

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
      });

      const { item } = await apiPostSingle(fetchFn, {
        postId: result.item.id,
      });

      t.equal(item.title, "Title");
      t.equal(item.contents, "Contents");
    });
  });

  t.test("apiPostUpdate", (t) => {
    t.test("post.single.notFound", async (t) => {
      try {
        await apiPostUpdate(
          fetchFn,
          {
            postId: uuid(),
          },
          {
            title: "Updated",
            contents: "Updated",
          },
        );
      } catch (e) {
        t.equal(e.key, "post.single.notFound");
      }
    });

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
        },
      );

      const { item } = await apiPostSingle(fetchFn, { postId: post.id });

      t.equal(item.title, "Updated");
      t.equal(item.contents, "Updated");
    });

    t.test("only updates one post", async (t) => {
      const result = await apiPostList(
        fetchFn,
        {},
        {
          where: {
            title: "Updated",
          },
        },
      );

      t.equal(result.total, 1);
    });
  });

  t.test("apiPostDelete", (t) => {
    t.test("post.single.notFound", async (t) => {
      try {
        await apiPostDelete(fetchFn, {
          postId: uuid(),
        });
      } catch (e) {
        t.equal(e.key, "post.single.notFound");
      }
    });

    t.test("success", async (t) => {
      const [post] = await queryPost({ limit: 1 }).exec(sql);

      await apiPostDelete(fetchFn, { postId: post.id });

      try {
        await apiPostSingle(fetchFn, {
          postId: post.id,
        });
      } catch (e) {
        t.equal(e.key, "post.single.notFound");
      }
    });
  });

  t.test("teardown", async (t) => {
    server.close();
    await cleanupTestPostgresDatabase(sql);

    t.pass();
  });
});
