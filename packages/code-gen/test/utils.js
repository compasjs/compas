import { dirnameForModule, pathJoin, spawn } from "@lbu/stdlib";
import { App } from "../index.js";

export const baseTestDir = pathJoin(
  dirnameForModule(import.meta),
  "../test-generated/",
);

const generatorPaths = {
  validator: (subTest) => pathJoin(baseTestDir, subTest, "validators.js"),
  router: (subTest) => pathJoin(baseTestDir, subTest, "router.js"),
  apiClient: (subTest) => pathJoin(baseTestDir, subTest, "apiClient.js"),
  mock: (subTest) => pathJoin(baseTestDir, subTest, "mocks.js"),
  reactQuery: (subTest) => pathJoin(baseTestDir, subTest, "reactQueries.js"),
  type: (subTest) => pathJoin(baseTestDir, subTest, "types.js"),
};

/**
 * Create app, generate amd load in generated code.
 * @param {string} testName
 * @param {function(app: App): GenerateOpts} callback
 * @returns {Promise<{}>}
 */
export async function generateAndLoad(testName, callback) {
  const app = await App.new({
    verbose: false,
  });
  const options = await callback(app);
  await app.generate({
    ...options,
    outputDirectory: pathJoin(baseTestDir, testName),
  });

  if (options.useTypescript) {
    app.logger.info("Transpiling typescript...");

    await spawn(
      "yarn",
      [
        "tsc",
        pathJoin(baseTestDir, testName) + "/*.ts",
        "--target",
        "ESNext",
        "--noErrorTruncation",
        "--moduleResolution",
        "node",
        "--esModuleInterop",
      ],
      {
        shell: true,
      },
    );
  }

  const obj = {};
  for (const gen of options.enabledGenerators) {
    obj[gen] = await import(generatorPaths[gen](testName));
  }

  return obj;
}
