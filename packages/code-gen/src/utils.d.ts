/**
 * Uppercase first character of the input string
 *
 * @param {string|undefined} [str] input string
 * @returns {string}
 */
export function upperCaseFirst(str?: string | undefined): string;
/**
 * Lowercase first character of the input string
 *
 * @param {string|undefined} [str] input string
 * @returns {string}
 */
export function lowerCaseFirst(str?: string | undefined): string;
/**
 * Format a type name for error messages
 *
 * @param {undefined|{ group?: string, name?: string, type?: string }} type
 * @returns {string}
 */
export function stringFormatNameForError(
  type:
    | undefined
    | {
        group?: string;
        name?: string;
        type?: string;
      },
): string;
/**
 * Format a full relation name
 *
 * @param {string} ownName
 * @param {string} inverseName
 * @param {string} ownKey
 * @param {string} inverseKey
 * @returns {string}
 */
export function stringFormatRelation(
  ownName: string,
  inverseName: string,
  ownKey: string,
  inverseKey: string,
): string;
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
export function errorsThrowCombinedError(
  errors: import("@compas/stdlib").AppError[],
): void;
//# sourceMappingURL=utils.d.ts.map
