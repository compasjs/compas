import { ArrayPartial } from "./ArrayPartial";
import { BooleanPartial } from "./BooleanPartial";
import { NumberPartial } from "./NumberPartial";
import { ObjectPartial } from "./ObjectPartial";
import { OneOfPartial } from "./OneOfPartial";
import { RefPartial } from "./RefPartial";
import { StringPartial } from "./StringPartial";

export const V = {
  number() {
    return new NumberPartial();
  },
  bool() {
    return new BooleanPartial();
  },
  boolean() {
    return new BooleanPartial();
  },
  string() {
    return new StringPartial();
  },
  object(...args: ConstructorParameters<typeof ObjectPartial>) {
    return new ObjectPartial(...args);
  },
  array() {
    return new ArrayPartial();
  },
  oneOf(...args: ConstructorParameters<typeof OneOfPartial>) {
    return new OneOfPartial(...args);
  },
  ref(...args: ConstructorParameters<typeof RefPartial>) {
    return new RefPartial(...args);
  },
};
