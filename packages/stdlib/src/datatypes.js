// @ts-nocheck

import { randomUUID } from "node:crypto";

/**
 * This function also has an `uuid.isValid` function, which returns a boolean depending
 * on if the passed in string is a valid uuid.
 *
 * @since 0.1.0
 * @summary Returns a new uuid v4
 *
 * @type {import("../types/advanced-types").UuidFunc}
 */
export const uuid = randomUUID;

/**
 * @param {any} value
 * @returns {boolean}
 */
uuid.isValid = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  if (value.length !== 36) {
    return false;
  }

  return /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$/gi.test(
    value,
  );
};
