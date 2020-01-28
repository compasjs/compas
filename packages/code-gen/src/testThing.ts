import { V } from "./fluent/validator";
import { createApp, runner } from "./runner";

if (require.main === module) {
  delete require.cache[require.resolve(__filename)];
  runner.run(__filename);
} else {
  const app = createApp();

  app.validator(
    V("Point").object({
      x: V.number().optional(),
      y: V.number().convert(),
    }),
  );

  app
    .get("postList")
    .path("/posts")
    .query(V.ref("Point"));

  app
    .get("orderList")
    .path("/orders")
    .query(V.ref("QuerySchemaPostList"));
}
