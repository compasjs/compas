/**
 * Get the resolved name of the provided crud route
 *
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @param {string} suffix
 * @returns {string}
 */
export function crudInformationGetName(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
  suffix: string,
): string;
/**
 * Get the resolved path of the provided crud route
 *
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @param {string} suffix
 * @returns {string}
 */
export function crudInformationGetPath(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
  suffix: string,
): string;
/**
 * Get the param name for the provided crud object
 *
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 */
export function crudInformationGetParamName(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
): string;
/**
 * Save the used model, so we don't have to resolve that each and every time.
 *
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @param {import("../generated/common/types.js").ExperimentalObjectDefinition} model
 */
export function crudInformationSetModel(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
  model: import("../generated/common/types.js").ExperimentalObjectDefinition,
): void;
/**
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @returns {import("../generated/common/types.js").ExperimentalObjectDefinition}
 */
export function crudInformationGetModel(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
): import("../generated/common/types.js").ExperimentalObjectDefinition;
/**
 * Save the used relation and parent
 *
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} parent
 * @param {import("../generated/common/types.js").
 * ExperimentalRelationDefinition} relation
 */
export function crudInformationSetRelationAndParent(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
  parent: import("../generated/common/types.js").ExperimentalCrudDefinition,
  relation: import("../generated/common/types.js").ExperimentalRelationDefinition,
): void;
/**
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @returns {import("../generated/common/types.js").ExperimentalRelationDefinition}
 */
export function crudInformationGetRelation(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
): import("../generated/common/types.js").ExperimentalRelationDefinition;
/**
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @returns {import("../generated/common/types.js").ExperimentalCrudDefinition}
 */
export function crudInformationGetParent(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
): import("../generated/common/types.js").ExperimentalCrudDefinition;
/**
 * Save the created readable type, so it is easily resolvable later on.
 *
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @param {{ group: string, name: string }} readable
 */
export function crudInformationSetReadableType(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
  readable: {
    group: string;
    name: string;
  },
): void;
/**
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @returns {{ group: string, name: string }}
 */
export function crudInformationGetReadableType(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
): {
  group: string;
  name: string;
};
/**
 * Save the created writable type, so it is easily resolvable later on.
 *
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @param {{ group: string, name: string }} writable
 */
export function crudInformationSetWritableType(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
  writable: {
    group: string;
    name: string;
  },
): void;
/**
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @returns {{ group: string, name: string }}
 */
export function crudInformationGetWritableType(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
): {
  group: string;
  name: string;
};
/**
 * Cache when the provided CRUD has a custom readable type.
 *
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @param {boolean} hasCustomReadableType
 */
export function crudInformationSetHasCustomReadableType(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
  hasCustomReadableType: boolean,
): void;
/**
 * Check if the crud or parent has a custom readable type
 *
 * @param {import("../generated/common/types.js").ExperimentalCrudDefinition} crud
 * @returns {boolean}
 */
export function crudInformationGetHasCustomReadableType(
  crud: import("../generated/common/types.js").ExperimentalCrudDefinition,
): boolean;
export type CrudInformation = {
  model: import("../generated/common/types.js").ExperimentalObjectDefinition;
  parent?:
    | import("../generated/common/types.js").ExperimentalCrudDefinition
    | undefined;
  relation?:
    | import("../generated/common/types.js").ExperimentalRelationDefinition
    | undefined;
  readableType: {
    group: string;
    name: string;
  };
  writableType: {
    group: string;
    name: string;
  };
  hasCustomReadableType: boolean;
};
//# sourceMappingURL=crud-information.d.ts.map
