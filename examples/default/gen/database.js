import { TypeCreator } from "@compas/code-gen";

/**
 * Apply the database structure
 *
 * @param {App} app
 */
export function extendWithDatabase(app) {
  const T = new TypeCreator("database");

  app.add(
    T.object("post")
      .keys({
        title: T.string().searchable(),
        text: T.string(),
      })
      .enableQueries({
        withDates: true,
      }),
  );
}
