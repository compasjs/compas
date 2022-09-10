import { TypeCreator } from "@compas/code-gen";

/**
 * Apply the database structure
 *
 * @param {App} app
 */
export function extendWithDatabase(app) {
  const T = new TypeCreator("database");

  app.add(
    T.object("user")
      .keys({
        email: T.string().searchable(),
        password: T.string(),
      })
      .enableQueries({
        withDates: true,
      }),
  );
}
