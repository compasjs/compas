/**
 * This short name is used in the default basic queries an can be overwritten / used in other queries
 * @param {CodeGenContext} context
 */
export function addShortNamesToQueryEnabledObjects(context) {
  for (const type of getQueryEnabledObjects(context)) {
    type.shortName = type.name
      .split(/(?=[A-Z])/)
      .map((it) => (it[0] || "").toLowerCase())
      .join("");
  }
}

/**
 * @param {CodeGenContext} context
 * @returns {CodeGenObjectType[]}
 */
export function getQueryEnabledObjects(context) {
  const result = [];

  for (const group of Object.values(context.structure)) {
    for (const type of Object.values(group)) {
      if (type.type !== "object" || !type.enableQueries) {
        continue;
      }

      result.push(type);
    }
  }

  return result;
}
