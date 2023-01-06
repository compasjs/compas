import { AppError } from "@compas/stdlib";

/**
 * Combine the messages of the provided errors and throw a new error.
 *
 * Early returns if an empty array is provided.
 *
 * Other supported properties:
 * - messages: expected to be a string[]
 *
 * @param {import("@compas/stdlib").AppError[]} errors
 * @returns {void}
 */
export function errorsThrowCombinedError(errors) {
  if (errors.length === 0) {
    return;
  }

  const messages = [];

  for (const err of errors) {
    if (err.info?.message) {
      messages.push(err.info.message);
    } else if (err.info?.messages) {
      messages.push(...err.info.messages);
    } else {
      messages.push(AppError.format(err));
    }
  }

  throw AppError.serverError({
    messages,
  });
}
