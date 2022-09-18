/**
 * @type {{
 *   bool: {
 *     structureExtractReferences: (
 *        structure: import("./generated/common/types").ExperimentalStructure,
 *        type: import("./generated/common/types").ExperimentalBooleanDefinition,
 *     ) => void,
 *     structureIncludeReferences: (
 *        fullStructure: import("./generated/common/types").ExperimentalStructure,
 *        newStructure: import("./generated/common/types").ExperimentalStructure,
 *        type: import("./generated/common/types").ExperimentalBooleanDefinition,
 *     ) => void,
 *     structureValidateReferenceForType: (
 *        structure: import("./generated/common/types").ExperimentalStructure,
 *        type: import("./generated/common/types").ExperimentalBooleanDefinition,
 *        parentTypeStack: string[],
 *     ) => void,
 *   },
 *   reference: {
 *     structureExtractReferences: (
 *        structure: import("./generated/common/types").ExperimentalStructure,
 *        type: import("./generated/common/types").ExperimentalReferenceDefinition,
 *     ) => void,
 *     structureIncludeReferences: (
 *        fullStructure: import("./generated/common/types").ExperimentalStructure,
 *        newStructure: import("./generated/common/types").ExperimentalStructure,
 *        type: import("./generated/common/types").ExperimentalReferenceDefinition,
 *     ) => void,
 *     structureValidateReferenceForType: (
 *        structure: import("./generated/common/types").ExperimentalStructure,
 *        type: import("./generated/common/types").ExperimentalReferenceDefinition,
 *        parentTypeStack: string[],
 *     ) => void,
 *   },
 * }}
 */
export const typeDefinitionHelpers: {
  bool: {
    structureExtractReferences: (
      structure: import("./generated/common/types").ExperimentalStructure,
      type: import("./generated/common/types").ExperimentalBooleanDefinition,
    ) => void;
    structureIncludeReferences: (
      fullStructure: import("./generated/common/types").ExperimentalStructure,
      newStructure: import("./generated/common/types").ExperimentalStructure,
      type: import("./generated/common/types").ExperimentalBooleanDefinition,
    ) => void;
    structureValidateReferenceForType: (
      structure: import("./generated/common/types").ExperimentalStructure,
      type: import("./generated/common/types").ExperimentalBooleanDefinition,
      parentTypeStack: string[],
    ) => void;
  };
  reference: {
    structureExtractReferences: (
      structure: import("./generated/common/types").ExperimentalStructure,
      type: import("./generated/common/types").ExperimentalReferenceDefinition,
    ) => void;
    structureIncludeReferences: (
      fullStructure: import("./generated/common/types").ExperimentalStructure,
      newStructure: import("./generated/common/types").ExperimentalStructure,
      type: import("./generated/common/types").ExperimentalReferenceDefinition,
    ) => void;
    structureValidateReferenceForType: (
      structure: import("./generated/common/types").ExperimentalStructure,
      type: import("./generated/common/types").ExperimentalReferenceDefinition,
      parentTypeStack: string[],
    ) => void;
  };
};
//# sourceMappingURL=type-definition.d.ts.map
