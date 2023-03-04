# Code generators

Compas' main feature set consists of target aware code generation. By utilizing
a structure or specification, Compas can generate type definitions, validators,
API clients, routers and database clients.

## Installation

Compas requires at least Node.js 18 or higher.

```shell
npm install --save-dev --save-exact @compas/code-gen  # npm
yarn add --dev --exact @compas/code-gen               # yarn
```

## Explore

Taking the following OpenAPI specification

```yaml
openapi: 3.0.6
tags:
  - name: user
    description: User related routes
paths:
  /users:
    get:
      tags: [user]
      summary: Returns a list of users.
      operationId: list
      responses:
        "200": # status code
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
```

Compas can generate a Typescript API client with the following signature:

```ts
declare function apiUserList(axiosInstance: AxiosInstance): Promise<string[]>;
```

Or a typed Koa compatible router which can be used like:

```js
userHandlers.list = async (ctx) => {
  // ctx.body is typed as `string[]`
  ctx.body = ["user 1", "user 2"];
};
```

And a bunch more! Start discovering the Compas code generators by reading more
about

- [The supported targets](/generators/targets.html)
- [Generating API clients](/generators/api-clients.html)
- [Or building your own structure](/generators/build-structure.html)
