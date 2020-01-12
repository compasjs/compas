import { createValidator } from "@lbu/validator";

createValidator("Test{{template}}", {
  foo: { type: "string", oneOf: ["bar"] },
});
