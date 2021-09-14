// @ts-nocheck

/**
 * Consistent stringify type. Oh boi, if you ever use util.inspect on a big type...
 * Only works with validator and type generators, ignores routes, relations and sql
 * settings. When includeSqlRelated is set to true, will also check, enableQueries,
 * queryOptions, sql and relations
 *
 * @param {CodeGenType} type
 * @param {boolean} [includeSqlRelated=false]
 * @returns {string}
 */
export function stringifyType(type, includeSqlRelated = false) {
  const {
    isOptional,
    defaultValue,
    validator,
    uniqueName,
    oneOf,
    rawValue,
    rawValueImport,
    rawValidatorImport,
    rawValidator,
    sql,
    enableQueries,
    queryOptions,
  } = type;

  if (typeof uniqueName === "string" && uniqueName.length > 0) {
    return uniqueName;
  }

  const baseString = JSON.stringify({
    isOptional,
    defaultValue,
    validator,
    type: type.type,
    oneOf,
    rawValue,
    rawValueImport,
    rawValidatorImport,
    rawValidator,
    ...(includeSqlRelated
      ? {
          sql,
          enableQueries,
          queryOptions,
        }
      : {}),
  });

  switch (type.type) {
    case "any":
    case "boolean":
    case "date":
    case "file":
    case "number":
    case "string":
    case "uuid":
      return baseString;
    case "anyOf":
      return baseString + type.values.map((it) => stringifyType(it)).join(",");
    case "array":
      return baseString + stringifyType(type.values);
    case "generic":
      return baseString + stringifyType(type.keys) + stringifyType(type.values);
    case "object":
      return (
        baseString +
        Object.entries(type.keys)
          .map(([key, value]) => key + stringifyType(value))
          .join(",") +
        (includeSqlRelated
          ? type.relations.map((it) => stringifyType(it)).join(",")
          : "")
      );
    case "reference":
      return baseString + type.reference.uniqueName;
    case "relation":
      return (
        baseString +
        type.subType +
        type.ownKey +
        type.referencedKey +
        stringifyType(type.reference)
      );
    default:
      return JSON.stringify(type);
  }
}
