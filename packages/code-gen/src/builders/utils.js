import { isPlainObject } from "@compas/stdlib";
import { ArrayType } from "./ArrayType.js";
import { BooleanType } from "./BooleanType.js";
import { NumberType } from "./NumberType.js";
import { ObjectType } from "./ObjectType.js";
import { StringType } from "./StringType.js";

/**
 * @param value
 * @returns {boolean}
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
 * @param {TypeBuilderLike} value
 * @return {*}
 */
export function buildOrInfer(value) {
  if (value.build && typeof value.build === "function") {
    return value.build();
  }

  if (typeof value === "boolean") {
    return new BooleanType().oneOf(value).build();
  } else if (typeof value === "number") {
    return new NumberType().oneOf(value).build();
  } else if (typeof value === "string") {
    return new StringType().oneOf(value).build();
  } else if (isPlainObject(value)) {
    return new ObjectType().keys(value).build();
  } else if (Array.isArray(value) && value.length !== 0) {
    return new ArrayType().values(value[0]).build();
  }
  throw new Error(`Could not infer type of '${value}'`);
}
