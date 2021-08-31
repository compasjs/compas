# Script runner

::: tip

Requires `@compas/cli` and `@compas/stdlib` to be installed

:::

## Running scripts

The `@compas/cli` package comes with more features. Some of these will be
explored in later parts of this setup guide. For now, we will take a look at the
script runner.

The script runner at its base starts your scripts the same way as you would with
Node.js.

```shell
yarn compas ./src/a.js
# Is the same as `node ./src/a.js`
```

However, it can also run named scripts. It will look for scripts defined in your
`package.json` and in the `scripts` directory at the root of your project.
Create a file in `scripts/hello.js` with the following contents:

```js
import { mainFn } from "@compas/stdlib";

mainFn(import.meta, main);

function main(logger) {
  logger.info("Hello!");
}
```

When running `yarn compas help` it should list `hello` under the available
script names. Let's run it:

```shell
yarn compas hello
# Is the same as
yarn compas run hello
```

As you may have seen in the output from `yarn compas help`, there is also a
`--watch` flag. This flag can be used when specifying a path, but also when
running a 'named' script.

Let's start our `hello` script in watch-mode:

```shell
yarn compas --watch hello
```

Now when making any changes to the log line and saving, you should see the
script being restarted. If you just want to restart, type in `rs` and press
enter in your terminal. By default, all your JavaScript files are watched. This
is customizable via the
[watch options](/features/script-runner.html#watch-options).

## mainFn

An often used utility provided by the stdlib is `mainFn`. This does a few
things:

- Only runs if the file that you call `mainFn` in, is the 'main' file
- Reads the `.env` file if exists
- Calls the provided callback, and handles uncaught exceptions.
- Create a logger from [@compas/stdlib](/index.html#todo)

Let's create two files. Both exporting a constant and calling `mainFn`:

```js
// src/a.js
import { mainFn } from "@compas/stdlib";
import { b } from "./b.js";

mainFn(import.meta, (logger) => logger.info({ message: "Hello from a.js", b }));

export const a = true;

// src/b.js
import { mainFn } from "@compas/stdlib";
import { a } from "./a.js";

mainFn(import.meta, (logger) =>
  logger.info({ message: "Hello from b.js.", a }),
);

export const b = false;
```

Now if we run `src/a.js`, we see the following:

```txt
$ node ./src/a.js
{
  message: "Hello from a.js.",
  b: false,
}
```

When running `src/b.js`:

```txt
$ node ./src/b.js
{
  message: "Hello from b.js.",
  a: true,
}
```

As you can see in the output, only a single callback passed to `mainFn` is
called. This callback in `src/a.js` only being called when it is the starting
point of your program, ie started via `node ./src/a.js`. Consequently, the
callback passed in `src/b.js` is only called when you start your program with
`node ./src/b.js`.

## Watch options

Scripts can export this to control if and how they will be watched.

```js
export const cliWatchOptions = {
  disable: false,
  extensions: ["js"],
  // ignore changes in the docs directory or ending with '.test.js'.
  ignoredPatterns: ["docs", /\.test\.js$/],
};
```

## Environment

The `mainFn` function from `@compas/stdlib`, and by extension `mainTestFn` and
`mainBenchFn`, automatically loads the `.env.local` and `.env` files in the root
of the project. The idea is that the `.env` contains default values for a quick
development setup, so a new person on the team can just clone the project and
run it directly. The `.env.local` values take precedence over values defined the
`.env` file, and should be `.gitingore`'d. This is useful when your particular
dev setup is somehow different, ie your not using the `yarn compas docker` based
Postgres instance, but need to connect to a different Postgres instance.

It is expected that production values for these environment variables are
injected by the hosting method of choice.

Use `yarn compas help --check` to see if your `.env.local` is `.gitignore`'d
properly.
