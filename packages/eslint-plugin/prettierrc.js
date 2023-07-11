/* eslint-disable import/no-commonjs */

module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  bracketSpacing: true,
  arrowParens: "always",
  proseWrap: "always",
  endOfLine: "lf",
  overrides: [
    {
      files: "*.js",
      options: {
        parser: "meriyah",
      },
    },
  ],
};
