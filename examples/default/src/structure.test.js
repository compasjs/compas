import { mainTestFn, test } from "@compas/cli";
import { closeTestApp, createTestAppAndClient } from "@compas/server";
import axios from "axios";
import { axiosInterceptErrorAndWrapWithAppError } from "./generated/application/common/api-client.js";
import { apiCompasStructure } from "./generated/application/compas/apiClient.js";
import { app } from "./services/core.js";

mainTestFn(import.meta);

test("structure/controller", async (t) => {
  // Run the Koa instance on a random port and create an Axios instance that uses that as
  // the baseUrl.
  const axiosInstance = axios.create();
  await createTestAppAndClient(app, axiosInstance);
  axiosInterceptErrorAndWrapWithAppError(axiosInstance);

  t.test("compas structure", async (t) => {
    const results = await Promise.all([
      apiCompasStructure(axiosInstance, {}),
      apiCompasStructure(axiosInstance, { format: "compas" }),
    ]);

    t.deepEqual(results[0], results[1]);
  });

  t.test("openapi structure", async (t) => {
    const results = await Promise.all([
      apiCompasStructure(axiosInstance, {}),
      apiCompasStructure(axiosInstance, { format: "openapi" }),
    ]);

    t.notEqual(JSON.stringify(results[0]), JSON.stringify(results[1]));
  });

  t.test("teardown", async (t) => {
    // Since subtests run in the order they are registered, we can always do some
    // teardown in the last subtest.

    await closeTestApp(app);

    t.pass();
  });
});
