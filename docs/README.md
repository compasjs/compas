# @LBU/\* Documentation

This documentation is an evolving process and may not always represent reality

## Getting started with LBU

To get started with LBU start in an empty directory and run the following
command:

With Yarn 'Classic':

```shell script
yarn init -yy && yarn add -D @lbu/cli && yarn lbu init
yarn dev
```

Or if you don't mind to have @lbu/cli globally installed (untested!):

```shell script
yarn add -G @lbu/cli && yarn lbu init
yarn dev
```

This will setup a new project using all the @lbu/\* goodies. And should have
started a simple server. In your browser go to `http://localhost:3000/` and you
should see something like:

```json
{
  "hello": "world"
}
```

Close the running server by hitting `Ctrl + C` or equivalent. Now add the
following at the bottom of `./src/gen/index.ts`:

```typescript
app
  .get("calculateSum")
  .path("/sum")
  .query(T =>
    T.set(
      T.object({
        a: T.number()
          .integer()
          .convert(),
        b: T.number()
          .integer()
          .convert(),
      }),
    ),
  );
```

Save the file and run the following command:

```shell script
yarn generate
```

This will load the just edited file, and generate some new files at
`./src/generated`. With the boring configuration out of the way. Let's implement
the logic.

Add the following at the bottom of `./src/index.ts`:

```typescript
routeHandlers.calculateSum = (ctx, next) => {
  const { a, b } = ctx.validatedQuery;
  ctx.body = {
    result: a + b,
  };

  return next();
};
```

Save this file and run the following command

```shell script
yarn dev
```

When you visit the browser at `http://localhost:3000/sum?a=5&b=5` you should see
something like:

```json
{
  "result": 10
}
```

To make sure your validation works correctly try one of the following urls:

```
http://localhost:3000/sum
http://localhost:3000/sum?a=5
http://localhost:3000/sum?a=5&b=foo
```

TODO: Suggest next steps

For more information see the docs about:

- [CLI](./cli.md)
- [Template](./template.md)
- [Code generation](./code-gen.md)
