# Typescript setup

::: tip

Requires `@compas/cli` to be installed

:::

The recommended way of developing projects with Compas is to use JavaScript with
types in JSDoc. This prevents compilation steps and gives the same auto complete
experience as with Typescript. Some IDE's work better with the Typescript
Language Server so we recommend using a `tsconfig` or `jsconfig`. Compas
provides a `jsconfig` via `compas init --jsconfig`.

Note that the Compas ESLint plugin does not support Typescript files. Use a
custom config with for example `@typescript-eslint` for a better experience.
