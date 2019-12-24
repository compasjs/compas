import { makeError } from "../errors";

/**
 * All supported options for NumberValidation
 * When optional = true the property is ignored if it doesn't exist
 * When integer = true only integer values are accepted
 * When convert = true it will try to parse it via the Number constructor
 * when it returns NaN an error will be thrown
 * When between is set the following must hold true between[0] <= input <= between[1]
 *
 *  convert, optional and integer are by default false which is set by numberSetDefaults
 */
export interface NumberValidation {
  type: "number";
  optional?: boolean;
  between?: [number, number];
  integer?: boolean;
  convert?: boolean;
}

export function numberSetDefaults(schema: NumberValidation) {
  schema.convert = schema.convert === undefined ? false : schema.convert;
  schema.optional = schema.optional === undefined ? false : schema.optional;
  schema.integer = schema.integer === undefined ? false : schema.integer;
}

export function numberGenerateType(
  name: string,
  schema: NumberValidation,
): string {
  let result = name;
  result += schema.optional ? "?: " : ": ";

  result += "number;";

  return result;
}

export function numberGenerateValidation(
  key: string,
  { optional, convert, integer, between }: NumberValidation,
): string {
  const value = `data["${key}"]`;
  const src: string[] = [];

  if (!optional) {
    src.push(`if (isNil(${value})) {`, makeError("any.required", { key }), "}");
  }

  src.push(`if (!isNil(${value})) {`);

  if (convert) {
    src.push(`${value} = Number(${value});`);
    src.push(
      `if (isNaN(${value})) {`,
      makeError("number.invalid", { key }),
      "}",
    );
  }

  src.push(
    `if (typeof ${value} !== "number") {`,
    makeError("typeError", { key, expected: "number" }),
    "}",
  );

  if (integer) {
    src.push(
      `if (!Number.isInteger(${value})) {`,
      makeError("number.integer", { key }),
      "}",
    );
  }

  if (between !== undefined) {
    src.push(
      `if (${value} < ${between[0]} || ${value} > ${between[1]}) {`,
      makeError("number.between", { min: between[0], max: between[1], key }),
      "}",
    );
  }

  src.push("}");

  return src.join("\n");
}
