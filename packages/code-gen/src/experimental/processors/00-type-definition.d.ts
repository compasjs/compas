/**
 * Implementations for structure behaviors per type.
 * This is optimized for adding new types without altering many files, it will grow in to
 * a pretty decent file, but should be pretty stable.
 *
 * These are not tested directly, but via their callers.
 *
 * @type {Record<
 *   import("../generated/common/types").ExperimentalTypeDefinition["type"],
 *   {
 *     structureExtractReferences: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition,
 *     ) => void,
 *     structureIncludeReferences: (
 *        fullStructure: import("../generated/common/types").ExperimentalStructure,
 *        newStructure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition,
 *     ) => void,
 *     structureValidateReferenceForType: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition,
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
    ) => void;
    structureIncludeReferences: (
      fullStructure: import("../generated/common/types").ExperimentalStructure,
      newStructure: import("../generated/common/types").ExperimentalStructure,
      type: import("../generated/common/types").ExperimentalTypeDefinition,
    ) => void;
    structureValidateReferenceForType: (
      structure: import("../generated/common/types").ExperimentalStructure,
      type: import("../generated/common/types").ExperimentalTypeDefinition,
      parentTypeStack: string[],
    ) => void;
  }
>;
import { structureExtractReferences } from "./01-structure.js";
import { structureIncludeReferences } from "./01-structure.js";
import { structureValidateReferenceForType } from "./01-structure.js";
//# sourceMappingURL=00-type-definition.d.ts.map
