import { eventStart, eventStop } from "@compas/stdlib";
import { queries } from "../generated/application/database/index.js";

/**
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {PostItem} post
 * @param {PostUpdateBody} body
 * @returns {Promise<void>}
 */
export async function postUpdate(event, sql, post, body) {
  eventStart(event, "post.update");

  await queries.postUpdate(sql, {
    update: {
      text: body.text,
    },
    where: {
      id: post.id,
    },
  });

  eventStop(event);
}
