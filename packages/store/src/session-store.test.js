import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { isNil, uuid } from "@compas/stdlib";
import { sql } from "../../../src/testing.js";
import { queries } from "./generated.js";
import { querySessionStore } from "./generated/database/sessionStore.js";
import { validateStoreSessionStoreSettings } from "./generated/store/validators.js";
import {
  sessionStoreCreate,
  sessionStoreCreateJWT,
  sessionStoreGet,
  sessionStoreInvalidate,
  sessionStoreUpdate,
  sessionStoreVerifyAndDecodeJWT,
} from "./session-store.js";

mainTestFn(import.meta);

test("store/session-store", (t) => {
  const sessionSettings = {
    accessTokenMaxAgeInSeconds: 5,
    refreshTokenMaxAgeInSeconds: 5,
    signingKey: uuid(),
  };

  const createSession = async () => {
    const tokenResult = await sessionStoreCreate(
      newTestEvent(t),
      sql,
      sessionSettings,
      {},
    );

    if (tokenResult.error) {
      throw tokenResult.error;
    }

    const accessTokenResult = await sessionStoreVerifyAndDecodeJWT(
      newTestEvent(t),
      sessionSettings,
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
      session,
      tokens: tokenResult.value,
    };
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

  t.test("sessionStoreGet", async (t) => {
    const sessionInfo = await createSession();

    t.test("invalidToken", async (t) => {
      const sessionGetResult = await sessionStoreGet(
        newTestEvent(t),
        sql,
        sessionSettings,
        sessionInfo.tokens.accessToken.substring(
          0,
          sessionInfo.tokens.accessToken.length - 2,
        ),
      );
      t.equal(
        sessionGetResult.error?.key,
        "sessionStore.verifyAndDecodeJWT.invalidToken",
      );
    });

    t.test("expiredToken", async (t) => {
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() - 20);

      const accessTokenString = await sessionStoreCreateJWT(
        newTestEvent(t),
        sessionSettings,
        "compasSessionAccessToken",
        sessionInfo.session.accessTokens[0].id,
        expiresAt,
      );
      if (accessTokenString.error) {
        throw accessTokenString.error;
      }

      const sessionGetResult = await sessionStoreGet(
        newTestEvent(t),
        sql,
        sessionSettings,
        accessTokenString.value,
      );

      t.equal(
        sessionGetResult.error?.key,
        "sessionStore.verifyAndDecodeJWT.expiredToken",
      );
    });

    t.test("invalidAccessToken", async (t) => {
      const sessionGetResult = await sessionStoreGet(
        newTestEvent(t),
        sql,
        sessionSettings,
        sessionInfo.tokens.refreshToken,
      );

      t.equal(
        sessionGetResult.error?.key,
        "sessionStore.get.invalidAccessToken",
      );
    });

    t.test("invalidSession", async (t) => {
      // Just create a new session for this specific subtest, since we don't want to recover the mutations.
      const customSessionInfo = await createSession();

      await queries.sessionStoreDelete(sql, {
        id: customSessionInfo.session.id,
      });

      const sessionGetResult = await sessionStoreGet(
        newTestEvent(t),
        sql,
        sessionSettings,
        customSessionInfo.tokens.accessToken,
      );

      t.equal(sessionGetResult.error?.key, "sessionStore.get.invalidSession");
    });

    t.test("revokedToken", async (t) => {
      // Just create a new session for this specific subtest, since we don't want to recover the mutations.
      const customSessionInfo = await createSession();

      await queries.sessionStoreTokenUpdate(
        sql,
        {
          revokedAt: new Date(),
        },
        {
          session: customSessionInfo.session.id,
        },
      );

      const sessionGetResult = await sessionStoreGet(
        newTestEvent(t),
        sql,
        sessionSettings,
        customSessionInfo.tokens.accessToken,
      );

      t.equal(sessionGetResult.error?.key, "sessionStore.get.revokedToken");
    });

    t.test("success", async (t) => {
      const sessionGetResult = await sessionStoreGet(
        newTestEvent(t),
        sql,
        sessionSettings,
        sessionInfo.tokens.accessToken,
      );

      t.ok(isNil(sessionGetResult.error));
      t.equal(sessionGetResult.value.session.id, sessionInfo.session.id);
    });
  });

  t.test("sessionStoreUpdate", async (t) => {
    const sessionInfo = await createSession();

    t.test("invalidSession - missing id", async (t) => {
      const sessionUpdateResult = await sessionStoreUpdate(
        newTestEvent(t),
        sql,
        {
          checksum: "foobar",
        },
      );

      t.equal(
        sessionUpdateResult.error?.key,
        "sessionStore.update.invalidSession",
      );
    });

    t.test("invalidSession - missing checksum", async (t) => {
      const sessionUpdateResult = await sessionStoreUpdate(
        newTestEvent(t),
        sql,
        {
          id: uuid(),
        },
      );

      t.equal(
        sessionUpdateResult.error?.key,
        "sessionStore.update.invalidSession",
      );
    });

    t.test("success - no update via checksum check", async (t) => {
      const sessionUpdateResult = await sessionStoreUpdate(
        newTestEvent(t),
        sql,
        {
          id: sessionInfo.session.id,
          data: sessionInfo.session.data,
          checksum: sessionInfo.session.checksum,
        },
      );

      t.ok(isNil(sessionUpdateResult.error));

      const [refetchedSession] = await querySessionStore({
        where: {
          id: sessionInfo.session.id,
        },
      }).exec(sql);

      t.deepEqual(sessionInfo.session.updatedAt, refetchedSession.updatedAt);
    });

    t.test("success", async (t) => {
      const sessionUpdateResult = await sessionStoreUpdate(
        newTestEvent(t),
        sql,
        {
          id: sessionInfo.session.id,
          data: {
            foo: {},
          },
          checksum: sessionInfo.session.checksum,
        },
      );

      t.ok(isNil(sessionUpdateResult.error));

      const [refetchedSession] = await querySessionStore({
        where: {
          id: sessionInfo.session.id,
        },
      }).exec(sql);

      t.ok(refetchedSession.data.foo);
    });
  });

  t.test("sessionStoreInvalidate", async (t) => {
    const sessionInfo = await createSession();

    t.test("invalidSession", async (t) => {
      const sessionInvalidateResult = await sessionStoreInvalidate(
        newTestEvent(t),
        sql,
        {},
      );

      t.equal(
        sessionInvalidateResult.error?.key,
        "sessionStore.invalidate.invalidSession",
      );
    });

    t.test("success", async (t) => {
      const sessionUpdateResult = await sessionStoreInvalidate(
        newTestEvent(t),
        sql,
        {
          id: sessionInfo.session.id,
        },
      );

      t.ok(isNil(sessionUpdateResult.error));

      const [refetchedSession] = await querySessionStore({
        where: {
          id: sessionInfo.session.id,
        },
        accessTokens: {},
      }).exec(sql);

      t.ok(refetchedSession.revokedAt);
      for (const token of refetchedSession.accessTokens) {
        t.ok(token.revokedAt);
      }
    });
  });
});
