import { V } from "../fluent/validator";

export function registerObjectSchemas() {
  return [
    V.object({ foo: V.bool() })
      .name("ObjectSimple")
      .toSchema(),

    V.object({ foo: V.bool() })
      .optional()
      .name("ObjectOptional")
      .toSchema(),

    V.object()
      .key("foo", V.bool())
      .name("ObjectKey")
      .toSchema(),

    V.object()
      .keys({ foo: V.bool() })
      .name("ObjectKeys")
      .toSchema(),

    V.object({ foo: V.bool() })
      .strict()
      .name("ObjectStrict")
      .toSchema(),
  ];
}
