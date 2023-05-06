import { TypeCreator } from "@compas/code-gen";

/**
 * Apply the database structure
 *
 * @param {import("@compas/code-gen").Generator} generator
 */
export function extendWithDatabase(generator) {
  const T = new TypeCreator("database");

  generator.add(
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
