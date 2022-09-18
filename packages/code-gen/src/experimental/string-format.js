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
