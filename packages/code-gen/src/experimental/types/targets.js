import { structureResolveReference } from "../processors/structure.js";
import { typeDefinitionTraverse } from "../processors/type-definition-traverse.js";

/**
 * Cache to check if for the provided type we already have resolved the used targets.
 *
 * @type {WeakMap<import("../generated/common/types").ExperimentalTypeSystemDefinition,
 *   import("../generated/common/types").ExperimentalAnyDefinitionTarget[]>}
 */
const typeCache = new WeakMap();

/** @type {import("../generated/common/types").ExperimentalAnyDefinitionTarget[]} */
const fileTargets = [
  "jsAxiosNode",
  "jsKoa",
  "tsAxiosBrowser",
  "tsAxiosReactNative",
];

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @returns {import("../generated/common/types").ExperimentalAnyDefinitionTarget[]}
 */
export function typeTargetsDetermine(generateContext, type) {
  if (typeCache.has(type)) {
    return typeCache.get(type) ?? [];
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
  typeCache.set(type, result);

  return result;
}

/**
 * Filter out the targets that will be used based on the targets that the type provides special handling for and which targets can be used by the provider.
 *
 * Does not alter the order of the provided {@link usedTargetsByGenerator} array.
 *
 * @param {import("../generated/common/types").ExperimentalAnyDefinitionTarget[]} availableTargetsInType
 * @param {import("../generated/common/types").ExperimentalAnyDefinitionTarget[]} usedTargetsByGenerator
 * @returns {import("../generated/common/types").ExperimentalAnyDefinitionTarget[]}
 */
export function typeTargetsGetUsed(
  availableTargetsInType,
  usedTargetsByGenerator,
) {
  return usedTargetsByGenerator.filter((it) =>
    availableTargetsInType.includes(it),
  );
}
