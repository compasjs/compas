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
    ignores: ["examples/**", "docs/**", "**/*.d.ts", "**/*.md/**/*.json5"],
  },
);
