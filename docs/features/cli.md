# CLI

::: tip

Requires `@compas/cli` and `@compas/stdlib` to be installed

:::

The first thing that we will take a look at is the Compas CLI. This packs quite a lot of
features. Let's see what it has to offer:

```shell
compas help
```

As you can see, there is quite a variety of commands, feel free to explore them with
`compas help COMMAND` or `compas COMMAND --help`. Some commands also require inputs in the
form of flags. The expected value is often put at the end of a flag description. Let's see
some examples:

**Toggle flags**

These are fine without a value, or with a number / string representing true and false.

```txt
// --help   Display help text (boolean)
-> `--help`, `--help=1`, `--help false`
```

As you can see both `--help=1` and `--help false` are supported when specifying a value.

**Multiple strings**

Some flags can be passed multiple times, this is denoted by the `[]` after `string[]`.

```txt
// --file   Specify files to operate on (string[])
-> `--file ./x.js`, `--file ./a.js --file ./bar/b.js`
```

::: info

If you are unable to run the CLI, you can take a look at
[the reference](/references/cli.html).

:::

## Running scripts

The `@compas/cli` package comes with more features. Some of these will be explored in
later parts of this setup guide. For now, we will take a look at the script runner.

The script runner at its base starts your scripts the same way as you would with Node.js.

```shell
compas run ./src/a.js
# Is the same as `node ./src/a.js`
```

However, it can also run named scripts. It will look for scripts defined in your
`package.json` and in the `scripts` directory at the root of your project. Create a file
in `scripts/hello.js` with the following contents:

```js
import { mainFn } from "@compas/stdlib";

mainFn(import.meta, main);

function main(logger) {
	logger.info("Hello!");
}
```

Let's run it:

```shell
compas run hello
```

This script is only printing 'Hello!', but you can use it for all tasks that require some
code, and that you need to execute while developing or deploying.

## mainFn

An often used utility provided by the stdlib is `mainFn`. This does a few things:

- Only runs if the file that you call `mainFn` in, is the 'main' file
- Reads the `.env` file if exists
- Calls the provided callback, and handles uncaught exceptions.
- Create a logger from [@compas/stdlib](/index.html#todo)

Let's create two files. Both exporting a constant and calling `mainFn`:

```js
// src/a.js
import { a } from "./a.js";
import { b } from "./b.js";
import { mainFn } from "@compas/stdlib";

// src/b.js
import { mainFn } from "@compas/stdlib";

mainFn(import.meta, (logger) => logger.info({ message: "Hello from a.js", b }));

export const a = true;

mainFn(import.meta, (logger) => logger.info({ message: "Hello from b.js.", a }));

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

As you can see in the output, only a single callback passed to `mainFn` is called. This
callback in `src/a.js` only being called when it is the starting point of your program, ie
started via `node ./src/a.js`. Consequently, the callback passed in `src/b.js` is only
called when you start your program with `node ./src/b.js`.

## Environment

The `mainFn` function from `@compas/stdlib`, and by extension `mainTestFn`, automatically
loads the `.env.local` and `.env` files in the root of the project. The idea is that the
`.env` contains default values for a quick development setup, so a new person on the team
can just clone the project and run it directly. The `.env.local` values take precedence
over values defined the `.env` file, and should be `.gitingore`'d. This is useful when
your particular dev setup is somehow different, ie your not using the `compas docker`
based Postgres instance, but need to connect to a different Postgres instance.

It is expected that production values for these environment variables are injected by the
hosting method of choice.

Use `compas check-env` to see if your `.env.local` is `.gitignore`'d properly.
