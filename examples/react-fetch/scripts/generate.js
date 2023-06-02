import { Generator } from "@compas/code-gen";

const generator = new Generator();
generator.addStructure(
  await (await fetch("https://ddv.tools/_compas/structure.json")).json(),
);

generator.generate({
  targetLanguage: "ts",
  outputDirectory: "./src/generated",
  generators: {
    apiClient: {
      target: {
        globalClient: true,
        targetRuntime: "browser",
        library: "fetch",
        includeWrapper: "react-query",
      },
    },
  },
});
