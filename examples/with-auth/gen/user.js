import { TypeCreator } from "@compas/code-gen";

/**
 * Apply the 'post' routes and related types
 *
 * @param {import("@compas/code-gen/experimental").Generator} generator
 */
export function extendWithUser(generator) {
  const T = new TypeCreator("user");
  const R = T.router("/user");

  const email = T.string("email")
    .min(2)
    .max(150)
    .lowerCase()
    .trim()
    .pattern(/^\S+@\S+\.\S+$/)
    .docs(
      "Relatively free-form email type. Accepting most valid emails. Emails are case-insensitive.",
    );

  const password = T.string("password").min(8);

  const tokenPair = T.object("tokenPair").keys({
    accessToken: T.string(),
    refreshToken: T.string(),
  });

  generator.add(
    R.post("/register", "register")
      .body({
        email,
        password,
      })
      .response({
        success: true,
      })
      .docs("Register a new user."),

    R.post("/login", "login")
      .body({
        email,
        password,
      })
      .response(tokenPair)
      .docs("Login with an existing user."),

    R.post("/refresh-tokens", "refreshTokens")
      .body({
        refreshToken: T.string(),
      })
      .response(tokenPair),

    R.post("/logout", "logout").response({
      success: true,
    }),

    R.get("/me", "me")
      .response({
        email,
        createdAt: T.date(),
      })
      .docs("Get information about the current user."),
  );
}
