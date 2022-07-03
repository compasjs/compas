// @ts-nocheck

import { isNil } from "@compas/stdlib";
import { structureIteratorNamedTypes } from "../../structure/structureIterators.js";
import { traverseType } from "../structure-traverser.js";
import { atomicUpdateFieldsTable } from "./update-type.js";

/**
 * This short name is used in the default basic queries an can be overwritten / used in
 * other queries
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function addShortNamesToQueryEnabledObjects(context) {
  const knownShortNames = {};

  for (const type of getQueryEnabledObjects(context)) {
    if (!type.shortName) {
      type.shortName = type.name
        .split(/(?=[A-Z])/)
        .map((it) => (it[0] || "").toLowerCase())
        .join("");
    }

    if (knownShortNames[type.shortName]) {
      context.errors.push({
        errorString: `Short name '${type.shortName}' is used by both '${
          type.name
        }' and '${knownShortNames[type.shortName]}'.
  These short name values should be unique. Please call '.shortName()' on one or both of these types to set a custom value.`,
      });
    } else {
      knownShortNames[type.shortName] = type.name;
    }

    // Also format schema if specified
    type.queryOptions.schema = type.queryOptions.schema ?? "";
    if (type.queryOptions?.schema?.length > 0) {
      if (!type.queryOptions.schema.startsWith(`"`)) {
        type.queryOptions.schema = `"${type.queryOptions.schema}".`;
      }
    }
  }
}

/**
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @returns {CodeGenObjectType[]}
 */
export function getQueryEnabledObjects(context) {
  return structureIteratorNamedTypes(context.structure).filter(
    (it) => it.type === "object" && "enableQueries" in it && it.enableQueries,
  );
}

/**
 * Get primary key of object type.
 * If not exists, throw nicely.
 * The returned value is a copy, and not primary anymore.
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function staticCheckPrimaryKey(context, type) {
  const entry = Object.entries(type.keys).find(
    (it) => it[1].sql?.primary || it[1].reference?.sql?.primary,
  );

  if (isNil(entry)) {
    context.errors.push({
      errorString: `Type '${type.name}' is missing a primary key.
  Either remove 'withPrimaryKey' from the options passed to 'enableQueries()' or add 'T.uuid().primary()' / 'T.number().primary()' to your type.`,
    });
  }
}

/**
 * Get primary key of object type.
 * The returned value is a copy, and not primary anymore.
 *
 * @param {CodeGenObjectType} type
 * @returns {{ key: string, field: CodeGenType }}
 */
export function getPrimaryKeyWithType(type) {
  const entry = Object.entries(type.keys).find(
    (it) => it[1].sql?.primary || it[1].reference?.sql?.primary,
  );

  return {
    key: entry[0],
    field: entry[1].reference ?? entry[1],
  };
}

/**
 * Returns a sorted list of key names for the provided object type
 * - Primary keys
 * - Non nullable fields
 * - Nullable fields
 * - createdAt, updatedAt, deletedAt
 *
 * @param {CodeGenObjectType} type
 * @returns {string[]}
 */
export function getSortedKeysForType(type) {
  if (type?.internalSettings?._sortedKeys) {
    return type.internalSettings._sortedKeys;
  }

  const typeOrder = {
    boolean: 0,
    number: 1,
    uuid: 2,
    string: 3,
    date: 4,
  };

  const result = /** @type {string[]} */ Object.keys(type.keys)
    .filter(
      (it) => it !== "createdAt" && it !== "updatedAt" && it !== "deletedAt",
    )
    .sort((a, b) => {
      const fieldA = type.keys[a]?.reference ?? type.keys[a];
      const fieldB = type.keys[b]?.reference ?? type.keys[b];

      if (fieldA.sql?.primary) {
        return -1;
      }
      if (fieldB.sql?.primary) {
        return 1;
      }

      if (
        fieldA.isOptional &&
        isNil(fieldA.defaultValue) &&
        !fieldB.isOptional
      ) {
        return 1;
      } else if (
        !fieldA.isOptional &&
        fieldB.isOptional &&
        isNil(fieldB.defaultValue)
      ) {
        return -1;
      }

      const typeAIndex = typeOrder[fieldA.type] ?? 9;
      const typeBIndex = typeOrder[fieldB.type] ?? 9;

      if (typeAIndex !== typeBIndex) {
        return typeAIndex - typeBIndex;
      }

      return a.localeCompare(b);
    });

  if (type.keys["createdAt"]) {
    result.push("createdAt");
  }
  if (type.keys["updatedAt"]) {
    result.push("updatedAt");
  }
  if (type.keys["deletedAt"]) {
    result.push("deletedAt");
  }

  if (isNil(type.internalSettings)) {
    type.internalSettings = {};
  }
  type.internalSettings._sortedKeys = result;

  return result;
}

/**
 * Statically check if objects are correctly setup do have queries enabled.
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function doSqlChecks(context) {
  const referencedKeySet = new Map();

  for (const type of getQueryEnabledObjects(context)) {
    // Throw errors for missing primary keys
    staticCheckPrimaryKey(context, type);
    checkReservedObjectKeys(context, type);

    const ownKeySet = new Set();
    for (const relation of type.relations) {
      if (!referencedKeySet.has(relation.reference.reference.uniqueName)) {
        referencedKeySet.set(
          relation.reference.reference.uniqueName,
          new Set(),
        );
      }

      if (ownKeySet.has(relation.ownKey)) {
        context.errors.push({
          errorString: `Type '${type.uniqueName}' has multiple relations with the same own key '${relation.ownKey}'.
  Please use unique own keys.`,
        });
      }

      if (["manyToOne", "oneToOne"].includes(relation.subType)) {
        if (
          referencedKeySet
            .get(relation.reference.reference.uniqueName)
            .has(relation.referencedKey)
        ) {
          context.errors.push({
            errorString: `There are multiple relations to '${relation.reference.reference.uniqueName}'.'${relation.referencedKey}'.
  Make sure that they all have their own unique referenced key.`,
          });
        }
      }

      ownKeySet.add(relation.ownKey);
      referencedKeySet
        .get(relation.reference.reference.uniqueName)
        .add(relation.referencedKey);

      staticCheckRelation(context, type, relation);
    }
  }
}

/**
 * Check if referenced side has enabled queries
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {CodeGenObjectType} type
 * @param {CodeGenRelationType} relation
 */
function staticCheckRelation(context, type, relation) {
  // Throw errors for missing enableQueries statements
  if (!relation.reference.reference.enableQueries) {
    const { name } = relation.reference.reference;

    context.errors.push({
      errorString: `Type '${name}' did not call 'enableQueries' but '${type.name}' has a relation to it.
  Call 'enableQueries()' on '${name}' or remove the relation from '${type.name}'.`,
    });
  }

  if (relation.subType === "manyToOne") {
    let found = false;
    for (const otherSide of relation.reference.reference.relations) {
      if (
        otherSide.subType === "oneToMany" &&
        relation.referencedKey === otherSide.ownKey
      ) {
        otherSide.referencedKey = relation.ownKey;
        found = true;
        break;
      }
    }

    if (!found) {
      const { name } = relation.reference.reference;
      context.errors.push({
        errorString: `Relation from '${type.name}' is missing the inverse 'T.oneToMany()' on '${name}'.
  Add 'T.oneToMany("${relation.referencedKey}", T.reference("${type.group}", "${type.name}"))' to the 'relations()' call on '${name}'.`,
      });
    }
  } else if (relation.subType === "oneToMany") {
    let found = false;
    for (const otherSide of relation.reference.reference.relations) {
      if (
        otherSide.subType === "manyToOne" &&
        relation.ownKey === otherSide.referencedKey
      ) {
        found = true;
        break;
      }
    }

    if (!found) {
      const { name } = relation.reference.reference;
      context.errors.push({
        errorString: `Relation defined for '${type.name}', referencing '${name}' via '${relation.ownKey}' is unnecessary.
  Remove it or add the corresponding 'T.manyToOne()' call to '${name}'.`,
      });
    }
  }

  checkReservedRelationNames(context, type, relation);

  if (relation.subType === "oneToOne") {
    createOneToOneReverseRelation(context, type, relation);
  }
}

/**
 * Create the reverse side of a one to one relation
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {CodeGenObjectType} type
 * @param {CodeGenRelationType} relation
 */
function createOneToOneReverseRelation(context, type, relation) {
  const inverseSide = relation.reference.reference;
  inverseSide.relations.push({
    type: "relation",
    subType: "oneToOneReverse",
    ownKey: relation.referencedKey,
    referencedKey: relation.ownKey,
    reference: {
      type: "reference",
      isOptional: true,
      reference: type,
    },
  });

  checkReservedRelationNames(
    context,
    inverseSide,
    inverseSide.relations[inverseSide.relations.length - 1],
  );
}

/**
 * Check if the object (recursively) uses any reserved keys like those used for atomic
 * updates
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
function checkReservedObjectKeys(context, type) {
  const reservedKeys = Object.values(atomicUpdateFieldsTable).flat();

  traverseType(context.structure, type, (objectType) => {
    if (objectType.type !== "object") {
      return;
    }

    for (const key of Object.keys(objectType.keys)) {
      if (reservedKeys.includes(key)) {
        context.errors.push({
          errorString: `Type '${
            objectType.uniqueName ?? type.uniqueName
          }' recursively uses the reserved key '${key}'.
          Use '${key.substring(1)}' instead.`,
        });
      }
    }
  });
}

/**
 * Check if relation keys use a reserved keyword.
 * Reserved keywords mainly keys used in the query builder
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {CodeGenObjectType} type
 * @param {CodeGenRelationType} relation
 */
function checkReservedRelationNames(context, type, relation) {
  const reservedRelationNames = [
    "as",
    "limit",
    "offset",
    "orderBy",
    "orderBySpec",
    "select",
    "where",
  ];

  if (reservedRelationNames.includes(relation.ownKey)) {
    context.errors.push({
      errorString: `Relation name '${relation.ownKey}' from type '${type.name}' is a reserved keyword. Use another relation name.`,
    });
  }
}
