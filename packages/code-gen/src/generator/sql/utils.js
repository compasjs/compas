import { isNil } from "@lbu/stdlib";

/**
 * This short name is used in the default basic queries an can be overwritten / used in
 * other queries
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

/**
 * Get primary key of object type.
 * If not exists, throw nicely.
 * The returned value is a copy, and not primary anymore.
 *
 * @param {CodeGenObjectType} type
 * @returns {{ key: string, field: CodeGenType }}
 */
export function getPrimaryKeyWithType(type) {
  const entry = Object.entries(type.keys).find(
    (it) => it[1].sql?.primary || it[1].reference?.sql?.primary,
  );

  if (isNil(entry)) {
    throw new Error(
      `Type '${type.name}' is missing a primary key, but has enabled queries.`,
    );
  }

  return {
    key: entry[0],
    field: entry[1].reference ?? entry[1],
  };
}

/**
 * Statically check if objects are correctly setup do have queries enabled.
 * @param {CodeGenContext} context
 */
export function doSqlChecks(context) {
  for (const type of getQueryEnabledObjects(context)) {
    // Throw errors for missing primary keys
    getPrimaryKeyWithType(type);

    for (const relation of type.relations) {
      staticCheckRelation(type, relation);
    }
  }
}

/**
 * Check if referenced side has enabled queries
 *
 * @param {CodeGenObjectType} type
 * @param {CodeGenRelationType} relation
 */
function staticCheckRelation(type, relation) {
  // Throw errors for missing enableQueries statements
  if (!relation.reference.reference.enableQueries) {
    const { name } = relation.reference.reference;
    throw new Error(
      `Type '${name}' did not call .enableQueries(), but is has a relation to '${type.name}'.`,
    );
  }

  if (relation.subType === "manyToOne") {
    let found = false;
    for (const otherSide of relation.reference.reference.relations) {
      if (
        otherSide.subType === "oneToMany" &&
        relation.referencedKey === otherSide.ownKey
      ) {
        found = true;
        break;
      }
    }

    if (!found) {
      const { name } = relation.reference.reference;
      throw new Error(
        `Relation from '${type.name}' to '${name}' is missing the inverse T.oneToMany relation.`,
      );
    }
  }

  if (relation.subType === "oneToOne") {
    createOneToOneReverseRelation(type, relation);
  }
}

/**
 * Create the reverse side of a one to one relation
 *
 * @param {CodeGenObjectType} type
 * @param {CodeGenRelationType} relation
 */
function createOneToOneReverseRelation(type, relation) {
  const inverseSide = relation.reference.reference;
  inverseSide.relations.push({
    type: "relation",
    subType: "oneToOneReverse",
    ownKey: relation.referencedKey,
    reference: {
      type: "reference",
      isOptional: true,
      reference: type,
    },
  });
}
