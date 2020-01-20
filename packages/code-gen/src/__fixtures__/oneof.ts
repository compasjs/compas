import { V } from "../fluent/validator";

export function registerOneOfSchemas() {
  return [
    V.oneOf()
      .name("OneOfSimple")
      .add(V.bool())
      .toSchema(),

    V.oneOf()
      .name("OneOfOptional")
      .add(V.bool())
      .optional()
      .toSchema(),

    V.oneOf()
      .name("OneOfMultiple")
      .add(V.bool(), V.number())
      .toSchema(),
  ];
}
