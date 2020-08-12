import { App } from "@lbu/code-gen";
import { mainFn } from "@lbu/stdlib";
import { extendWithDependencies, extendWithInternal } from "../gen/index.js";

mainFn(import.meta, main);

export const nodemonArgs = "--ignore src/generated";

async function main() {
  const app = await App.new({ verbose: true });

  extendWithDependencies(app);
  extendWithInternal(app);

  await app.generate({
    outputDirectory: "./src/generated",
    useTypescript: false,
    dumpStructure: true,
    dumpPostgres: true,
    enabledGenerators: ["type", "validator", "router", "apiClient", "sql"],
  });
}
