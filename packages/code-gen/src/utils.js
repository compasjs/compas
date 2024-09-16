import { AppError } from "@compas/stdlib";

/**
 * Uppercase first character of the input string
 *
 * @param {string|undefined} [str] input string
 * @returns {string}
 */
export function upperCaseFirst(str = "") {
  return str.length > 0 ? str[0].toUpperCase() + str.substring(1) : "";
}

/**
 * Lowercase first character of the input string
 *
 * @param {string|undefined} [str] input string
 * @returns {string}
 */
export function lowerCaseFirst(str = "") {
  return str.length > 0 ? str[0].toLowerCase() + str.substring(1) : "";
}

/**
 * Format a type name for error messages
 *
 * @param {undefined|{ group?: string, name?: string, type?: string }} type
 * @returns {string}
 */
export function stringFormatNameForError(type) {
  if (type?.group && type?.name) {
    return `('${type.group}', '${type.name}')`;
  }

  if (type?.type) {
    return `(${type.type})`;
  }

  return `(anonymous)`;
}

/**
 * Format a full relation name
 *
 * @param {string} ownName
 * @param {string} inverseName
 * @param {string} ownKey
 * @param {string} inverseKey
 * @returns {string}
 */
export function stringFormatRelation(ownName, inverseName, ownKey, inverseKey) {
  return `from '${ownName}' to '${inverseName}' via '${ownName}#${ownKey}' to '${inverseName}#${inverseKey}'`;
}

/**
 * Combine the messages of the provided errors and throw a new error.
 *
 * Early returns if an empty array is provided.
 *
 * Other supported properties:
 * - messages: expected to be a string[]
 *
 * @param {Array<import("@compas/stdlib").AppError>} errors
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
