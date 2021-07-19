# Project setup

This series of setup documents explains the setup used in Node.js & Compas based
backends.

Let's start with creating a new project, in these docs `compas-todo`. Create a
new directory and open a terminal in that directory. Compas projects use
[ES modules](https://nodejs.org/dist/latest-v15.x/docs/api/esm.html#esm_introduction).
This results in projects created on top of Compas, to also use ES modules.

To enable this, make sure to use Node.js 16 or higher and create the following
package.json file:

```json
{
  "name": "compas-todo",
  "private": true,
  "type": "module"
}
```

Another useful file to create now, is a `.env` file with the following contents:

```txt
NODE_ENV=development
```

This changes some defaults, for example pretty printing in the logger.

## Stdlib

A package provided by Compas is `@compas/stdlib`. This contains various small
utility functions, like recursively looping over all files in a directory.

> All commands provided here use Yarn v1. However, using NPM (via the `npm` and
> `npx`) commands should work as well.

Installing Compas packages works exactly like you would expect:

```shell
yarn add @compas/stdlib --exact
```

An often used utility provided by the stdlib is `mainFn`. This does a few
things:

- Only runs if the file that you call `mainFn` in, is the 'main' file
- Reads the `.env` file if exists
- Calls the provided callback, and handles uncaught exceptions.
- Create a logger from [@compas/stdlib](./#todo)

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

Congrats! Your first Compas based project is alive :) The next steps cover a few
other essentials like linting, testing, setting up an HTTP server, connecting to
Postgres and finalizes with setting up the code generators.
