import { TypeCreator } from "@compas/code-gen";

/**
 * Apply the 'post' routes and related types
 *
 * @param {App} app
 */

export function extendWithPost(app) {
  const T = new TypeCreator("post");
  const R = T.router("/post");

  app.add(
    T.crud("/post").entity(T.reference("database", "post")).routes({
      listRoute: true,
      singleRoute: true,
      createRoute: true,
    }),

    R.post("/:postId/update", "update")
      .params({
        postId: T.uuid(),
      })
      .body({
        text: T.string().min(10),
      })
      .response({
        success: true,
      })
      .invalidations(
        R.invalidates("post", "list"),
        R.invalidates("post", "single", { useSharedParams: true }),
      ),
  );
}
