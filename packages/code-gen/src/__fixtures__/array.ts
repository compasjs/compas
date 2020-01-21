import { V } from "../fluent/validator";

export function registerArraySchemas() {
  return [
    V("ArraySimple")
      .array()
      .values(V.boolean())
      .toSchema(),

    V.array()
      .name("ArrayConvert")
      .values(V.bool())
      .convert()
      .toSchema(),

    V.array()
      .name("ArrayOptional")
      .values(V.bool())
      .optional()
      .toSchema(),
  ];
}
