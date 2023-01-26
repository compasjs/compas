/**
 * @typedef {object} CrudInformation
 * @property {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @property {import("../generated/common/types").ExperimentalCrudDefinition} [parent]
 * @property {import("../generated/common/types").
 * ExperimentalRelationDefinition} [relation]
 * @property {{ group: string, name: string }} readableType
 * @property {{ group: string, name: string }} writableType
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
  // @ts-expect-error
  obj.model = model;

  // @ts-expect-error
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

  // @ts-expect-error
  obj.parent = parent;
  // @ts-expect-error
  obj.relation = relation;

  // @ts-expect-error
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

/**
 * Save the created readable type, so it is easily resolvable later on.
 *
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @param {{ group: string, name: string }} readable
 */
export function crudInformationSetReadableType(crud, readable) {
  const obj = crudCache.get(crud) ?? {};
  // @ts-expect-error
  obj.readableType = readable;

  // @ts-expect-error
  crudCache.set(crud, obj);
}

/**
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @returns {{ group: string, name: string }}
 */
export function crudInformationGetReadableType(crud) {
  // @ts-expect-error
  return crudCache.get(crud).readableType;
}

/**
 * Save the created writable type, so it is easily resolvable later on.
 *
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @param {{ group: string, name: string }} writable
 */
export function crudInformationSetWritableType(crud, writable) {
  const obj = crudCache.get(crud) ?? {};
  // @ts-expect-error
  obj.writableType = writable;

  // @ts-expect-error
  crudCache.set(crud, obj);
}

/**
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @returns {{ group: string, name: string }}
 */
export function crudInformationGetWritableType(crud) {
  // @ts-expect-error
  return crudCache.get(crud).writableType;
}
