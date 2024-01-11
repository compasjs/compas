import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { closeTestApp, createTestAppAndClient, getApp } from "@compas/server";
import {
  AppError,
  isPlainObject,
  newEventFromEvent,
  uuid,
} from "@compas/stdlib";
import axios from "axios";
import { sql } from "../../../src/testing.js";
import { querySessionStore } from "./generated/database/sessionStore.js";
import {
  sessionStoreCreate,
  sessionStoreVerifyAndDecodeJWT,
} from "./session-store.js";
import {
  sessionTransportLoadFromContext,
  validateSessionTransportSettings,
} from "./session-transport.js";

mainTestFn(import.meta);

test("store/session-transport", (t) => {
  const sessionStoreSettings = {
    accessTokenMaxAgeInSeconds: 5,
    refreshTokenMaxAgeInSeconds: 10,
    signingKey: uuid(),
  };

  /**
   *
   * @param {import("koa").Middleware} middleware
   * @returns {Promise<{axiosInstance: AxiosInstance, session:
   *   import("./generated/common/types.d.ts").QueryResultStoreSessionStore, tokens:
   *   {accessToken: string, refreshToken: string}, closeApp: (function():
   *   Promise<void>)}>}
   */
  const createAppWithSession = async (middleware) => {
    const app = getApp();
    app.use(middleware);

    const axiosInstance = axios.create();
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
      sessionStoreSettings.signingKey,
      tokenResult.value.accessToken,
    );

    if (accessTokenResult.error) {
      throw accessTokenResult.error;
    }

    const [session] = await querySessionStore({
      where: {
        viaAccessTokens: {
          where: {
            id: accessTokenResult.value.payload.compasSessionAccessToken,
          },
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

      t.equal(options.sessionStoreSettings, sessionStoreSettings);

      t.ok(isPlainObject(options.headerOptions));
    });

    t.test("single transport required", (t) => {
      try {
        validateSessionTransportSettings({
          sessionStoreSettings,
          enableHeaderTransport: false,
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
  });
});
