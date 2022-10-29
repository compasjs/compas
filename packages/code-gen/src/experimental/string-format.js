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
