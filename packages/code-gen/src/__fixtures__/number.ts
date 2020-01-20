import { V } from "../fluent/validator";

export function registerNumberSchemas() {
  return [
    V.number()
      .name("NumberSimple")
      .toSchema(),

    V.number()
      .name("NumberInteger")
      .integer()
      .toSchema(),

    V.number()
      .name("NumberOneOf")
      .oneOf(1, 2, 3)
      .toSchema(),

    V.number()
      .name("NumberConvert")
      .convert()
      .toSchema(),

    V.number()
      .name("NumberOptional")
      .optional()
      .toSchema(),

    V.number()
      .name("NumberMinMax")
      .min(1)
      .max(5)
      .toSchema(),
  ];
}
