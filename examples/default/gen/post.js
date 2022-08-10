import { TypeCreator } from "@compas/code-gen";

/**
 * Apply the 'post' routes and related types
 *
 * @param {App} app
 */

export function extendWithPost(app) {
  const T = new TypeCreator("post");

  app.add(
    T.crud("/post").entity(T.reference("database", "post")).routes({
      listRoute: true,
      singleRoute: true,
      createRoute: true,
    }),
  );
}
