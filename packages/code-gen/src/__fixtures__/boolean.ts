import { V } from "../fluent/validator";

export function registerBooleanSchemas() {
  return [
    V.boolean()
      .name("BooleanSimple")
      .toSchema(),

    V.boolean()
      .name("BooleanOneOf")
      .oneOf(true)
      .toSchema(),

    V.boolean()
      .name("BooleanConvert")
      .convert()
      .toSchema(),

    V.boolean()
      .name("BooleanOptional")
      .optional()
      .toSchema(),
  ];
}
