import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { isNil, uuid } from "@compas/stdlib";
import { sql } from "../../../src/testing.js";
import { queryJob } from "./generated/database/job.js";
import { querySessionStore } from "./generated/database/sessionStore.js";
import { querySessionStoreToken } from "./generated/database/sessionStoreToken.js";
import { queries } from "./generated.js";
import {
  SESSION_STORE_POTENTIAL_LEAKED_SESSION_JOB_NAME,
  sessionStoreCleanupExpiredSessions,
  sessionStoreCreate,
  sessionStoreCreateJWT,
  sessionStoreGet,
  sessionStoreInvalidate,
  sessionStoreRefreshTokens,
  sessionStoreUpdate,
  sessionStoreVerifyAndDecodeJWT,
} from "./session-store.js";

mainTestFn(import.meta);

test("store/session-store", (t) => {
  const sessionSettings = {
    accessTokenMaxAgeInSeconds: 5,
    refreshTokenMaxAgeInSeconds: 10,
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
      sessionSettings.signingKey,
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
      session,
      tokens: tokenResult.value,
    };
  };

  t.test("sessionStoreCreate", (t) => {
    // No error case, or some unexpected issue with jws, which we can't really test

    t.test("validator", async (t) => {
      const result = await sessionStoreCreate(
        newTestEvent(t),
        sql,
        {
          accessTokenMaxAgeInSeconds: 5,
          signingKey: uuid(),
        },
        {},
      );

      t.ok(result.error);
      t.equal(
        result.error.info["$.sessionStoreSettings.refreshTokenMaxAgeInSeconds"]
          ?.key,
        "validator.number.type",
      );
    });

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
        sessionSettings.signingKey,
        result.value.accessToken,
      );
      t.ok(isNil(accessTokenPayload.error));

      const [session] = await querySessionStore({
        where: {
          viaAccessTokens: {
            where: {
              id: accessTokenPayload.value.payload.compasSessionAccessToken,
            },
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

    t.test("validator", async (t) => {
      const result = await sessionStoreGet(
        newTestEvent(t),
        sql,
        {
          refreshTokenMaxAgeInSeconds: 5,
          signingKey: uuid(),
        },
        "",
      );

      t.ok(result.error);
      t.equal(
        result.error.info["$.sessionStoreSettings.accessTokenMaxAgeInSeconds"]
          ?.key,
        "validator.number.type",
      );
    });

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
      // Just create a new session for this specific subtest, since we don't want to
      // recover the mutations.
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
      // Just create a new session for this specific subtest, since we don't want to
      // recover the mutations.
      const customSessionInfo = await createSession();

      await queries.sessionStoreTokenUpdate(sql, {
        update: {
          revokedAt: new Date(),
        },
        where: {
          session: customSessionInfo.session.id,
        },
      });

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

  t.test("sessionStoreRefreshToken", async (t) => {
    const sessionInfo = await createSession();

    t.test("validator", async (t) => {
      const result = await sessionStoreGet(
        newTestEvent(t),
        sql,
        {
          accessTokenMaxAgeInSeconds: 5,
          refreshTokenMaxAgeInSeconds: 5,
        },
        "",
      );

      t.ok(result.error);
      t.equal(
        result.error.info["$.sessionStoreSettings.signingKey"]?.key,
        "validator.string.type",
      );
    });

    t.test("validator - signingKey.min", async (t) => {
      const result = await sessionStoreGet(
        newTestEvent(t),
        sql,
        {
          accessTokenMaxAgeInSeconds: 5,
          refreshTokenMaxAgeInSeconds: 5,
          signingKey: "foo bar",
        },
        "",
      );

      t.ok(result.error);
      t.equal(
        result.error.info["$.sessionStoreSettings.signingKey"]?.key,
        "validator.string.min",
      );
    });

    t.test("invalidToken", async (t) => {
      const sessionRefreshResult = await sessionStoreRefreshTokens(
        newTestEvent(t),
        sql,
        sessionSettings,
        sessionInfo.tokens.refreshToken.substring(
          0,
          sessionInfo.tokens.refreshToken.length - 2,
        ),
      );
      t.equal(
        sessionRefreshResult.error?.key,
        "sessionStore.verifyAndDecodeJWT.invalidToken",
      );
    });

    t.test("expiredToken", async (t) => {
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() - 20);

      const refreshTokenString = await sessionStoreCreateJWT(
        newTestEvent(t),
        sessionSettings,
        "compasSessionRefreshToken",
        sessionInfo.session.accessTokens[0].id,
        expiresAt,
      );
      if (refreshTokenString.error) {
        throw refreshTokenString.error;
      }

      const sessionRefreshResult = await sessionStoreRefreshTokens(
        newTestEvent(t),
        sql,
        sessionSettings,
        refreshTokenString.value,
      );

      t.equal(
        sessionRefreshResult.error?.key,
        "sessionStore.verifyAndDecodeJWT.expiredToken",
      );
    });

    t.test("invalidRefreshToken", async (t) => {
      const sessionRefreshResult = await sessionStoreRefreshTokens(
        newTestEvent(t),
        sql,
        sessionSettings,
        sessionInfo.tokens.accessToken,
      );

      t.equal(
        sessionRefreshResult.error?.key,
        "sessionStore.refreshTokens.invalidRefreshToken",
      );
    });

    t.test("invalidSession", async (t) => {
      // Just create a new session for this specific subtest, since we don't want to
      // recover the mutations.
      const customSessionInfo = await createSession();

      await queries.sessionStoreDelete(sql, {
        id: customSessionInfo.session.id,
      });

      const sessionRefreshResult = await sessionStoreRefreshTokens(
        newTestEvent(t),
        sql,
        sessionSettings,
        customSessionInfo.tokens.refreshToken,
      );

      t.equal(
        sessionRefreshResult.error?.key,
        "sessionStore.refreshTokens.invalidSession",
      );
    });

    t.test("revokedToken - revoked session", async (t) => {
      // Just create a new session for this specific subtest, since we don't want to
      // recover the mutations.
      const customSessionInfo = await createSession();

      await queries.sessionStoreUpdate(sql, {
        update: {
          revokedAt: new Date(),
        },
        where: {
          id: customSessionInfo.session.id,
        },
      });

      const sessionRefreshResult = await sessionStoreRefreshTokens(
        newTestEvent(t),
        sql,
        sessionSettings,
        customSessionInfo.tokens.refreshToken,
      );

      t.equal(
        sessionRefreshResult.error?.key,
        "sessionStore.refreshTokens.revokedToken",
      );
    });

    t.test("revokedToken - revoked token", async (t) => {
      // Just create a new session for this specific subtest, since we don't want to
      // recover the mutations.
      const customSessionInfo = await createSession();
      const revokedAt = new Date();
      revokedAt.setSeconds(revokedAt.getSeconds() - 30);

      await queries.sessionStoreTokenUpdate(sql, {
        update: {
          revokedAt,
        },
        where: {
          session: customSessionInfo.session.id,
        },
      });

      const sessionRefreshResult = await sessionStoreRefreshTokens(
        newTestEvent(t),
        sql,
        sessionSettings,
        customSessionInfo.tokens.refreshToken,
      );

      t.equal(
        sessionRefreshResult.error?.key,
        "sessionStore.refreshTokens.revokedToken",
      );
    });

    t.test("revokedToken - token leakage is reported", async (t) => {
      // Just create a new session for this specific subtest, since we don't want to
      // recover the mutations.
      const customSessionInfo = await createSession();
      const existingJobs = await queryJob({
        where: {
          name: SESSION_STORE_POTENTIAL_LEAKED_SESSION_JOB_NAME,
          isComplete: false,
        },
      }).exec(sql);

      const revokedAt = new Date();
      revokedAt.setDate(revokedAt.getDate() - 2);

      await queries.sessionStoreTokenUpdate(sql, {
        update: {
          revokedAt,
        },
        where: {
          id: customSessionInfo.session.accessTokens[0].refreshToken.id,
        },
      });

      const sessionRefreshResult = await sessionStoreRefreshTokens(
        newTestEvent(t),
        sql,
        sessionSettings,
        customSessionInfo.tokens.refreshToken,
      );

      t.equal(
        sessionRefreshResult.error?.key,
        "sessionStore.refreshTokens.revokedToken",
      );

      const endJobs = await queryJob({
        where: {
          name: SESSION_STORE_POTENTIAL_LEAKED_SESSION_JOB_NAME,
          isComplete: false,
        },
      }).exec(sql);

      t.ok(endJobs.length > existingJobs.length);
      const newJob = endJobs.find((it) =>
        isNil(existingJobs.find((it2) => it2.id === it.id)),
      );

      t.equal(newJob.data.report.session.id, customSessionInfo.session.id);
    });

    t.test("success", async (t) => {
      const sessionRefreshResult = await sessionStoreRefreshTokens(
        newTestEvent(t),
        sql,
        sessionSettings,
        sessionInfo.tokens.refreshToken,
      );

      t.ok(isNil(sessionRefreshResult.error));

      t.ok(sessionRefreshResult.value?.accessToken);
      t.ok(sessionRefreshResult.value?.refreshToken);

      const accessTokenPayload = await sessionStoreVerifyAndDecodeJWT(
        newTestEvent(t),
        sessionSettings.signingKey,
        sessionRefreshResult.value.accessToken,
      );
      t.ok(isNil(accessTokenPayload.error));

      const [session] = await querySessionStore({
        where: {
          viaAccessTokens: {
            where: {
              id: accessTokenPayload.value.payload.compasSessionAccessToken,
            },
          },
        },
        accessTokens: {
          refreshToken: {},
        },
      }).exec(sql);

      t.equal(session.accessTokens.length, 4);

      const oldAccessToken = session.accessTokens.find(
        (it) => it.id === sessionInfo.session.accessTokens[0].id,
      );
      const oldRefreshToken = session.accessTokens.find(
        (it) => it.id === sessionInfo.session.accessTokens[0].refreshToken.id,
      );

      t.ok(!isNil(oldAccessToken.revokedAt));
      t.ok(!isNil(oldRefreshToken.revokedAt));
    });
  });

  t.test("sessionStoreCleanupExpiredSessions", async (t) => {
    const longLivedSession = await createSession();
    const [session] = await queries.sessionStoreInsert(sql, [
      {
        data: {},
        checksum: "foo",
        revokedAt: new Date(),
      },
    ]);

    const [tokenId1, tokenId2, tokenId3] = [uuid(), uuid(), uuid()];
    const tenDaysInTheFuture = new Date();
    tenDaysInTheFuture.setDate(tenDaysInTheFuture.getDate() + 10);

    await queries.sessionStoreTokenInsert(
      sql,
      [
        {
          id: tokenId1,
          session: session.id,
          expiresAt: new Date(2020, 1, 1),
          createdAt: new Date(),
        },
        {
          id: tokenId2,
          session: session.id,
          expiresAt: new Date(tenDaysInTheFuture),
          createdAt: new Date(),
          refreshToken: tokenId3,
        },
        {
          id: tokenId3,
          session: session.id,
          expiresAt: new Date(tenDaysInTheFuture),
          revokedAt: new Date(),
          createdAt: new Date(),
        },
      ],
      {
        withPrimaryKey: true,
      },
    );

    t.test("uses maxRevokeAgeInDays", async (t) => {
      await sessionStoreCleanupExpiredSessions(newTestEvent(t), sql, 1);

      const sessionsAfterCleanup = await querySessionStore({}).exec(sql);
      const tokensAfterCleanup = await querySessionStoreToken({}).exec(sql);

      t.ok(sessionsAfterCleanup.find((it) => it.id === session.id));
      t.ok(
        sessionsAfterCleanup.find(
          (it) => it.id === longLivedSession.session.id,
        ),
      );

      t.ok(isNil(tokensAfterCleanup.find((it) => it.id === tokenId1)));
      t.ok(tokensAfterCleanup.find((it) => it.id === tokenId2));
      t.ok(tokensAfterCleanup.find((it) => it.id === tokenId3));
    });

    t.test(
      "expired tokens are cleaned, sessions without tokens removed",
      async (t) => {
        await sessionStoreCleanupExpiredSessions(newTestEvent(t), sql, 0);

        const sessionsAfterCleanup = await querySessionStore({}).exec(sql);
        const tokensAfterCleanup = await querySessionStoreToken({}).exec(sql);

        t.ok(isNil(sessionsAfterCleanup.find((it) => it.id === session.id)));
        t.ok(
          sessionsAfterCleanup.find(
            (it) => it.id === longLivedSession.session.id,
          ),
        );

        t.ok(isNil(tokensAfterCleanup.find((it) => it.id === tokenId1)));
        t.ok(isNil(tokensAfterCleanup.find((it) => it.id === tokenId2)));
        t.ok(isNil(tokensAfterCleanup.find((it) => it.id === tokenId3)));
      },
    );
  });
});
