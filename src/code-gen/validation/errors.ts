// Static error strings
export const errors = {
  strict: "found more keys than expected",
  typeError: "property {key} should be of type {expected}",

  "any.required": "{key} is required",

  "base.null": "first argument is required and can not be null",
  "base.object": "first argument is required and should be an object",

  "number.invalid": "{key} is not a number",
  "number.integer": "{key} is not an integer",
  "number.between": "{key} should be between {min} and {max}",

  "string.length": "{key} should be between {min} and {max} characters",
  "string.oneOf": "{key} should be one of {oneOf}",
  "string.pattern": "{key} should match pattern",
};

/**
 * Create error to be used in the validators
 * Each entry in args will be replaced by the place holder
 *
 * Note: At some point we may want to use a custom Error
 */
export function makeError(
  errorName: keyof typeof errors,
  args: Record<string, string | number> = {},
) {
  let err = `throw new Error("${errorName}: ${errors[errorName]}");`;

  Object.entries(args).forEach(([key, value]) => {
    err = err.replace(new RegExp(`{${key}}`, "g"), String(value));
  });

  return err;
}
