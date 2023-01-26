/**
 * Save the used model, so we don't have to resolve that each and every time.
 *
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 */
export function crudInformationSetModel(
  crud: import("../generated/common/types").ExperimentalCrudDefinition,
  model: import("../generated/common/types").ExperimentalObjectDefinition,
): void;
/**
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @returns {import("../generated/common/types").ExperimentalObjectDefinition}
 */
export function crudInformationGetModel(
  crud: import("../generated/common/types").ExperimentalCrudDefinition,
): import("../generated/common/types").ExperimentalObjectDefinition;
/**
 * Save the used relation and parent
 *
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} parent
 * @param {import("../generated/common/types").
 * ExperimentalRelationDefinition} relation
 */
export function crudInformationSetRelationAndParent(
  crud: import("../generated/common/types").ExperimentalCrudDefinition,
  parent: import("../generated/common/types").ExperimentalCrudDefinition,
  relation: import("../generated/common/types").ExperimentalRelationDefinition,
): void;
/**
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @returns {import("../generated/common/types").ExperimentalRelationDefinition}
 */
export function crudInformationGetRelation(
  crud: import("../generated/common/types").ExperimentalCrudDefinition,
): import("../generated/common/types").ExperimentalRelationDefinition;
/**
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @returns {import("../generated/common/types").ExperimentalCrudDefinition}
 */
export function crudInformationGetParent(
  crud: import("../generated/common/types").ExperimentalCrudDefinition,
): import("../generated/common/types").ExperimentalCrudDefinition;
/**
 * Save the created readable type, so it is easily resolvable later on.
 *
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @param {{ group: string, name: string }} readable
 */
export function crudInformationSetReadableType(
  crud: import("../generated/common/types").ExperimentalCrudDefinition,
  readable: {
    group: string;
    name: string;
  },
): void;
/**
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @returns {{ group: string, name: string }}
 */
export function crudInformationGetReadableType(
  crud: import("../generated/common/types").ExperimentalCrudDefinition,
): {
  group: string;
  name: string;
};
/**
 * Save the created writable type, so it is easily resolvable later on.
 *
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @param {{ group: string, name: string }} writable
 */
export function crudInformationSetWritableType(
  crud: import("../generated/common/types").ExperimentalCrudDefinition,
  writable: {
    group: string;
    name: string;
  },
): void;
/**
 * @param {import("../generated/common/types").ExperimentalCrudDefinition} crud
 * @returns {{ group: string, name: string }}
 */
export function crudInformationGetWritableType(
  crud: import("../generated/common/types").ExperimentalCrudDefinition,
): {
  group: string;
  name: string;
};
export type CrudInformation = {
  model: import("../generated/common/types").ExperimentalObjectDefinition;
  parent?:
    | import("../generated/common/types").ExperimentalCrudDefinition
    | undefined;
  relation?:
    | import("../generated/common/types").ExperimentalRelationDefinition
    | undefined;
  readableType: {
    group: string;
    name: string;
  };
  writableType: {
    group: string;
    name: string;
  };
};
//# sourceMappingURL=crud-information.d.ts.map
