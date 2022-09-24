/**
 * Implementations for structure behaviors per type.
 * This is optimized for adding new types without altering many files, it will grow in to
 * a pretty decent file, but should be pretty stable.
 *
 * These are not tested directly, but via their callers.
 *
 * @type {{
 *   bool: {
 *     structureExtractReferences: (
 *        structure: import("../generated/common/types.js").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalBooleanDefinition,
 *     ) => void,
 *     structureIncludeReferences: (
 *        fullStructure: import("../generated/common/types").ExperimentalStructure,
 *        newStructure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalBooleanDefinition,
 *     ) => void,
 *     structureValidateReferenceForType: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalBooleanDefinition,
 *        parentTypeStack: string[],
 *     ) => void,
 *   },
 *   reference: {
 *     structureExtractReferences: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalReferenceDefinition,
 *     ) => void,
 *     structureIncludeReferences: (
 *        fullStructure: import("../generated/common/types").ExperimentalStructure,
 *        newStructure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalReferenceDefinition,
 *     ) => void,
 *     structureValidateReferenceForType: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalReferenceDefinition,
 *        parentTypeStack: string[],
 *     ) => void,
 *   },
 * }}
 */
export const typeDefinitionHelpers: {
  bool: {
    structureExtractReferences: (
      structure: import("../generated/common/types.js").ExperimentalStructure,
      type: import("../generated/common/types").ExperimentalBooleanDefinition,
    ) => void;
    structureIncludeReferences: (
      fullStructure: import("../generated/common/types").ExperimentalStructure,
      newStructure: import("../generated/common/types").ExperimentalStructure,
      type: import("../generated/common/types").ExperimentalBooleanDefinition,
    ) => void;
    structureValidateReferenceForType: (
      structure: import("../generated/common/types").ExperimentalStructure,
      type: import("../generated/common/types").ExperimentalBooleanDefinition,
      parentTypeStack: string[],
    ) => void;
  };
  reference: {
    structureExtractReferences: (
      structure: import("../generated/common/types").ExperimentalStructure,
      type: import("../generated/common/types").ExperimentalReferenceDefinition,
    ) => void;
    structureIncludeReferences: (
      fullStructure: import("../generated/common/types").ExperimentalStructure,
      newStructure: import("../generated/common/types").ExperimentalStructure,
      type: import("../generated/common/types").ExperimentalReferenceDefinition,
    ) => void;
    structureValidateReferenceForType: (
      structure: import("../generated/common/types").ExperimentalStructure,
      type: import("../generated/common/types").ExperimentalReferenceDefinition,
      parentTypeStack: string[],
    ) => void;
  };
};
//# sourceMappingURL=type-definition.d.ts.map
