import { V } from "../fluent/validator";

export function registerReferenceSchemas() {
  return [
    V.bool()
      .name("Foo")
      .toSchema(),

    V.ref("Foo")
      .name("ReferenceSimple")
      .toSchema(),

    V.ref()
      .name("ReferenceOptional")
      .set("Foo")
      .optional()
      .toSchema(),
  ];
}
