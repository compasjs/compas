import { mainTestFn, test } from "@compas/cli";
import { cleanupTestPostgresDatabase } from "@compas/store";
import {
  fetchCatchErrorAndWrapWithAppError,
  fetchWithBaseUrl,
} from "../src/generated/common/api-client.js";
import { queries } from "../src/generated/common/database.js";
import {
  apiPostTagCreate,
  apiPostTagList,
} from "../src/generated/post/apiClient.js";
import { app, injectTestServices, sql } from "../src/services.js";

mainTestFn(import.meta);

test("e2e", async (t) => {
  const apiPort = 5502;

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

  t.test("apiPostTagList", (t) => {
    t.test("success", async (t) => {
      const result = await apiPostTagList(
        fetchFn,
        { postId: posts[0].id },
        {},
        {},
      );

      t.ok(result.total > 0);
    });
  });

  t.test("apiPostTagCreate", async (t) => {
    await apiPostTagCreate(
      fetchFn,
      {
        postId: posts[0].id,
      },
      {
        tag: "Test tag",
      },
    );

    const result = await apiPostTagList(
      fetchFn,
      {
        postId: posts[0].id,
      },
      {},
      {},
    );

    t.ok(result.list.find((it) => it.tag === "Test tag"));
  });

  t.test("teardown", async (t) => {
    server.close();
    await cleanupTestPostgresDatabase(sql);

    t.pass();
  });
});
