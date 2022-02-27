import { createBodyParsers, getApp } from "@compas/server";
import { newEventFromEvent, uuid } from "@compas/stdlib";
import {
  newPostgresConnection,
  sessionStoreCreate,
  sessionStoreInvalidate,
  sessionStoreRefreshTokens,
  sessionTransportLoadFromContext,
} from "@compas/store";
import { authHandlers } from "./generated/auth/controller.js";
import { router, setBodyParsers } from "./generated/common/router.js";

export async function buildServer() {
  const sql = await newPostgresConnection({});
  const app = getApp({});

  /** @type {import("@compas/store").SessionTransportSettings} */
  const sessionTransportSettings = {
    enableCookieTransport: false,
    enableHeaderTransport: true,
    headerOptions: {},
    sessionStoreSettings: {
      accessTokenMaxAgeInSeconds: 60,
      refreshTokenMaxAgeInSeconds: 15 * 60,

      // Note that this should be a securely generated and stored string. And when it
      // changes, all existing sessions will be invalid.
      signingKey: uuid(),
    },
  };

  setBodyParsers(createBodyParsers({}, {}));
  app.use(router);

  authHandlers.me = async (ctx, next) => {
    const { value, error } = await sessionTransportLoadFromContext(
      newEventFromEvent(ctx.event),
      sql,
      ctx,
      sessionTransportSettings,
    );

    if (error) {
      throw error;
    }

    ctx.body = {
      session: {
        id: value.session.id,
        createdAt: value.session.createdAt,
      },
    };

    return next();
  };

  authHandlers.login = async (ctx, next) => {
    const { value, error } = await sessionStoreCreate(
      newEventFromEvent(ctx.event),
      sql,
      sessionTransportSettings.sessionStoreSettings,
      {},
    );

    if (error) {
      throw error;
    }

    ctx.body = value;

    return next();
  };

  authHandlers.refreshTokens = async (ctx, next) => {
    const { value, error } = await sessionStoreRefreshTokens(
      newEventFromEvent(ctx.event),
      sql,
      sessionTransportSettings.sessionStoreSettings,
      ctx.validatedBody.refreshToken,
    );

    if (error) {
      throw error;
    }

    ctx.body = value;

    return next();
  };

  authHandlers.logout = async (ctx, next) => {
    const { value, error } = await sessionTransportLoadFromContext(
      newEventFromEvent(ctx.event),
      sql,
      ctx,
      sessionTransportSettings,
    );

    if (error) {
      throw error;
    }

    const { error: invalidateError } = await sessionStoreInvalidate(
      newEventFromEvent(ctx.event),
      sql,
      value.session,
    );

    if (invalidateError) {
      throw invalidateError;
    }

    ctx.body = {
      success: true,
    };

    return next();
  };

  return app;
}
