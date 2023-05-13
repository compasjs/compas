import { referenceUtilsGetProperty } from "../processors/reference-utils.js";
import { structureResolveReference } from "../processors/structure.js";
import { typeDefinitionTraverse } from "../processors/type-definition-traverse.js";

/**
 * Cache to check if for the provided type we already have resolved the used optionality
 *
 * @type {WeakMap<import("../generated/common/types.js").StructureTypeSystemDefinition,
 *   boolean>}
 */
const typeOptionalityCache = new WeakMap();

/**
 * Check if the provided type should be generated as an optional type.
 * When {@link options.validatorState} is set to 'output', we expect that defaults are
 * applied.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureTypeSystemDefinition} type
 * @param {Pick<import("./generator.js").GenerateTypeOptions, "validatorState">} options
 * @returns {boolean}
 */
export function typesOptionalityIsOptional(generateContext, type, options) {
  if (options.validatorState === "input") {
    return referenceUtilsGetProperty(
      generateContext,
      type,
      ["isOptional"],
      false,
    );
  } else if (options.validatorState === "output") {
    if (
      referenceUtilsGetProperty(generateContext, type, ["isOptional"], false) &&
      referenceUtilsGetProperty(generateContext, type, ["defaultValue"], false)
    ) {
      return false;
    }

    return referenceUtilsGetProperty(
      generateContext,
      type,
      ["isOptional"],
      false,
    );
  }

  return false;
}

/**
 * Check if the type recursively has optionality differences
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureTypeSystemDefinition} type
 * @returns {boolean}
 */
export function typesHasDifferentTypeAfterValidators(generateContext, type) {
  if (typeOptionalityCache.has(type)) {
    return typeOptionalityCache.get(type) ?? false;
  }

  let hasOptionalityDifferences = false;

  /** @type {any} */
  const includedTypes = [type];

  typeDefinitionTraverse(
    type,
    (nestedType, callback) => {
      const inputOptionality = typesOptionalityIsOptional(
        generateContext,

        // @ts-expect-error
        nestedType,
        {
          validatorState: "input",
        },
      );
      const outputOptionality = typesOptionalityIsOptional(
        generateContext,

        // @ts-expect-error
        nestedType,
        {
          validatorState: "output",
        },
      );

      hasOptionalityDifferences =
        hasOptionalityDifferences || inputOptionality !== outputOptionality;

      if (
        // tsc performance tanks because of array auto-conversion, so it's disabled. Which
        // means that optional & non-optional types don't have a diff
        (generateContext.options.targetLanguage !== "ts" &&
          nestedType.type === "array") ||
        nestedType.type === "number" ||
        nestedType.type === "date" ||
        nestedType.type === "boolean"
      ) {
        // These types convert between various inputs to the target type in the validator.
        hasOptionalityDifferences = true;
      }

      if (hasOptionalityDifferences) {
        return;
      }

      if (nestedType.type === "reference") {
        const resolvedRef = structureResolveReference(
          generateContext.structure,
          nestedType,
        );

        if (!includedTypes.includes(resolvedRef)) {
          includedTypes.push(resolvedRef);
          callback(resolvedRef);
        }
      }

      callback(nestedType);
    },
    {
      isInitialType: true,
    },
  );

  typeOptionalityCache.set(type, hasOptionalityDifferences);

  return hasOptionalityDifferences;
}
