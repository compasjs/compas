import { Validator, ValidatorLike } from "../types";

export function validatorLikeToValidator(v: ValidatorLike): Validator {
  if ("type" in v) {
    return v;
  } else {
    return v.toSchema();
  }
}
