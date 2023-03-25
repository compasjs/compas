# Generating CRUD routes

On top of the previous building blocks, routes and entities, Compas can
automatically generate CRUD API's for you.

::: warning

This feature is currently only supported with the Koa compatible router and
Postgres database client.

:::

## Getting started

First specify an entity

```ts
import { TypeCreator } from "@compas/code-gen";

const T = new TypeCreator("database");

T.object("todoItem")
  .keys({
    title: T.string(),

    // .searchable() instructs the CRUD generator to use the generated database filter and
    // ordering options.
    finishedAt: T.string().searchable().optional(),
  })
  .enableQueries({
    withDates: true,
  });
```

Next build up the CRUD you want to support

```ts
const T = new TypeCreator("crudTodo");

T.crud("/todo")
  // Specify the above entity
  .entity(T.reference("database", "todoItem"))
  .routes({
    // Enable each route individually
    listRoute: true,
    singleRoute: false,
    createRoute: true,
    updateRoute: true,
    deleteRoute: false,
  });
```

The following routes are created:

- `apiCrudTodoList(): TodoItem[]` or `GET /todo/list`
- `apiCrudTodoCreate(body: TodoItem);` or `POST /todo`
- `apiCrudTodoUpdate(todoId: string, body: TodoItem);` or
  `PUT /todo/:todoId/update`

With included support for pagination, filtering and more.

## Modifiers and fields

Creating a selection of fields which can be read or written to is possible as
well.

```ts
T.object("user").keys({
  email: T.string(),
  password: T.string(),
  receiveChangelogEmails: T.bool(),
});

T.crud("/user")
  .entity(T.reference("database", "user"))
  .routes({
    singleRoute: true,
    updateRoute: true,
  })
  .fields({
    readable: {
      // Don't return the encrypted password
      $omit: ["password"],
    },
    writable: {
      // Only allow updating the preference
      $pick: ["receiveChangelogEmails"],
    },
  });

// Results in
declare function apiUserSingle(params: { userId: string }): {
  // Doesn't return the password
  email: string;
  receiveChangelogEmails: boolean;
};

declare function apiUserUpdate(
  params: { userId: string },
  body: {
    // Only allows updating the preference
    receiveChangelogEmails: boolean;
  },
);
```

The CRUD implementations will generate modifiers which will be called with the
validated input. This allows you to add extra checks, like authentication and
authorization, and add or overwrite fields.

```ts
// The generated initializer function
userRegisterCrud({
  // Pass in the Postgres connection
  sql,

  // Set a modifier for the single route
  userSinglePreModifier(event, ctx) {
    // Some way to fetch the user based on their session
    const user = resolveUserFromRequest(ctx);

    // Authentication check
    if (ctx.validatedParams.id !== user.id) {
      throw AppError.validationError("user.list.own", {
        message: "User can only fetch their own preferences",
      });
    }
  },
});
```

## Relations

Relations are supported in two ways, inline or nested. Inline CRUD allows sub
entities to be created, updated or deleted in the same call as the main entity.
Nested CRUD generates specific routes for sub entities.

```ts
import { TypeCreator } from "@compas/code-gen";

const T = new TypeCreator();
T.crud("/user")
  .entity(T.reference("database", "user"))
  .routes({
    // apiUserSingle({ userId }): { email: string, settings: DatabaseUserSettings };
    singleRoute: true,

    // apiUserUpdate({ userId }, { settings: { some: "new setting" } })
    updateRoute: true,
  })
  .fields({
    readable: {
      $pick: ["email"],
    },
    writable: {
      // Don't allow writes on the user
      $pick: [],
    },
  })
  .inlineRelations(
    // The single
    T.crud().fromParent("settings"),
  )
  .nestedRelations(
    T.crud().fromParent("posts", { name: "post" }).routes({
      // apiUserPostList({ userId });
      listRoute: true,

      // apiUserPostSingle({ userId, postId });
      singleRoute: true,
    }),
  );
```
