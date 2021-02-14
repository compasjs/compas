import crypto from "crypto";
import { v4 } from "./vendor/uuid.js";

/**
 * Vendor uuid v4 generator from uuidjs/uuid.
 * If we are on Node.js 15 or above, we use the built-in import("crypto").randomUUID.
 * This variant is a bit faster and allows us to drop the vendor code.
 * This function also has an `uuid.isValid` function, which returns a boolean depending
 * on if the passed in string is a valid uuid.
 *
 * @since 0.1.0
 * @summary Returns a new uuid v4
 *
 * @function
 * @returns {string}
 */
export const uuid =
  typeof crypto.randomUUID === "function" ? crypto.randomUUID : v4;

/**
 * @param {*} value
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
