import { isNil, isPlainObject } from "@lightbase/stdlib";

export const format = (maxDepth: number, args: any[]): any => {
  const result = {};
  for (const arg of args) {
    if (typeof arg === "object" && Array.isArray(arg)) {
      throw new TypeError("Toplevel arrays are not supported.");
    }
    recursiveFlattenObject(arg, maxDepth, result);
  }

  return result;
};

export const recursiveFlattenObject = (
  obj: any | any[],
  availableDepth: number,
  result: any,
) => {
  if (availableDepth === 0 && typeof obj === "object") {
    return;
  }
  if (isNil(obj)) {
    return;
  }

  if (typeof obj !== "object") {
    if (!result.message) {
      result.message = String(obj);
    } else {
      result.message += " " + String(obj);
    }
    return;
  }

  const keys: string[] = isPlainObject(obj)
    ? Object.keys(obj)
    : Object.getOwnPropertyNames(obj);

  for (const key of keys) {
    if (!Object.hasOwnProperty.call(obj, key)) {
      continue;
    }

    const val = obj[key];
    if (typeof val === "object" && Array.isArray(val)) {
      result[key] = [];
      for (const it of val as any[]) {
        const intermediate = {};
        recursiveFlattenObject(it, availableDepth - 1, intermediate);
        result[key].push(intermediate);
      }
    } else if (typeof val === "object") {
      result[key] = {};
      recursiveFlattenObject(val, availableDepth - 1, result[key]);
    } else {
      result[key] = val;
    }
  }
};
