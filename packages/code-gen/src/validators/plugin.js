import {
  addToTemplateContext,
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";

const init = async () => {
  addBuildErrorUtil();
  await compileTemplateDirectory(
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
};

const generate = data => ({
  path: "./validators.js",
  content: executeTemplate("validatorsFile", data),
});

/**
 * Generate validator functions with support for pre & post-validate hooks
 */
export const getPlugin = () => ({
  name: "validators",
  init,
  generate,
});

function addBuildErrorUtil() {
  // Note when using variables, you have to bring them in scope your self
  const errors = {
    /**
     * BOOLEAN
     */
    "boolean.undefined": "Expected '${propertyPath}' to be a boolean",
    "boolean.type": "Expected '${propertyPath}' to be a boolean",
    "boolean.oneOf": "Expected '${propertyPath}' to be '${oneOf}'",
    /**
     * NUMBER
     */
    "number.undefined": "Expected '${propertyPath}' to be a number",
    "number.type": "Expected '${propertyPath}' to be a number",
    "number.integer": "Expected '${propertyPath}' to be an integer",
    "number.min": "Expected '${propertyPath}' to be greater than '${min}'",
    "number.max": "Expected '${propertyPath}' to be smaller than '${max}'",
    "number.oneOf": "Expected '${propertyPath}' to be one of: '${oneOf}'",
    /**
     * STRING
     */
    "string.undefined": "Expected '${propertyPath}' to be a string",
    "string.type": "Expected '${propertyPath}' to be a string",
    "string.oneOf": "Expected '${propertyPath}' to be one of: '${oneOf}'",
    "string.min":
      "Expected '${propertyPath}' length to be greater than '${min}'",
    "string.max":
      "Expected '${propertyPath}' length to be smaller than '${max}'",
    "string.pattern": "Expected '${propertyPath}' to match pattern",
    /**
     * OBJECT
     */
    "object.undefined": "Expected '${propertyPath}' to be an object",
    "object.type": "Expected '${propertyPath}' to be an object",
    "object.strict":
      "Object at '${propertyPath}' has too many keys: [${extraKeys}]",
    /**
     * ARRAY
     */
    "array.undefined": "Expected '${propertyPath}' to be an array",
    "array.type": "Expected '${propertyPath}' to be an array",
    "array.min": "Expected '${propertyPath}' to be longer than '${min}'",
    "array.max": "Expected '${propertyPath}' to be shorter than '${max}'",
    /**
     * ANY OF
     */
    "anyOf.undefined": "Expected '${propertyPath}' to have a value",
    "anyOf.type": "'${stringErrors.join(\"' OR '\")}'",
    /**
     * REFERENCE
     */
    "reference.undefined": "Expected '${propertyPath}' to be defined",
  };

  addToTemplateContext("buildError", errorName => {
    if (!errors[errorName]) {
      throw new Error(`Missing ${errorName} in defined errors.`);
    }

    return (
      "throw new ValidationError(`" +
      errorName +
      "`, `" +
      errors[errorName] +
      "`);"
    );
  });
}
