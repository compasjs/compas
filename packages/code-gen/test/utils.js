import { dirnameForModule, pathJoin } from "@lbu/stdlib";
import { App } from "../index.js";

export const baseTestDir = pathJoin(
  dirnameForModule(import.meta),
  "../test-generated/",
);

const generatorPaths = {
  validator: (subTest) => pathJoin(baseTestDir, subTest, "validators.js"),
};

/**
 * Create app, generate amd load in generated code.
 * @param {string} testName
 * @param {function(app: App): string[]} callback
 * @returns {Promise<{}>}
 */
export async function generateAndLoad(testName, callback) {
  const app = await App.new({
    verbose: false,
  });
  const generators = callback(app);
  await app.generate({
    enabledGenerators: generators,
    outputDirectory: pathJoin(baseTestDir, testName),
  });

  const obj = {};
  for (const gen of generators) {
    obj[gen] = await import(generatorPaths[gen](testName));
  }

  return obj;
}
