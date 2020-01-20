import { V } from "../fluent/validator";

export function registerStringSchemas() {
  return [
    V.string()
      .name("StringSimple")
      .toSchema(),

    V.string()
      .name("StringMinMax")
      .min(1)
      .max(5)
      .toSchema(),

    V.string()
      .name("StringOneOf")
      .oneOf("foo", "bar")
      .toSchema(),

    V.string()
      .name("StringConvert")
      .convert()
      .toSchema(),

    V.string()
      .name("StringOptional")
      .optional()
      .toSchema(),

    V.string()
      .name("StringTrim")
      .trim()
      .toSchema(),

    V.string()
      .name("StringUpperCase")
      .upperCase()
      .toSchema(),

    V.string()
      .name("StringLowerCase")
      .lowerCase()
      .toSchema(),

    V.string()
      .name("StringPattern")
      .pattern(/^[a-z]{4}\d{2}$/i)
      .toSchema(),
  ];
}
