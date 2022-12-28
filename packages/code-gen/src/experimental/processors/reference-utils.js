import { isNil } from "@compas/stdlib";
import { structureResolveReference } from "./structure.js";

/**
 * Resolve some property from the provided type, prioritizing the settings on the
 * reference type and then checking the referenced type. Can be called even if the type
 * is not a reference.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {string[]} accessPath
 * @param {any} [defaultValue]
 * @returns {any}
 */
export function referenceUtilsGetProperty(
  generateContext,
  type,
  accessPath,
  defaultValue,
) {
  const resolvePath = (type, path) => {
    for (const p of path) {
      type = type?.[p];
    }

    return type;
  };

  const result = [resolvePath(type, accessPath)];

  if (type.type === "reference") {
    const ref = structureResolveReference(generateContext.structure, type);

    result.push(resolvePath(ref, accessPath));
  }

  if (!isNil(defaultValue)) {
    result.push(defaultValue);
  }

  return result[0] || result[1] || result[2];
}
