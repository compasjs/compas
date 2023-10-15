# Continuous Integration (CI)

Running various checks in CI can be handled by Compas as well.

::: code-group

```shell [GitHub]
compas init github
# Overwrites `.github/workflows/check.yml`
```

:::

The supported templates checkout the repository, configure cache when applicable
and then start Compas via `compas ci`. If the CI provider that you want to use
is not listed, try to mimic the following Shell commands:

```shell
# Either install packages via the package manager that you use and invoke Compas
npm ci
npx compas ci

# OR let Compas infer the used package manager and install packages for you.

# Retrieve the used Compas version from the package.json (e.g 0.8.0 or latest).
COMPAS_VERSION=$(jq --raw-output '.devDependencies.compas // .dependencies.compas // "latest" | ltrimstr("v")' package.json)
npx compas@$COMPAS_VERSION ci
```

## Steps

- **Package manager**: Compas starts with the package installation command of
  the inferred package manager.
- **Docker**: Required Docker containers are started, when specified in the
  configs.
- **Migrations**: If migrations are enabled, they will be executed.
- **Format and linting**: Supported linters like Prettier and ESLint are
  executed
- **Tests**: If a test command is inferred or found in the config, it is
  executed.

## Multiple repositories

The default CI templates provided by Compas only checkout the current
repository. If things like tests require multiple checked out repositories to
get a complete workspace, please edit the templates manually.
