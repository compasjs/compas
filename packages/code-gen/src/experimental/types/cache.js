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
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {import("./generator").GenerateTypeOptions} options
 * @param {string} name
 */
export function typesCacheAdd(type, options, name) {
  let existingSubCache = typeCache.get(type);
  if (!existingSubCache) {
    existingSubCache = {};
    typeCache.set(type, existingSubCache);
  }

  const cacheKey = typeCacheFormatKey(options);
  existingSubCache[cacheKey] = name;
}

/**
 * Get a cache entry for the type and its option to resolve the generated type name if it
 * already exists.
 *
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {import("./generator").GenerateTypeOptions} options
 * @returns {string|undefined} name
 */
export function typesCacheGet(type, options) {
  const subCache = typeCache.get(type);

  if (!subCache) {
    return undefined;
  }

  const cacheKey = typeCacheFormatKey(options);

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

  return Object.keys(subCache ?? {});
}

/**
 * Stable format of a cache key based on the options.
 *
 * @param {import("./generator").GenerateTypeOptions} options
 * @returns {string}
 */
function typeCacheFormatKey(options) {
  return `${options.validatorState}-${JSON.stringify(options.typeOverrides)}-${
    options.nameSuffix
  }`;
}
