import { createValidator } from "@lbu/validator";

createValidator("TestInterfaceValidation", {
  foo: { type: "string", oneOf: ["bar"] },
});
