# Lint setup

::: tip

Requires `@compas/cli` and `@compas/eslint-plugin` to be installed as
'devDependencies'.

:::

The `@compas/eslint-plugin` package provides a Prettier config and ESLint
plugin. This configuration is tailored towards Javascript projects. When using
Typescript you can still use the Prettier config, however the command
(`compas lint`) shouldn't be used. To get the configuration in your project,
create the following three files:

**/.eslintrc.cjs**

```js
/* eslint-disable import/no-commonjs */

module.exports = {
  extends: ["plugin:@compas/full"],
};
```

**/.prettierrc.cjs**

```js
/* eslint-disable import/no-commonjs */

module.exports = {
  ...require("@compas/eslint-plugin/prettierrc.js"),
};
```

**/.prettierignore**

```txt
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
compas lint
```

This runs both ESLint and Prettier in auto fix mode over your Javascript files.
Prettier will also look at plain JSON and Markdown files.

There is also an environment variable available that runs Prettier in 'check'
mode. This way it will only report errors and not run the auto fixer. This can
be enabled by setting `CI=true`:

```shell
export CI=true
compas lint
unset CI
```

Most CI runners automatically set this environment variable, so the linter will
fail when code is not formatted correctly.
