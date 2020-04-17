import { anyType } from "./any/index.js";
import { anyOfType } from "./anyOf/index.js";
import { arrayType } from "./array/index.js";
import { booleanType } from "./boolean/index.js";
import { genericType } from "./generic/index.js";
import { numberType } from "./number/index.js";
import { objectType } from "./object/index.js";
import { referenceType } from "./reference/index.js";
import { stringType } from "./string/index.js";

export { TypeBuilder, TypeCreator } from "./TypeBuilder.js";

export const coreTypes = [
  anyType,
  anyOfType,
  arrayType,
  booleanType,
  genericType,
  numberType,
  objectType,
  referenceType,
  stringType,
];
