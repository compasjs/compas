import { ArrayValidator } from "./ArrayValidator";
import { BooleanValidator } from "./BooleanValidator";
import { NumberValidator } from "./NumberValidator";
import { ObjectValidator } from "./ObjectValidator";
import { OneOfValidator } from "./OneOfValidator";
import { RefValidator } from "./RefValidator";
import { StringValidator } from "./StringValidator";

type ProxyFunctions = { [K in keyof typeof V]: typeof V[K] };

export function V(name: string) {
  const keys: (keyof typeof V)[] = Object.keys(V) as any;
  const proxy: ProxyFunctions = {} as any;

  for (const key of keys) {
    // @ts-ignore
    proxy[key] = (...args: any[]) => {
      // @ts-ignore
      const v = V[key](...args);
      v.name(name);
      return v;
    };
  }

  return proxy;
}

V.number = function() {
  return new NumberValidator();
};

V.bool = function() {
  return V.boolean();
};

V.boolean = function() {
  return new BooleanValidator();
};

V.string = function() {
  return new StringValidator();
};

V.array = function() {
  return new ArrayValidator();
};

V.object = function(...args: ConstructorParameters<typeof ObjectValidator>) {
  return new ObjectValidator(...args);
};

V.oneOf = function(...args: ConstructorParameters<typeof OneOfValidator>) {
  return new OneOfValidator(...args);
};

V.ref = function(...args: ConstructorParameters<typeof RefValidator>) {
  return new RefValidator(...args);
};
