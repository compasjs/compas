# Typescript setup

::: tip

Requires `@compas/cli` to be installed

:::

The recommended way of developing projects with Compas is to use JavaScript with
types in JSDoc. This prevents compilation steps and gives the same auto complete
experience as Typescript. Some IDE's don't work like this so we added and now
recommend using a jsconfig so the Typescript Language server understands Compas
projects. Use `yarn compas init --jsconfig` to create / overwrite the
recommended config.

Note that the ESLint setup doesn't support Typescript files, so make sure to
exclude them if your IDE has ESLint integration.

## Code generation

Frontend projects using the code generators are expected to use Typescript,
which is why the 'reactQuery' generator only supports generating Typescript.

The code generator also supports making all major Compas types global, via a
generated `.d.ts` (Typescript declaration) file. To use this, see
[generateTypes](/index.html#todo)
