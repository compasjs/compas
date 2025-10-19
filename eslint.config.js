import { defineConfig } from "@lightbase/eslint-config";

export default defineConfig(
  {
    prettier: {
      globalOverride: {
        useTabs: false,
        printWidth: 80,
      },
    },
  },
  {
    ignores: ["examples/**", "docs/**", "**/*.d.ts", "**/*.md/**/*.json5"],
  },
);
