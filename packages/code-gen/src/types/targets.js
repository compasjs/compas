import { fileImplementations } from "../processors/file-implementations.js";
import { structureResolveReference } from "../processors/structure.js";
import { typeDefinitionTraverse } from "../processors/type-definition-traverse.js";

/**
 * Cache to check if for the provided type we already have resolved the used targets.
 *
 * @type {WeakMap<import("../generated/common/types.js").StructureTypeSystemDefinition,
 *   Array<import("../generated/common/types.d.ts").StructureAnyDefinitionTarget>>}
 */
const typeTargetCache = new WeakMap();

/** @type {Array<import("../generated/common/types.js").StructureAnyDefinitionTarget>} */
// @ts-expect-error Don't care about this error
const fileTargets = Object.keys(fileImplementations);

/**
 * Recursively check which targets are used by the provided type, including the
 * references.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureTypeSystemDefinition} type
 * @returns {Array<import("../generated/common/types.js").StructureAnyDefinitionTarget>}
 */
export function typeTargetsDetermine(generateContext, type) {
  if (typeTargetCache.has(type)) {
    return typeTargetCache.get(type) ?? [];
  }

  const targets = new Set();

  /** @type {any} */
  const includedTypes = [type];

  typeDefinitionTraverse(
    type,
    (nestedType, callback) => {
      if (nestedType.type === "file") {
        for (const fileTarget of fileTargets) {
          targets.add(fileTarget);
        }
      } else if (nestedType.type === "any") {
        for (const key of Object.keys(nestedType.targets ?? {})) {
          targets.add(key);
        }
      } else if (nestedType.type === "reference") {
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

  const result = [...targets];
  typeTargetCache.set(type, result);

  return result;
}

/**
 * Filter out the targets that will be used based on the targets that the type provides
 * special handling for and which targets can be used by the provider.
 *
 * Does not alter the order of the provided {@link usedTargetsByGenerator} array.
 *
 * @param {Array<import("../generated/common/types.js").StructureAnyDefinitionTarget>} availableTargetsInType
 * @param {Array<import("../generated/common/types.js").StructureAnyDefinitionTarget>} usedTargetsByGenerator
 * @returns {Array<import("../generated/common/types.js").StructureAnyDefinitionTarget>}
 */
export function typeTargetsGetUsed(
  availableTargetsInType,
  usedTargetsByGenerator,
) {
  return usedTargetsByGenerator.filter((it) =>
    availableTargetsInType.includes(it),
  );
}
