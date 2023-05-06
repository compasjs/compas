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
//# sourceMappingURL=string-format.d.ts.map
