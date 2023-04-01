import { mainTestFn, test } from "@compas/cli";
import { closeTestApp, createTestAppAndClient } from "@compas/server";
import { uuid } from "@compas/stdlib";
import axios from "axios";
import { axiosInterceptErrorAndWrapWithAppError } from "../generated/application/common/api-client.js";
import { queryUser } from "../generated/application/database/user.js";
import {
  apiUserLogin,
  apiUserLogout,
  apiUserMe,
  apiUserRefreshTokens,
  apiUserRegister,
} from "../generated/application/user/apiClient.js";
import { app, sql } from "../services/core.js";

mainTestFn(import.meta);

test("user/controller", async (t) => {
  // Run the Koa instance on a random port and create an Axios instance that uses that as
  // the baseUrl.
  const axiosInstance = axios.create();
  await createTestAppAndClient(app, axiosInstance);
  axiosInterceptErrorAndWrapWithAppError(axiosInstance);

  t.test("apiUserRegister", (t) => {
    t.test("success", async (t) => {
      const email = `${uuid()}@example.com`;
      const password = uuid();

      await apiUserRegister(axiosInstance, {
        email,
        password,
      });

      const [user] = await queryUser({
        where: {
          email,
        },
      }).exec(sql);

      t.equal(user.email, email);
      t.notEqual(user.password, password, "Password should be hashed");
    });

    t.test("user.register.emailAlreadyInUse", async (t) => {
      const email = `${uuid()}@example.com`;
      const password = uuid();

      await apiUserRegister(axiosInstance, {
        email,
        password,
      });

      try {
        await apiUserRegister(axiosInstance, {
          email,
          password,
        });
      } catch (e) {
        t.equal(e.key, "user.register.emailAlreadyInUse");
      }
    });
  });

  t.test("apiUserLogin", async (t) => {
    const email = `${uuid()}@example.com`;
    const password = uuid();

    await apiUserRegister(axiosInstance, {
      email,
      password,
    });

    t.test("user.login.invalidCombination - email", async (t) => {
      try {
        await apiUserLogin(axiosInstance, {
          email: `${uuid()}@example.com`,
          password,
        });
      } catch (e) {
        t.equal(e.key, "user.login.invalidCombination");
      }
    });

    t.test("user.login.invalidCombination - password", async (t) => {
      try {
        await apiUserLogin(axiosInstance, {
          email,
          password: uuid(),
        });
      } catch (e) {
        t.equal(e.key, "user.login.invalidCombination");
      }
    });

    t.test("success", async (t) => {
      const response = await apiUserLogin(axiosInstance, {
        email,
        password,
      });

      t.ok(response.accessToken);
    });
  });

  t.test("apiUserRefreshTokens", async (t) => {
    const email = `${uuid()}@example.com`;
    const password = uuid();

    await apiUserRegister(axiosInstance, {
      email,
      password,
    });

    const loginTokens = await apiUserLogin(axiosInstance, {
      email,
      password,
    });

    t.test("success", async (t) => {
      const response = await apiUserRefreshTokens(axiosInstance, {
        refreshToken: loginTokens.refreshToken,
      });

      t.ok(response.accessToken);
      t.notEqual(response.accessToken, loginTokens.accessToken);
    });
  });

  t.test("apiUserLogout", async (t) => {
    const email = `${uuid()}@example.com`;
    const password = uuid();

    await apiUserRegister(axiosInstance, {
      email,
      password,
    });

    const loginTokens = await apiUserLogin(axiosInstance, {
      email,
      password,
    });

    t.test("logged in", async (t) => {
      await apiUserLogout(axiosInstance, {
        headers: {
          Authorization: `Bearer ${loginTokens.accessToken}`,
        },
      });

      t.pass();
    });

    t.test("without session", async (t) => {
      await apiUserLogout(axiosInstance);

      t.pass();
    });
  });

  t.test("apiUserMe", async (t) => {
    // At some point you may want to add an abstraction for creating test users and how
    // they login, so you don't have to add the accessToken to each api call.

    const email = `${uuid()}@example.com`;
    const password = uuid();

    await apiUserRegister(axiosInstance, {
      email,
      password,
    });

    const loginTokens = await apiUserLogin(axiosInstance, {
      email,
      password,
    });

    const response = await apiUserMe(axiosInstance, {
      headers: {
        Authorization: `Bearer ${loginTokens.accessToken}`,
      },
    });

    t.equal(response.email, email);
  });

  t.test("teardown", async (t) => {
    // Since subtests run in the order they are registered, we can always do some
    // teardown in the last subtest.

    await closeTestApp(app);

    t.pass();
  });
});
