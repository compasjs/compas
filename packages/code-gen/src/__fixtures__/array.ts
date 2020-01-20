import { V } from "../fluent/validator";

export function registerArraySchemas() {
  return [
    V.array()
      .name("ArraySimple")
      .values(V.bool())
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
