import { structureIteratorNamedTypes } from "../structure/structureIterators.js";

/**
 * Validate and add CRUD types.
 * Note that we are in a 'bare' land here.
 * No reference is resolved, so needs to be looked up and things like relations between
 * query enabled objects are not resolved yet.
 *
 * To accommodate this, there will be a need for various utilities to look references up
 * and resolve types of 'virtual' relation fields.
 *
 * @param {import("../generated/common/types.js").CodeGenContext} context
 */
export function crudPreprocess(context) {
  for (const type of structureIteratorNamedTypes(context.structure)) {
    if (!("type" in type) || type.type !== "crud") {
      continue;
    }

    crudValidateType(context, type);
  }
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudValidateType(context, type) {
  if (type.fromParent && !type.entity) {
    // We already passed an error that the relation could not be resolved
    return;
  }

  /** @type {import("../generated/common/types.js").CodeGenObjectType} */
  // @ts-expect-error
  const ref = type.entity.reference;

  if (!ref?.enableQueries || !ref?.uniqueName || ref?.type !== "object") {
    context.errors.push({
      key: "crudEnableQueries",
      value: `CRUD generation only supports references to named objects that have called '.enableQueries'.
      Found a 'T.crud()' in the '${type.group}' group which did not call '.entity()' or called '.entity()' with an invalid value.`,
    });

    return;
  }

  if (ref.queryOptions?.withSoftDeletes) {
    context.errors.push({
      key: "crudSoftDeleteNotSupported",
      value: `CRUD generation does not yet support soft deletes, but '${ref.uniqueName}' is used in either 'T.crud().entity()' or 'T.crud().nestedRelations' on the '${type.group}' group.
                          Replace 'withSoftDeletes' with 'withDates' or manually create and implement the CRUD routes.`,
    });
  }

  if (ref.uniqueName === "StoreFile") {
    context.errors.push({
      key: "crudStoreFileNotSupported",
      value: `CRUD generation does not yet support files, but it is used in a 'T.crud()' call in the '${type.group}' group.
       Support will be added later.`,
    });
  }

  if (
    ref.relations.find(
      (it) => it.reference.reference.uniqueName === "StoreFile",
    )
  ) {
    // This may change to an automatic '$omit' for both readable and writable fields. It
    // then should be documented as such.

    context.errors.push({
      key: "crudStoreFileNotSupported",
      value: `CRUD generation does not yet support files, but it is referenced by '${ref.uniqueName}' through the 'T.crud()' call on '${type.group}' group.
       Support will be added later.`,
    });
  }

  if (
    type.fromParent &&
    type.internalSettings.usedRelation.subType === "oneToOneReverse"
  ) {
    // This is the easiest way to disable the list route on oneToOne relations.
    // We also remove the unnecessary params being used.
    type.routeOptions.listRoute = false;
  }

  if (type.basePath && !type.basePath.startsWith("/")) {
    type.basePath = `/${type.basePath}`;
  }

  for (const relation of type.inlineRelations) {
    crudResolveRelation(context, type, relation);
  }
  for (const relation of type.nestedRelations) {
    crudResolveRelation(context, type, relation);
  }

  for (const relation of type.inlineRelations) {
    crudValidateType(context, relation);
  }

  for (const relation of type.nestedRelations) {
    crudValidateType(context, relation);
  }
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {import("../generated/common/types.js").CodeGenCrudType} relation
 */
function crudResolveRelation(context, type, relation) {
  /** @type {import("../generated/common/types.js").CodeGenObjectType} */
  // @ts-expect-error
  const ref = type.entity.reference;

  const usedRelation = ref.relations.find((it) => {
    return (
      ["oneToMany", "oneToOneReverse"].includes(it.subType) &&
      it.ownKey === relation.fromParent?.field
    );
  });

  if (!usedRelation) {
    context.errors.push({
      key: "crudFromParentNotResolved",
      value: `Relation in CRUD from '${ref.uniqueName}' via '${relation.fromParent?.field}' could not be resolved in a 'T.crud()' call on the '${type.group}' group.
      There should be a 'T.oneToMany("${relation.fromParent?.field}", ...)' defined on '${ref.uniqueName}'. 
      Or a 'T.oneToOne("...", T.reference("${ref.group}", "${ref.name}"), "${relation.fromParent?.field}")' on the owning side of the relation.
      CRUD can't be generated from the owning side to referenced side.`,
    });

    return;
  }

  relation.internalSettings.parent = type;
  relation.internalSettings.usedRelation = usedRelation;
  relation.entity = usedRelation.reference;
}
