import { Config, CONFIG } from "../config";
import { get as slGet } from "../service-locator";

type Container = {
  [CONFIG]: Config<{
    codegen: {
      input: string;
      output: string;
    };
  }>;
};

// Type friendly wrapper
export function get<K extends keyof Container>(key: K) {
  return slGet<Container, K>(key);
}
