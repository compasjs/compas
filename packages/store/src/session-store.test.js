import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { isNil, uuid } from "@compas/stdlib";
import { sql } from "../../../src/testing.js";
import { querySessionStore } from "./generated/database/sessionStore.js";
import { validateStoreSessionStoreSettings } from "./generated/store/validators.js";
import {
  sessionStoreCreate,
  sessionStoreVerifyAndDecodeJWT,
} from "./session-store.js";

mainTestFn(import.meta);

test("store/session-store", async (t) => {
  const sessionSettings = {
    accessTokenMaxAgeInSeconds: 5,
    refreshTokenMaxAgeInSeconds: 5,
    signingKey: uuid(),
  };

  t.test("validateStoreSessionStoreSettings", (t) => {
    t.test("signingKey length", (t) => {
      const result = validateStoreSessionStoreSettings({
        accessTokenMaxAgeInSeconds: 5,
        refreshTokenMaxAgeInSeconds: 5,
        signingKey: "foo",
      });

      t.ok(result.error);
      t.equal(result.error.info["$.signingKey"].key, "validator.string.min");
    });
  });

  t.test("sessionStoreCreate", (t) => {
    // No error case, or some unexpected issue with jws, which we can't really test

    t.test("success", async (t) => {
      const data = {
        foo: uuid(),
      };

      const result = await sessionStoreCreate(
        newTestEvent(t),
        sql,
        sessionSettings,
        data,
      );

      t.ok(isNil(result.error));
      t.ok(result.value?.accessToken);
      t.ok(result.value?.refreshToken);

      const accessTokenPayload = await sessionStoreVerifyAndDecodeJWT(
        newTestEvent(t),
        sessionSettings,
        result.value.accessToken,
      );
      t.ok(isNil(accessTokenPayload.error));

      const [session] = await querySessionStore({
        viaAccessTokens: {
          where: {
            id: accessTokenPayload.value.payload.compasSessionAccessToken,
          },
        },
        accessTokens: {
          refreshToken: {},
        },
      }).exec(sql);

      t.equal(session.accessTokens.length, 2);
      t.equal(session.data.foo, data.foo);
    });
  });
});
