import { typeTargetsDetermine, typeTargetsGetUsed } from "./targets.js";

/**
 * Cache to check if for the provided type we already have generated a variant.
 *
 * For each type, we can save multiple generated type names based on the different input
 * options.
 *
 * @type {WeakMap<import("../generated/common/types").ExperimentalTypeSystemDefinition,
 *   Record<string, string>>}
 */
const typeCache = new WeakMap();

/**
 * Add a cache entry for the type and its options to resolve to the generated type name.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {import("./generator").GenerateTypeOptions} options
 * @param {string} name
 */
export function typesCacheAdd(generateContext, type, options, name) {
  const typeTargets = typeTargetsDetermine(generateContext, type);
  const usedTargets = typeTargetsGetUsed(typeTargets, options.targets);

  let existingSubCache = typeCache.get(type);
  if (!existingSubCache) {
    existingSubCache = {};
    typeCache.set(type, existingSubCache);
  }

  const cacheKey = typeCacheFormatKey({
    ...options,
    targets: usedTargets,
  });
  existingSubCache[cacheKey] = name;
}

/**
 * Get a cache entry for the type and its option to resolve the generated type name if it
 * already exists.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {import("./generator").GenerateTypeOptions} options
 * @returns {string|undefined} name
 */
export function typesCacheGet(generateContext, type, options) {
  const typeTargets = typeTargetsDetermine(generateContext, type);
  const usedTargets = typeTargetsGetUsed(typeTargets, options.targets);

  const subCache = typeCache.get(type);

  if (!subCache) {
    return undefined;
  }

  const cacheKey = typeCacheFormatKey({
    ...options,
    targets: usedTargets,
  });

  return subCache[cacheKey];
}

/**
 * Get the already used type names for the provided type.
 *
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @returns {string[]}
 */
export function typesCacheGetUsedNames(type) {
  const subCache = typeCache.get(type);

  return Object.values(subCache ?? {});
}

/**
 * Stable format of a cache key based on the options.
 *
 * @param {import("./generator").GenerateTypeOptions} options
 * @returns {string}
 */
function typeCacheFormatKey(options) {
  return `${options.validatorState}-${JSON.stringify(options.targets)}-${
    options.nameSuffix
  }`;
}
