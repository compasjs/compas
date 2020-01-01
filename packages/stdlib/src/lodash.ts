import lodashMerge from "lodash.merge";

/**
 * Check if provided value is null or undefined with a typescript type guard
 * @param value
 */
export function isNil<T>(value: T | null | undefined): value is T {
  return value === undefined || value === null;
}

/**
 * A not completely bullet proof way to check if the provided object is a Plain JSON object
 * @param obj
 */
export function isPlainObject(obj: any): boolean {
  return (
    typeof obj === "object" &&
    obj !== null &&
    obj.constructor === Object &&
    Object.prototype.toString.call(obj) === "[object Object]"
  );
}

export const merge = lodashMerge;
