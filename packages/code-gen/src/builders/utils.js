import { isNil, isPlainObject } from "@compas/stdlib";
import { ArrayType } from "./ArrayType.js";
import { BooleanType } from "./BooleanType.js";
import { NumberType } from "./NumberType.js";
import { ObjectType } from "./ObjectType.js";
import { StringType } from "./StringType.js";

/**
 * @param value
 * @returns {value is
 *   Omit<import("../generated/common/types").ExperimentalNamedTypeDefinition,
 *   "name"|"group"> & { name: string, group: string,
 *   }}
 */
export function isNamedTypeBuilderLike(value) {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    typeof value.type === "string" &&
    typeof value.group === "string" &&
    typeof value.name === "string"
  );
}

/**
 * Either calls TypeBuilder#build or infers one of the following types:
 * - boolean oneOf
 * - number oneOf
 * - string oneOf
 * - array
 * - object
 *
 * @param {any} value
 * @returns {any}
 */
export function buildOrInfer(value) {
  if (typeof value === "boolean") {
    return new BooleanType().oneOf(value).build();
  } else if (typeof value === "number") {
    return new NumberType().oneOf(value).build();
  } else if (typeof value === "string") {
    return new StringType().oneOf(value).build();
  } else if (
    !isNil(value) &&
    "build" in value &&
    typeof value.build === "function"
  ) {
    return value.build();
  } else if (isPlainObject(value)) {
    return new ObjectType().keys(value).build();
  } else if (Array.isArray(value) && value.length === 1) {
    return new ArrayType().values(value[0]).build();
  } else if (typeof value === "function") {
    throw new Error(
      `Can't infer type of function. Did you forget to call '${
        value?.name ?? "anonymous"
      }'?`,
    );
  } else if (Array.isArray(value) && value.length !== 1) {
    throw new Error(
      `Inferred arrays can only have a single element. Found '${value}' which has ${value.length} elements.
      If you want to use more types in an array you could use \`T.anyOf()\` or consider using an object.`,
    );
  }

  throw new Error(`Could not infer type of '${value}'`);
}
