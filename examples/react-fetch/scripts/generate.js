import { readFileSync } from "node:fs";
import { Generator, loadApiStructureFromOpenAPI } from "@compas/code-gen";
import { dirnameForModule, pathJoin } from "@compas/stdlib";

const generator = new Generator()
  .addStructure(
    loadApiStructureFromOpenAPI(
      "github",
      JSON.parse(
        readFileSync(
          pathJoin(
            dirnameForModule(import.meta),
            "../../../__fixtures__/code-gen/githubapi.json",
          ),
          "utf-8",
        ),
      ),
    ),
  )
  .selectGroups(["emojis"]);

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
