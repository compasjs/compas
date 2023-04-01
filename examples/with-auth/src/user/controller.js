import { newEventFromEvent } from "@compas/stdlib";
import {
  sessionStoreInvalidate,
  sessionTransportLoadFromContext,
} from "@compas/store";
import { sessionTransportSettings } from "../constants.js";
import { userHandlers } from "../generated/application/user/controller.js";
import { sql } from "../services/core.js";
import {
  userLogin,
  userRefreshTokens,
  userRegister,
  userResolveSession,
} from "./events.js";

userHandlers.register = async (ctx) => {
  await sql.begin((sql) =>
    userRegister(newEventFromEvent(ctx.event), sql, ctx.validatedBody),
  );

  ctx.body = {
    success: true,
  };
};

userHandlers.login = async (ctx) => {
  ctx.body = await userLogin(
    newEventFromEvent(ctx.event),
    sql,
    ctx.validatedBody,
  );
};

userHandlers.refreshTokens = async (ctx) => {
  ctx.body = await userRefreshTokens(
    newEventFromEvent(ctx.event),
    ctx.validatedBody,
  );
};

userHandlers.logout = async (ctx) => {
  const { value } = await sessionTransportLoadFromContext(
    newEventFromEvent(ctx.event),
    sql,
    ctx,
    sessionTransportSettings,
  );

  if (value) {
    // We only need to invalide the session if it was valid in the first place. Else it
    // will expire automatically.
    await sessionStoreInvalidate(
      newEventFromEvent(ctx.event),
      sql,
      value.session,
    );
  }

  ctx.body = {
    success: true,
  };
};

userHandlers.me = async (ctx) => {
  const user = await userResolveSession(newEventFromEvent(ctx.event), ctx);

  ctx.body = {
    email: user.email,
    createdAt: user.createdAt,
  };
};
