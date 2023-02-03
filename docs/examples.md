# Compas examples

Examples of how to do various tasks with Compas. These examples can be used via
with `create-compas` to quickly start a new project.

```shell
# Via NPM
npx create-compas@latest
# Or with Yarn
yarn create compas
```

## Templates

Any Compas provided template can be used via
`npx create-compas@latest --template [template-name]`

- **[default](https://github.com/compasjs/compas/tree/main/examples/default):**
  This is the default template that is used. It contains boilerplate and
  conventions to create your api's.

- **[with-auth](https://github.com/compasjs/compas/tree/main/examples/with-auth):**
  Based on the default teplate, adds a basic register and loginc system, using
  `@compas/store` powered sessions.

## Synopsis

```txt
Usage: create-compas

Initialize Compas projects based on Compas examples or a custom repository.

Examples:
- yarn create compas
- npx create-compas@latest
- npx create-compas@latest --template with-auth
- npx create-compas@latest --template github:user/repo --output-directory ./my-project
- npx create-compas@latest --template github:user/repo --template-path ./path/to/scaffold --template-ref v1.0

References:
- Docs: https://compasjs.com
- Provided templates: https://github.com/compasjs/compas/tree/main/examples

Supported templates:
- Examples from the Compas repository, for example 'default'.
- Your own templates via their Git repository. Currently, only 'github:user/repo' is supported.

Note that for templates from the Compas repository, the default value for '--template-ref'
is based on the 'create-compas' version that you are using. To use the latest example version,
specify '--template-ref main'.

Flags:
  --help              Display information about the current command. (boolean)
  --template          Specify Compas example or custom repository. (string)
  --template-path     Use a subdirectory from the provided template repository. (string)
  --template-ref      Use a specific branch, tag or commit. (string)
  --output-directory  Use the provided directory instead of the current directory. (string)
```
