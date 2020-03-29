import { M, R } from "@lbu/code-gen";

/**
 * @param {App} app
 */
export function todoModel(app) {
  const todoList = M.object("TodoList", {
    name: M.string(),
    items: M.array(
      M.object("TodoItem", {
        completed: M.bool().default(false),
        name: M.string(),
      }),
    ),
  });

  const todoCollection = M.generic("TodoCollection")
    .keys(M.ref("TodoList", "name"))
    .values(todoList);

  app.validator(todoList, todoCollection);

  const routes = R.group("todo", "/todo");

  const paramValidator = M.object("TodoNameParam", {
    name: M.string().min(0).max(30).trim().convert(),
  });

  app.route(
    routes.get("/", "all").response(
      M.object({
        store: todoCollection,
      }),
    ),
  );

  const todoListResponse = M.object("TodoListResponse", {
    todo: todoList,
  });

  app.route(
    routes
      .get("/:name", "one")
      .params(paramValidator)
      .response(todoListResponse),
  );

  app.route(
    routes
      .post("/", "new")
      .body(
        M.object({
          name: M.string()
            .min(1)
            .max(40)
            .trim()
            .mock("'Todo ' + __.integer({ min: 0, max: 1000 })"),
        }),
      )
      .response(todoListResponse),
  );

  app.route(
    routes
      .post("/:name/item/", "createItem")
      .params(paramValidator)
      .body(
        M.object({
          name: M.string()
            .min(1)
            .max(365)
            .trim()
            .mock("__.sentence({ words: 6 })"),
        }),
      )
      .response(todoListResponse),
  );

  app.route(
    routes
      .post("/:name/item/toggle", "toggleItem")
      .params(paramValidator)
      .body(
        M.object({
          index: M.number().integer().convert().min(0),
        }),
      )
      .response(todoListResponse),
  );

  app.route(
    routes
      .delete("/:name", "delete")
      .params(paramValidator)
      .response(
        M.object({
          deleted: M.bool(),
        }),
      ),
  );
}
