import { environment, isNil, isProduction, merge, uuid } from "@compas/stdlib";
import KeyGrip from "keygrip";
import koaSession from "koa-session";

/**
 * @typedef {import("koa").Middleware} Middleware
 */

/**
 * Session middleware. Requires process.env.APP_KEYS to be set. To generate a key use
 * something like:
 * `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
 * This also accepts the session store as provided by `@compas/store`.
 *
 * @since 0.1.0
 *
 * @param {import("../app").KoaApplication} app
 * @param {Partial<koaSession.opts>} opts KoaSession options
 * @returns {Middleware}
 */
export function session(app, opts) {
  app.keys = getKeys();

  const options = merge(
    {},
    {
      key: `${environment.APP_NAME.toLowerCase()}.sess`,
      maxAge: 6 * 24 * 60 * 60 * 1000,
      renew: true,
      secure: isProduction(),
      domain: !isProduction() ? undefined : environment.COOKIE_URL,
      sameSite: "lax",
      overwrite: true,
      httpOnly: true,
      signed: true,
      autoCommit: true,
      genid: uuid,
    },
    opts,
  );

  if (options.keepPublicCookie && options.store) {
    wrapStoreCalls({ ...options });
  }

  return koaSession(options, app);
}

/**
 * Get a Keygrip instance for production or plain keys in development
 */
function getKeys() {
  if (!isProduction()) {
    return [environment.APP_NAME];
  }

  if (isNil(environment.APP_KEYS) || environment.APP_KEYS.length < 20) {
    throw new Error("Missing APP_KEYS in environment or generate a longer key");
  }

  const keys = environment.APP_KEYS.split(",");
  return new KeyGrip(keys, "sha256");
}

/**
 * Wraps the save and remove calls of koa-session ContextSession.
 * This allows us to set extra cookies that are JS readable but don't contain any
 * sensitive information.
 *
 * @param {{
 *   store: SessionStore,
 *   key: string,
 * } & Partial<koaSession.opts>} opts
 */
function wrapStoreCalls({ store, key, ...cookieOpts }) {
  cookieOpts.httpOnly = false;
  cookieOpts.signed = false;
  key += ".public";

  const destroyOpts = { ...cookieOpts, maxAge: false, expires: new Date(0) };
  const value = "truthy";

  const originalSet = store.set;
  const originalDestroy = store.destroy;

  store.set = (...args) => {
    if (!args[3]?.ctx) {
      // @ts-ignore
      return originalSet(...args);
    }

    const ctx = args[3].ctx;
    ctx.cookies.set(key, value, cookieOpts);

    // @ts-ignore
    return originalSet(...args);
  };

  store.destroy = (...args) => {
    if (!args[1]?.ctx) {
      // @ts-ignore
      return originalDestroy(...args);
    }

    const ctx = args[1].ctx;
    ctx.cookies.set(key, "", destroyOpts);

    // @ts-ignore
    return originalDestroy(...args);
  };
}
