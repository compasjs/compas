import { makeError } from "../errors";

/**
 * All supported options for StringValidation
 *
 * When optional = true the property is ignored if it doesn't exist
 * When convert = true the value will be converted via the String constructor
 * When trim = true the string will be trimmed at both start and end.
 * When length is set the following must hold true length[0] <= input.length <= length[1]
 * Note that the length check will be after trim
 * If oneOf is set the string must strict equal to one of the provided values
 * if pattern is set the input string is tested
 *
 * optional, trim and convert are by default false
 * only one of 'oneOf' and 'pattern' can be set
 * and if oneOf is set at least a single argument must be provided.
 * These are enforced in stringSetDefaults
 *
 */
export interface StringValidation {
  type: "string";
  optional?: boolean;
  convert?: boolean;
  length?: [number, number];
  pattern?: RegExp;
  trim?: boolean;
  oneOf?: string[];
}

export function stringSetDefaults(schema: StringValidation) {
  schema.optional = schema.optional === undefined ? false : schema.optional;
  schema.trim = schema.trim === undefined ? false : schema.trim;
  schema.convert = schema.convert === undefined ? false : schema.convert;

  if (schema.oneOf !== undefined && schema.pattern !== undefined) {
    throw new Error(
      "Invalid string schema. Can't have both oneOf and pattern.",
    );
  }

  if (schema.oneOf !== undefined && schema.oneOf.length === 0) {
    throw new Error(
      "Invalid string schema. oneOf should have at least a single specified.",
    );
  }
}

export function stringGenerateType(
  name: string,
  schema: StringValidation,
): string {
  let result = name;
  result += schema.optional ? "?: " : ": ";

  if (schema.oneOf && schema.oneOf.length > 0) {
    result += schema.oneOf.map(it => `"${it}"`).join(" | ");
  } else {
    result += "string";
  }

  result += ";";

  return result;
}

export function stringGenerateValidation(
  key: string,
  { optional, convert, trim, length, oneOf, pattern }: StringValidation,
): string {
  const value = `data["${key}"]`;
  const src: string[] = [];

  if (!optional) {
    src.push(`if (isNil(${value})) {`, makeError("any.required", { key }), "}");
  }

  src.push(`if (!isNil(${value})) {`);

  if (convert) {
    src.push(`${value} = String(${value});`);
  }

  src.push(
    `if (typeof ${value} !== "string") {`,
    makeError("typeError", { key, expected: "string" }),
    "}",
  );

  if (trim) {
    src.push(`${value} = (${value} as string).trim()`);
  }

  if (length !== undefined) {
    src.push(
      `if (${value}.length < ${length[0]} || ${value}.length > ${length[1]}) {`,
      makeError("string.length", { min: length[0], max: length[1], key }),
      "}",
    );
  }

  if (oneOf !== undefined) {
    src.push(
      `if (${oneOf.map(it => `${value} !== "${it}"`).join(" && ")}) {`,
      makeError("string.oneOf", {
        key,
        oneOf: oneOf.map(it => `'${it}'`).join(", "),
      }),
      "}",
    );
  }

  if (pattern !== undefined) {
    const patternSrc = `/${pattern.source}/${pattern.flags}`;
    src.push(
      `if (!${patternSrc}.test(${value})) {`,
      makeError("string.pattern", { key }),
      "}",
    );
  }

  src.push("}");

  return src.join("\n");
}
