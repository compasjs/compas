# Setting up the CLI and linting

Of course a project needs linting and Compas provides a 2-step approach:

- Lint configuration via `@compas/lint-config`
- Running the linter via `@compas/cli`

Start with installing the dependencies:

```shell
yarn add @compas/lint-config @compas/cli --exact --dev
```

## Configuration

The `@compas/lint-config` package provides a Prettier config and ESLint
configuration. To get the configuration in your project, create the following
three files:

**/.eslintrc.cjs**

```js
/* eslint-disable import/no-commonjs */

module.exports = {
  extends: ["./node_modules/@compas/lint-config"],
  root: true,
};
```

**/.prettierrc.cjs**

```js
/* eslint-disable import/no-commonjs */

module.exports = {
  ...require("@compas/lint-config/prettierrc.js"),
};
```

**/.prettierignore**

```ignorelang
coverage/**
```

This way you should be able to easily override any configuration if necessary.
By following the respective guides / configuration options:

- [ESLint](https://eslint.org/docs/user-guide/configuring#configuring-rules)
- [Prettier](https://prettier.io/docs/en/options.html)
- [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import/)

Now is also a good time to set up your IDE to use your local configuration.

## Running the linter

At the moment we have only configured the underlying tools but have not run
anything yet. This is where `@compas/cli` comes in. This package also has a
range of features, but for now we focus on two of them. Let's start with running
the linters:

```shell
yarn compas lint
```

> When using NPM use `npx compas lint`

This runs both ESLint and Prettier in auto fix mode over your Javascript files.
Prettier will also look at plain JSON and Markdown files.

There is also an environment variable available that runs Prettier in 'check'
mode. This way it will only report errors and not run the auto fixer. This can
be enabled by setting `CI=true`:

```shell
export CI=true
yarn compas lint
unset CI
```

This environment variable is also document in [Environment variables](./#todo)

## Running scripts

The `@compas/cli` package also comes with more features. Some of these will be
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
is customizable via the [watch options](./#todo).
