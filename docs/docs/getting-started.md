# Getting started

::: danger

This is still in development. In some cases, docs exist but the features haven't been
released yet.

Provide feedback and suggestions in https://github.com/compasjs/compas/issues/2774.

:::

::: warning

This documentation uses `compas` as the CLI tool. However, to not interfere with the
stable [CLI](/features/cli.md), the alpha CLI is called `zakmes`.

:::

## Installation

Compas can install itself with:

```shell
npx compas@latest init
```

**In an empty directory**:

Compas creates a package.json, installs the necessary dependencies via npm and initializes
a Git repository.

**Existing project**:

Compas infers the used package manager (npm, yarn or pnpm), adds itself as a dependency
and executes an installation. If Compas is already installed in your project, Compas will
try to update itself to the latest available version.

::: info

In the alpha period, use `npx -p compas zakmes@latest init`.

:::

Off to a great start!

## Development setup

For development, we recommend setting up an 'alias' in your local login file (`.bashrc`,
`.zshrc`, etc). This allows you to execute `compas` with a prefix like `npx compas` or
`yarn compas`.

Add the following line to your `~/.bashrc` or `~/.zhsrc` (or the corresponding file for
your shell).

::: code-group

```shell [npm]
alias compas='npx compas'
```

```shell [yarn]
alias compas='yarn compas'
```

```shell [pnpm]
alias compas='pnpm compas'
```

:::

Close and reopen your terminal for this to take effect.

::: info

As an early user, you probably want to add another variant for `zakmes`.

:::

## Usage

```shell
compas
```

That is it. Let's take a look at some of the things that Compas will do by default.
