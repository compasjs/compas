import { TypeCreator } from "@compas/code-gen";

/**
 * Definition of our todo entity and routes
 *
 * @param {App} app
 */
export function extendWithTodo(app) {
  const T = new TypeCreator("todo");
  const R = T.router("/todo");

  const todoItem = T.object("item").keys({
    id: T.uuid(),
    task: T.string(),
    metadata: {
      tags: [T.string()],
      isUrgent: T.bool(),
    },
    createdAt: T.date(),
  });

  app.add(
    R.get("/", "list").response({
      todos: [todoItem],
    }),

    R.get("/:id", "single")
      .params({
        id: T.uuid(),
      })
      .response({
        todo: todoItem,
      }),

    R.post("/", "add")
      .body(T.pick().object(todoItem).keys("task", "metadata"))
      .response({
        todo: todoItem,
      })
      .invalidations(R.invalidates("todo", "list")),

    R.delete("/:id", "complete")
      .params({
        id: T.uuid(),
      })
      .response({
        success: true,
      })
      .invalidations(
        R.invalidates("todo", "single", { useSharedParams: true }),
      ),
  );
}
