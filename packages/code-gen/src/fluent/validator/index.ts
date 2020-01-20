import { ArrayValidator } from "./ArrayValidator";
import { BooleanValidator } from "./BooleanValidator";
import { NumberValidator } from "./NumberValidator";
import { ObjectValidator } from "./ObjectValidator";
import { OneOfValidator } from "./OneOfValidator";
import { RefValidator } from "./RefValidator";
import { StringValidator } from "./StringValidator";

export const V = {
  number() {
    return new NumberValidator();
  },
  bool() {
    return new BooleanValidator();
  },
  boolean() {
    return new BooleanValidator();
  },
  string() {
    return new StringValidator();
  },
  object(...args: ConstructorParameters<typeof ObjectValidator>) {
    return new ObjectValidator(...args);
  },
  array() {
    return new ArrayValidator();
  },
  oneOf(...args: ConstructorParameters<typeof OneOfValidator>) {
    return new OneOfValidator(...args);
  },
  ref(...args: ConstructorParameters<typeof RefValidator>) {
    return new RefValidator(...args);
  },
};
