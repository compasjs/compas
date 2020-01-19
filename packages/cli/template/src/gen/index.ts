import { createSchema, V } from "@lbu/validator";

createSchema(
  "TestInterfaceValidation",
  V.object({
    foo: V.string().oneOf("bar"),
  }),
);
