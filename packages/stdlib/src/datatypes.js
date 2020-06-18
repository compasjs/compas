import { v4 } from "./vendor/uuid.js";

/**
 * @function
 * @returns {string}
 */
export const uuid = v4;

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
