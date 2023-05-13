/**
 * Get the resolved name of the provided crud route
 *
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @param {string} suffix
 * @returns {string}
 */
export function crudInformationGetName(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
  suffix: string,
): string;
/**
 * Get the resolved path of the provided crud route
 *
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @param {string} suffix
 * @returns {string}
 */
export function crudInformationGetPath(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
  suffix: string,
): string;
/**
 * Get the param name for the provided crud object
 *
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 */
export function crudInformationGetParamName(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
): string;
/**
 * Save the used model, so we don't have to resolve that each and every time.
 *
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @param {import("../generated/common/types.js").StructureObjectDefinition} model
 */
export function crudInformationSetModel(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
  model: import("../generated/common/types.js").StructureObjectDefinition,
): void;
/**
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @returns {import("../generated/common/types.js").StructureObjectDefinition}
 */
export function crudInformationGetModel(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
): import("../generated/common/types.js").StructureObjectDefinition;
/**
 * Save the used relation and parent
 *
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @param {import("../generated/common/types.js").StructureCrudDefinition} parent
 * @param {import("../generated/common/types.js").
 * StructureRelationDefinition} relation
 */
export function crudInformationSetRelationAndParent(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
  parent: import("../generated/common/types.js").StructureCrudDefinition,
  relation: import("../generated/common/types.js").StructureRelationDefinition,
): void;
/**
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @returns {import("../generated/common/types.js").StructureRelationDefinition}
 */
export function crudInformationGetRelation(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
): import("../generated/common/types.js").StructureRelationDefinition;
/**
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @returns {import("../generated/common/types.js").StructureCrudDefinition}
 */
export function crudInformationGetParent(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
): import("../generated/common/types.js").StructureCrudDefinition;
/**
 * Save the created readable type, so it is easily resolvable later on.
 *
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @param {{ group: string, name: string }} readable
 */
export function crudInformationSetReadableType(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
  readable: {
    group: string;
    name: string;
  },
): void;
/**
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @returns {{ group: string, name: string }}
 */
export function crudInformationGetReadableType(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
): {
  group: string;
  name: string;
};
/**
 * Save the created writable type, so it is easily resolvable later on.
 *
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @param {{ group: string, name: string }} writable
 */
export function crudInformationSetWritableType(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
  writable: {
    group: string;
    name: string;
  },
): void;
/**
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @returns {{ group: string, name: string }}
 */
export function crudInformationGetWritableType(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
): {
  group: string;
  name: string;
};
/**
 * Cache when the provided CRUD has a custom readable type.
 *
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @param {boolean} hasCustomReadableType
 */
export function crudInformationSetHasCustomReadableType(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
  hasCustomReadableType: boolean,
): void;
/**
 * Check if the crud or parent has a custom readable type
 *
 * @param {import("../generated/common/types.js").StructureCrudDefinition} crud
 * @returns {boolean}
 */
export function crudInformationGetHasCustomReadableType(
  crud: import("../generated/common/types.js").StructureCrudDefinition,
): boolean;
export type CrudInformation = {
  model: import("../generated/common/types.js").StructureObjectDefinition;
  parent?:
    | import("../generated/common/types.js").StructureCrudDefinition
    | undefined;
  relation?:
    | import("../generated/common/types.js").StructureRelationDefinition
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
