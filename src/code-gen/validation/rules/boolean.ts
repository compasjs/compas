import { makeError } from "../errors";

/**
 * All supported options for BooleanValidation
 * When optional = true the property is ignored if it doesn't exist
 * When convert = true conversion will happen for the following:
 *  - [0, "false", false] -> false
 *  - [1, "true", true] -> true
 *
 *  optional and convert are by default false which is set by booleanSetDefaults
 */
export interface BooleanValidation {
  type: "boolean";
  optional?: boolean;
  convert?: boolean;
}

export function booleanSetDefaults(schema: BooleanValidation) {
  schema.optional = schema.optional === undefined ? false : schema.optional;
  schema.convert = schema.convert === undefined ? false : schema.convert;
}

export function booleanGenerateType(
  name: string,
  schema: BooleanValidation,
): string {
  return `${name}${schema.optional ? "?" : ""}: boolean;`;
}

export function booleanGenerateValidation(
  key: string,
  { optional, convert }: BooleanValidation,
): string {
  const value = `data["${key}"]`;
  const src: string[] = [];

  if (!optional) {
    src.push(`if (isNil(${value})) {`, makeError("any.required", { key }), "}");
  }

  src.push(`if (!isNil(${value})) {`);

  if (convert) {
    src.push(
      `if (${value} === 1 || ${value} === true || ${value} === "true") {`,
      `${value} = true;`,
      "}",
    );
    src.push(
      `if (${value} === 0 || ${value} === false || ${value} === "false") {`,
      `${value} = false;`,
      "}",
    );
  }

  src.push(
    `if (typeof ${value} !== "boolean") {`,
    makeError("typeError", { key, expected: "boolean" }),
    "}",
  );

  src.push("}");

  return src.join("\n");
}
