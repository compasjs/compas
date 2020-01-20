import { V } from "../partials";
import { createSchema } from "../schemaRegistry";

export function registerStringSchemas() {
  createSchema("StringSimple", V.string());
  createSchema(
    "StringMinMax",
    V.string()
      .min(1)
      .max(5),
  );
  createSchema("StringOneOf", V.string().oneOf("foo", "bar"));
  createSchema("StringConvert", V.string().convert());
  createSchema("StringOptional", V.string().optional());
  createSchema("StringTrim", V.string().trim());
  createSchema("StringUpperCase", V.string().upperCase());
  createSchema("StringLowerCase", V.string().lowerCase());
  createSchema("StringPattern", V.string().pattern(/^[a-z]{4}\d{2}$/i));
}
