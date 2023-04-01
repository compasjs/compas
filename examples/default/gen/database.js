import { TypeCreator } from "@compas/code-gen";

/**
 * Apply the database structure
 *
 * @param {import("@compas/code-gen/experimental").Generator} generator
 */
export function extendWithDatabase(generator) {
  const T = new TypeCreator("database");

  generator.add(
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
