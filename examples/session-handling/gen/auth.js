import { TypeCreator } from "@compas/code-gen";

export function extendWithAuth(app) {
  const T = new TypeCreator("auth");
  const R = T.router("/auth");

  const session = T.object("session").keys({
    id: T.uuid(),
    createdAt: T.date(),
  });

  const tokenPair = T.object("tokenPair").keys({
    accessToken: T.string(),
    refreshToken: T.string(),
  });

  app.add(
    R.get("/me", "me").response({
      session,
    }),

    R.post("/login", "login")
      .response(tokenPair)
      .invalidations(R.invalidates("auth")),

    R.post("/refresh", "refreshTokens")
      .body({
        refreshToken: T.string(),
      })
      .response(tokenPair)
      .invalidations(R.invalidates("auth")),

    R.post("/logout", "logout")
      .response({ success: true })
      .invalidations(R.invalidates("auth")),
  );
}
