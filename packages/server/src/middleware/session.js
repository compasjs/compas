import { isNil, merge } from "@lbu/stdlib";
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    },
    opts,
  );

  return koaSession(options, app);
}

/**
 *
 */
function getKeys() {
  if (process.env.NODE_ENV !== "production") {
    return [process.env.APP_NAME];
  }

  if (isNil(process.env.APP_KEYS) || process.env.APP_KEYS.length < 20) {
    throw new Error("Missing APP_KEYS in environment or generate a longer key");
  }

  const keys = process.env.APP_KEYS.split(",");
  return new KeyGrip(keys, "sha256");
}
