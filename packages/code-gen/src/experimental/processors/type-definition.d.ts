/**
 * Implementations for structure behaviors per type. It should be used in stead of
 * switching per type. Adding support for new behavior is then limited to this file only.
 *
 * Not all types need to support each operation, these will still be written out with
 * empty functions.
 *
 * @type {Record<
 *   import("../generated/common/types").ExperimentalTypeDefinition["type"],
 *   {
 *     structureExtractReferences: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition,
 *     ) => import("../generated/common/types").ExperimentalTypeDefinition|undefined,
 *     structureIncludeReferences: (
 *        fullStructure: import("../generated/common/types").ExperimentalStructure,
 *        newStructure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition,
 *     ) => void,
 *     structureValidateReferenceForType: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition|undefined,
 *        parentTypeStack: string[],
 *     ) => void,
 *   }
 * >}
 */
export const typeDefinitionHelpers: Record<
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "file"
  | "array"
  | "relation"
  | "reference"
  | "crud"
  | "any"
  | "anyOf"
  | "date"
  | "generic"
  | "uuid"
  | "route"
  | "extend"
  | "omit"
  | "pick"
  | "routeInvalidation",
  {
    structureExtractReferences: (
      structure: import("../generated/common/types").ExperimentalStructure,
      type: import("../generated/common/types").ExperimentalTypeDefinition,
    ) =>
      | import("../generated/common/types").ExperimentalTypeDefinition
      | undefined;
    structureIncludeReferences: (
      fullStructure: import("../generated/common/types").ExperimentalStructure,
      newStructure: import("../generated/common/types").ExperimentalStructure,
      type: import("../generated/common/types").ExperimentalTypeDefinition,
    ) => void;
    structureValidateReferenceForType: (
      structure: import("../generated/common/types").ExperimentalStructure,
      type:
        | import("../generated/common/types").ExperimentalTypeDefinition
        | undefined,
      parentTypeStack: string[],
    ) => void;
  }
>;
import { structureExtractReferences } from "./structure.js";
import { structureIncludeReferences } from "./structure.js";
import { structureValidateReferenceForType } from "./structure.js";
//# sourceMappingURL=type-definition.d.ts.map
