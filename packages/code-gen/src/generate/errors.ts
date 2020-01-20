export function getErrorClass(): string {
  // language=TypeScript
  return `
    export class ValidationError extends Error {
      static isValidationError(err: Error) {
        return err.name === "ValidationError";
      }

      /**
       * Error key used.
       */
      public readonly key: string;

      constructor(key: string, message: string) {
        super(message);

        Object.setPrototypeOf(this, ValidationError.prototype);
        this.name = this.constructor.name;
        this.key = key;
      }
    }
  `;
}

export const errors = {
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
  "string.min": "Expected '${propertyPath}' length to be greater than '${min}'",
  "string.max": "Expected '${propertyPath}' length to be smaller than '${max}'",
  "string.pattern": "Expected '${propertyPath}' to match pattern",
  /**
   * BOOLEAN
   */
  "boolean.undefined": "Expected '${propertyPath}' to be a boolean",
  "boolean.type": "Expected '${propertyPath}' to be a boolean",
  "boolean.oneOf": "Expected '${propertyPath}' to be '${oneOf}'",
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
  /**
   * OneOf
   */
  "oneOf.undefined": "Expected '${propertyPath}' to have a value",
  "oneOf.type": "'${stringErrors.join(\"' OR '\")}'",
  /**
   * REFERENCE
   */
  "reference.undefined": "Expected '${propertyPath}' to be defined",
};

export function buildError(errName: keyof typeof errors): string {
  return (
    "throw new ValidationError(\n`" +
    errName +
    "`,\n`" +
    errors[errName] +
    "`,\n);"
  );
}
