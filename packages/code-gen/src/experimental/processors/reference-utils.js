import { structureResolveReference } from "./structure.js";

/**
 * Resolve some property from the provided type, prioritizing the settings on the
 * reference type and then checking the referenced type. Can be called even if the type
 * is not a reference.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {(string|number)[]} accessPath
 * @param {any} [defaultValue]
 * @returns {any}
 */
export function referenceUtilsGetProperty(
  generateContext,
  type,
  accessPath,
  defaultValue,
) {
  // TODO(perf): a quick optimization may be to create specialized functions for specific
  //   'accessPaths'. This way we skip this dynamic function + loop.
  const resolvePath = (type, path) => {
    for (const p of path) {
      type = type?.[p];
    }

    return type;
  };

  const valueA = resolvePath(type, accessPath);
  let valueB;
  const valueC = defaultValue;

  if (type.type === "reference") {
    const ref = structureResolveReference(generateContext.structure, type);

    valueB = resolvePath(ref, accessPath);
  }

  return valueA || valueB || valueC;
}
