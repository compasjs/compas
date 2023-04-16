import { mainTestFn, test } from "@compas/cli";
import { cleanupTestPostgresDatabase } from "@compas/store";
import {
  fetchCatchErrorAndWrapWithAppError,
  fetchWithBaseUrl,
} from "../src/generated/common/api-client.js";
import { apiCompletedTodoList } from "../src/generated/completedTodo/apiClient.js";
import {
  apiTodoCreate,
  apiTodoList,
  apiTodoSingle,
  apiTodoUpdate,
} from "../src/generated/todo/apiClient.js";
import { app, injectTestServices, sql } from "../src/services.js";

mainTestFn(import.meta);

test("crud", async (t) => {
  const apiPort = 4442;

  await injectTestServices();

  const server = await new Promise((r) => {
    const server = app.listen(apiPort, () => {
      r(server);
    });
  });

  const fetchFn = fetchCatchErrorAndWrapWithAppError(
    fetchWithBaseUrl(fetch, `http://localhost:${apiPort}/`),
  );

  t.test("Empty todo list to start with", async (t) => {
    const { total } = await apiTodoList(fetchFn, {}, {});

    t.equal(total, 0);
  });

  t.test("Create a new todo item", async (t) => {
    const { item } = await apiTodoCreate(fetchFn, {
      title: "Write more tests",
    });

    t.equal(item.isCompleted, false, "Todo item should not be completed");
  });

  t.test("Retrieve all todo items", async (t) => {
    const { total, list } = await apiTodoList(fetchFn, {}, {});

    t.equal(total, 1);
    t.equal(list[0].title, "Write more tests");
  });

  t.test("Retrieve a single todo item", async (t) => {
    const { list } = await apiTodoList(fetchFn, {}, {});
    const { item } = await apiTodoSingle(fetchFn, { todoId: list[0].id });

    t.equal(item.id, list[0].id);
  });

  t.test("Insert and update title of todo", async (t) => {
    const { item: insertedItem } = await apiTodoCreate(fetchFn, {
      title: "Non-descriptive title",
    });

    await apiTodoUpdate(
      fetchFn,
      {
        todoId: insertedItem.id,
      },
      {
        title: "Descriptive title",
      },
    );

    const { item } = await apiTodoSingle(fetchFn, { todoId: insertedItem.id });

    t.equal(item.title, "Descriptive title");
    t.equal(item.isCompleted, false, "Todo is not completed yet");
  });

  t.test("Complete a todo", async (t) => {
    const { item: insertedItem } = await apiTodoCreate(fetchFn, {
      title: "Non-descriptive title",
    });

    await apiTodoUpdate(
      fetchFn,
      {
        todoId: insertedItem.id,
      },
      {
        title: insertedItem.title,
        completedAt: new Date(),
      },
    );

    const { item } = await apiTodoSingle(fetchFn, { todoId: insertedItem.id });

    t.equal(item.isCompleted, true);
  });

  t.test("Search the list on completed todo's", async (t) => {
    const { total } = await apiTodoList(
      fetchFn,
      {},
      {
        where: {
          completedAtIsNotNull: true,
        },
      },
    );

    const { total: completedTodoTotal } = await apiCompletedTodoList(
      fetchFn,
      {},
      {
        where: {
          isCompleted: true,
        },
      },
    );

    t.equal(total, 1);
    t.equal(completedTodoTotal, total);
  });

  t.test("Search the list on todo's that are not completed yet", async (t) => {
    const { total } = await apiTodoList(
      fetchFn,
      {},
      {
        where: {
          completedAtIsNull: true,
        },
      },
    );

    const { total: completedTodoTotal } = await apiCompletedTodoList(
      fetchFn,
      {},
      {
        where: {
          isCompleted: false,
        },
      },
    );

    t.equal(total, 2);
    t.equal(completedTodoTotal, total);
  });

  t.test("Search the list on titles", async (t) => {
    const { total } = await apiTodoList(
      fetchFn,
      {},
      {
        where: {
          titleILike: `write%`,
        },
      },
    );

    t.equal(total, 1, "Only includes 'Write more tests'");
  });

  t.test("teardown", async (t) => {
    server.close();
    await cleanupTestPostgresDatabase(sql);

    t.pass();
  });
});
