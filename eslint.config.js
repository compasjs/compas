import { defineConfig } from "@lightbase/eslint-config";

export default defineConfig(
  {
    prettier: {
      globalOverride: {
        useTabs: false,
        printWidth: 80,
      },
    },
    typescript: false,
  },
  {
    rules: {
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: ["docs/**", "**/*.d.ts", "**/*.md/**/*.json5"],
  },
);
