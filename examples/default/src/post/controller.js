import { newEventFromEvent } from "@compas/stdlib";
import { postHandlers } from "../generated/application/post/controller.js";
import { postSingle } from "../generated/application/post/events.js";
import { sql } from "../services/core.js";
import { postUpdate } from "./events.js";

postHandlers.update = async (ctx) => {
  const post = await postSingle(newEventFromEvent(ctx.event), sql, {
    where: {
      id: ctx.validatedParams.postId,
    },
  });

  await sql.begin((sql) =>
    postUpdate(newEventFromEvent(ctx.event), sql, post, ctx.validatedBody),
  );

  ctx.body = {
    success: true,
  };
};
