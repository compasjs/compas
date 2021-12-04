import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { closeTestApp, createTestAppAndClient, getApp } from "@compas/server";
import {
  AppError,
  isPlainObject,
  newEventFromEvent,
  uuid,
} from "@compas/stdlib";
import Axios from "axios";
import { sql } from "../../../src/testing.js";
import { querySessionStore } from "./generated/database/sessionStore.js";
import {
  sessionStoreCreate,
  sessionStoreVerifyAndDecodeJWT,
} from "./session-store.js";
import {
  sessionTransportAddAsCookiesToContext,
  sessionTransportLoadFromContext,
  validateSessionTransportSettings,
} from "./session-transport.js";

mainTestFn(import.meta);

test("store/session-store", (t) => {
  const sessionStoreSettings = {
    accessTokenMaxAgeInSeconds: 5,
    refreshTokenMaxAgeInSeconds: 10,
    signingKey: uuid(),
  };

  /**
   *
   * @param {import("koa").Middleware} middleware
   * @returns {Promise<{axiosInstance: AxiosInstance, session:
   *   QueryResultStoreSessionStore, tokens: {accessToken: string, refreshToken: string},
   *   closeApp: (function(): Promise<void>)}>}
   */
  const createAppWithSession = async (middleware) => {
    const app = getApp();
    app.use(middleware);

    const axiosInstance = Axios.create();
    await createTestAppAndClient(app, axiosInstance);

    const tokenResult = await sessionStoreCreate(
      newTestEvent(t),
      sql,
      sessionStoreSettings,
      {},
    );

    if (tokenResult.error) {
      throw tokenResult.error;
    }

    const accessTokenResult = await sessionStoreVerifyAndDecodeJWT(
      newTestEvent(t),
      sessionStoreSettings,
      tokenResult.value.accessToken,
    );

    if (accessTokenResult.error) {
      throw accessTokenResult.error;
    }

    const [session] = await querySessionStore({
      viaAccessTokens: {
        where: {
          id: accessTokenResult.value.payload.compasSessionAccessToken,
        },
      },
      accessTokens: {
        where: {
          refreshTokenIsNotNull: true,
        },
        refreshToken: {},
      },
    }).exec(sql);

    return {
      closeApp: () => closeTestApp(app),
      axiosInstance,
      session,
      tokens: tokenResult.value,
    };
  };

  t.test("validateSessionTransportSettings", (t) => {
    t.test("defaults", (t) => {
      const options = validateSessionTransportSettings({
        sessionStoreSettings,
      });

      t.equal(options.enableHeaderTransport, true);
      t.equal(options.enableCookieTransport, true);
      t.equal(options.autoRefreshCookies, true);

      t.equal(options.sessionStoreSettings, sessionStoreSettings);

      t.ok(isPlainObject(options.headerOptions));
      t.ok(isPlainObject(options.cookieOptions));

      t.equal(options.cookieOptions.cookiePrefix, "compas.");
      t.equal(options.cookieOptions.sameSite, "lax");
      t.equal(options.cookieOptions.secure, false);

      t.ok(options.cookieOptions.cookies.find((it) => it.domain === "own"));
      t.ok(options.cookieOptions.cookies.find((it) => it.domain === "origin"));
    });

    t.test("cookieOptions as default for cookies", (t) => {
      const options = validateSessionTransportSettings({
        sessionStoreSettings,
        cookieOptions: {
          secure: true,
          sameSite: "strict",
          cookies: [
            {
              domain: "own",
              sameSite: "lax",
            },
            {
              domain: "origin",
              secure: false,
            },
          ],
        },
      });

      t.equal(options.cookieOptions.cookies[0].sameSite, "lax");
      t.equal(options.cookieOptions.cookies[0].secure, true);

      t.equal(options.cookieOptions.cookies[1].sameSite, "strict");
      t.equal(options.cookieOptions.cookies[1].secure, false);
    });

    t.test("single transport required", (t) => {
      try {
        validateSessionTransportSettings({
          sessionStoreSettings,
          enableHeaderTransport: false,
          enableCookieTransport: false,
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
      }
    });

    t.test("single cookieOptions.cookies required if override", (t) => {
      try {
        validateSessionTransportSettings({
          sessionStoreSettings,
          cookieOptions: {
            cookies: [],
          },
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
      }
    });

    t.test("cookiePrefix is ignored if empty", (t) => {
      const options = validateSessionTransportSettings({
        sessionStoreSettings,
        cookieOptions: {
          cookiePrefix: "",
        },
      });

      t.equal(options.cookieOptions.cookiePrefix, "");
    });

    t.test("cookiePrefix is suffixed with a dot", (t) => {
      const options1 = validateSessionTransportSettings({
        sessionStoreSettings,
        cookieOptions: {
          cookiePrefix: "foo",
        },
      });

      t.equal(options1.cookieOptions.cookiePrefix, "foo.");

      const options2 = validateSessionTransportSettings({
        sessionStoreSettings,
        cookieOptions: {
          cookiePrefix: "foo.",
        },
      });

      t.equal(options2.cookieOptions.cookiePrefix, "foo.");
    });

    t.test("domain is required in cookies array", (t) => {
      try {
        validateSessionTransportSettings({
          sessionStoreSettings,
          cookieOptions: {
            cookies: [{}],
          },
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
      }
    });
  });

  t.test("sessionTransportLoadFromContext", (t) => {
    t.test("headerTransport", async (t) => {
      const { closeApp, axiosInstance, session, tokens } =
        await createAppWithSession(async (ctx, next) => {
          const { error, value } = await sessionTransportLoadFromContext(
            newEventFromEvent(ctx.event),
            sql,
            ctx,
            {
              sessionStoreSettings,
            },
          );

          ctx.body = {
            error: AppError.format(error),
            value,
          };

          return next();
        });

      t.test("invalid header", async (t) => {
        const response = await axiosInstance.request({
          method: "GET",
          url: "/",
          headers: {
            Authorization: "Bearer",
          },
        });

        t.equal(
          response.data.error.key,
          `sessionStore.verifyAndDecodeJWT.missingToken`,
        );
      });

      t.test("valid header", async (t) => {
        const response = await axiosInstance.request({
          method: "GET",
          url: "/",
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });

        t.equal(response.data.value.session.id, session.id);
      });

      t.test("teardown", async (t) => {
        await closeApp();

        t.pass();
      });
    });

    t.test("cookieTransport", async (t) => {
      const { closeApp, axiosInstance, session, tokens } =
        await createAppWithSession(async (ctx, next) => {
          const { error, value } = await sessionTransportLoadFromContext(
            newEventFromEvent(ctx.event),
            sql,
            ctx,
            {
              sessionStoreSettings,
              enableHeaderTransport: false,
            },
          );

          ctx.body = {
            error: AppError.format(error),
            value,
          };

          return next();
        });

      t.test("invalid cookie", async (t) => {
        const response = await axiosInstance.request({
          method: "GET",
          url: "/",
          headers: {
            Cookie: `accessToken=${tokens.accessToken}`,
          },
        });

        t.equal(
          response.data.error.key,
          `sessionStore.verifyAndDecodeJWT.missingToken`,
        );
      });

      t.test("invalid refresh cookie", async (t) => {
        const response = await axiosInstance.request({
          method: "GET",
          url: "/",
          headers: {
            Cookie: `refreshToken=${tokens.accessToken}`,
          },
        });

        t.equal(
          response.data.error.key,
          `sessionStore.verifyAndDecodeJWT.missingToken`,
        );
      });

      t.test("valid access token", async (t) => {
        const response = await axiosInstance.request({
          method: "GET",
          url: "/",
          headers: {
            Cookie: `compas.accessToken=${tokens.accessToken}`,
          },
        });

        t.equal(response.data.value.session.id, session.id);
      });

      t.test("valid refresh token", async (t) => {
        const response = await axiosInstance.request({
          method: "GET",
          url: "/",
          headers: {
            Cookie: `compas.refreshToken=${tokens.refreshToken}`,
          },
        });

        t.equal(response.data.value.session.id, session.id);

        const setCookies = response.headers["set-cookie"];

        t.equal(setCookies.length, 3);
        const [accessToken, refreshToken, publicCookie] = setCookies;

        t.ok(accessToken.includes("httponly"));
        t.ok(accessToken.includes("compas.accessToken=ey"));

        t.ok(refreshToken.includes("httponly"));
        t.ok(refreshToken.includes("compas.refreshToken=ey"));

        t.ok(!publicCookie.includes("httponly"));
        t.ok(publicCookie.includes("compas.public=truthy"));
      });

      t.test("teardown", async (t) => {
        await closeApp();

        t.pass();
      });
    });
  });

  t.test("sessionTransportAddAsCookiesToContext", async (t) => {
    const { closeApp, axiosInstance } = await createAppWithSession(
      async (ctx, next) => {
        await sessionTransportAddAsCookiesToContext(
          newEventFromEvent(ctx.event),
          ctx,
          undefined,
          {
            sessionStoreSettings,
          },
        );

        ctx.body = {};

        return next();
      },
    );

    t.test("set empty cookies", async (t) => {
      const response = await axiosInstance.request({
        method: "GET",
        url: "/",
      });

      const setCookies = response.headers["set-cookie"];

      t.equal(setCookies.length, 3);

      const [accessToken, refreshToken, publicCookie] = setCookies;

      t.ok(accessToken.includes("httponly"));
      t.ok(accessToken.includes("compas.accessToken=;"));

      t.ok(refreshToken.includes("httponly"));
      t.ok(refreshToken.includes("compas.refreshToken=;"));

      t.ok(!publicCookie.includes("httponly"));
      t.ok(publicCookie.includes("compas.public=;"));
    });

    t.test("teardown", async (t) => {
      await closeApp();

      t.pass();
    });
  });
});
