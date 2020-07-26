# Lint-config

The lint-config package provides opinionated ESLint and Prettier configurations.
These can be used in combination with the [cli](/cli.md), specifically
`yarn lbu lint`.

The following packages are in use:

- **babel-eslint**: The parser used by ESLint
- **eslint-config-prettier**: Disable all stylistic ESLint rules. As this is
  done by Prettier.
- **eslint-plugin-import**: Support for various rules around ES Modules and
  importing/exporting in them.

## Overriding Prettier options

To override prettier options create a `.prettierrc.cjs` file in the root of your
project with the following contents:

```js
module.exports = {
  ...require("@lbu/lint-config/prettierrc"),
  // Your custom rules
};
```

Make sure to remove the `prettier` key from your package.json so Prettier will
read the file.

## Overriding ESLint rules

To override the provided ESLint rules do one of the following in your
`.eslintrc.cjs` file.

- Change the 'rules' object directly

```
base.rules["my-rule"] = "off";
```

- Use ESLint extends options

See
[ESLint documentation](https://eslint.org/docs/developer-guide/shareable-configs#npm-scoped-modules)
