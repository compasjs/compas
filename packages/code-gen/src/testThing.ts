import { createApp, runner } from "./runner";

if (require.main === module) {
  delete require.cache[require.resolve(__filename)];
  runner.run(__filename);
} else {
  const app = createApp();

  app.type("Point", T => {
    T.enableValidator().set(
      T.object().keys({
        x: T.number().convert(),
        y: T.number()
          .convert()
          .optional()
          .integer(),
      }),
    );
  });

  app.get("getPoint", R => {
    R.path("/point").query(T =>
      T.set(
        T.object().keys({
          abs: T.boolean()
            .convert()
            .optional(),
        }),
      ),
    );
  });
}
