import { isNil, isProduction, merge, uuid } from "@lbu/stdlib";
import KeyGrip from "keygrip";
import koaSession from "koa-session";

/**
 * Session middleware
 * Requires process.env.APP_KEYS
 * To generate a key use something like
 * node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 *
 * @param {Application} app
 * @param {object} opts KoaSession options
 */
export function session(app, opts) {
  app.keys = getKeys();

  const options = merge(
    {},
    {
      key: `${process.env.APP_NAME.toLowerCase()}.sess`,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      renew: true,
      secure: isProduction(),
      sameSite: "Strict",
      overwrite: true,
      httpOnly: true,
      signed: true,
      autoCommit: true,
      genid: uuid,
    },
    opts,
  );

  if (opts?.supportOptionOverwrites) {
    options.externalKey = getSessionExternalKey(options);
  }

  return koaSession(options, app);
}

/**
 *
 */
function getKeys() {
  if (isProduction()) {
    return [process.env.APP_NAME];
  }

  if (isNil(process.env.APP_KEYS) || process.env.APP_KEYS.length < 20) {
    throw new Error("Missing APP_KEYS in environment or generate a longer key");
  }

  const keys = process.env.APP_KEYS.split(",");
  return new KeyGrip(keys, "sha256");
}

/**
 * Custom cookies getter and setter
 * Allows setting _domain or _secure for specific domain support
 * @param options
 */
function getSessionExternalKey(options) {
  return {
    get: (ctx) => {
      return ctx.cookies.get(options.key, options);
    },
    set: (ctx, value) => {
      return ctx.cookies.set(options.key, value, {
        ...options,
        ...(isNil(ctx.session._domain) ? {} : { domain: ctx.session._domain }),
        ...(isNil(ctx.session._secure) ? {} : { secure: ctx.session._secure }),
      });
    },
  };
}
