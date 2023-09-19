# Lint integration

Knowing when to run Prettier, ESLint or any other tool is not always
straight-forward. In most cases, your IDE does that stuff for you, resulting in
unnecessarily running the tools manually. Compas integrates with ESLint and
Prettier to add a custom action when there are files available to be linted.

## Getting started

Compas automatically enables this integration when it detects that ESLint and/or
Prettier is installed. Compas can add `@compas/eslint-plugin` as a development
dependency when you run:

```shell
compas init lint
```

`@compas/eslint-plugin` includes ESLint, Prettier, various plugins for the
aforementioned, so you don't have to install them all separately. It also
contains some custom ESLint rules and default configs for both ESLint and
Prettier.

## Config

When `@compas/eslint-plugin` is installed and no config file is present for
ESLint and Prettier, Compas will automatically supply the necessary config
files. You can override this behavior by manually creating the config files.

---

TODO: figure out how we show to the user that files are available to lint

TODO: What happens on slower setups?

---

## Limitations

- Compas assumes that the tools only ever run from the top most projects. Most
  lint tools support using varying configs in different directories to alter
  behavior in for example workspaces.
