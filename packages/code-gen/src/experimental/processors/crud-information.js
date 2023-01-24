/**
 * @typedef {object} CrudInformation
 * @property {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @property {import("../generated/common/types").ExperimentalCrudDefinition} [parent]
 * @property {import("../generated/common/types").
 * ExperimentalRelationDefinition} [relation]
 */

/**
 * Cache various items around CRUD objects
 *
 * @type {WeakMap<object, CrudInformation>}
 */
const crudCache = new WeakMap();

/**
 * Save the used model, so we don't have to resolve that each and every time.
 *
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 */
export function crudInformationSetModel(crud, model) {
  const obj = crudCache.get(crud) ?? {};
  obj.model = model;

  crudCache.set(crud, obj);
}

/**
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @returns {import("../generated/common/types").ExperimentalObjectDefinition}
 */
export function crudInformationGetModel(crud) {
  // @ts-expect-error
  return crudCache.get(crud).model;
}

/**
 * Save the used relation and parent
 *
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} parent
 * @param {import("../generated/common/types").
 * ExperimentalRelationDefinition} relation
 */
export function crudInformationSetRelationAndParent(crud, parent, relation) {
  const obj = crudCache.get(crud) ?? {};

  obj.parent = parent;
  obj.relation = relation;

  crudCache.set(crud, obj);
}

/**
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @returns {import("../generated/common/types").ExperimentalRelationDefinition}
 */
export function crudInformationGetRelation(crud) {
  // @ts-expect-error
  return crudCache.get(crud).relation;
}

/**
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @returns {import("../generated/common/types").ExperimentalCrudDefinition}
 */
export function crudInformationGetParent(crud) {
  // @ts-expect-error
  return crudCache.get(crud).parent;
}
