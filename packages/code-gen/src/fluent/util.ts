import { ValidatorLikeSchema, ValidatorSchema } from "./types";

export function validatorLikeToValidator(
  v: ValidatorLikeSchema,
): ValidatorSchema {
  if ("type" in v) {
    return v;
  } else {
    return v.toSchema();
  }
}
