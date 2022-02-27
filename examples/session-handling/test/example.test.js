import { mainTestFn, test } from "@compas/cli";
import { closeTestApp, createTestAppAndClient } from "@compas/server";
import { AppError, environment } from "@compas/stdlib";
import axios from "axios";
import { sql } from "../../../src/testing.js";
import { buildServer } from "../src/app.js";
import {
  apiAuthLogin,
  apiAuthLogout,
  apiAuthMe,
  apiAuthRefreshTokens,
} from "../src/generated/auth/apiClient.js";

mainTestFn(import.meta);

test("examples/session-handling", async (t) => {
  // Some hacks so, newPostgresConnections resolve to the test database that we have in
  // Compas tests
  const originalPostgresDatabase = environment.POSTGRES_DATABASE;
  environment.POSTGRES_DATABASE = sql?.options?.database;
  const app = await buildServer();
  const axiosInstance = axios.create();

  await createTestAppAndClient(app, axiosInstance);

  // Catch session tokens and apply them on the client
  axiosInstance.interceptors.response.use((response) => {
    if (response?.data?.accessToken && response.data?.refreshToken) {
      axiosInstance.defaults.headers.authorization = `Bearer ${response.data.accessToken}`;
    }

    return response;
  });

  t.test("flow", async (t) => {
    const { refreshToken } = await apiAuthLogin(axiosInstance);
    await apiAuthMe(axiosInstance);
    await apiAuthRefreshTokens(axiosInstance, { refreshToken });
    await apiAuthMe(axiosInstance);
    await apiAuthLogout(axiosInstance);

    try {
      await apiAuthMe(axiosInstance);
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.status, 400);
    }
  });

  t.test("teardown", async (t) => {
    environment.POSTGRES_DATABASE = originalPostgresDatabase;
    await closeTestApp(app);

    t.pass();
  });
});
