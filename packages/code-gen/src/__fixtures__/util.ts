import { unlinkSync } from "fs";
import { join } from "path";
import { resetSchemas, runGenerators } from "../schemaRegistry";

/**
 * Require fixture, run generators and require the resulting file.
 */
export function loadValidators(name: string): any {
  const filePath = join(__dirname, name.toLowerCase() + ".test-gen.ts");

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const generator = require(`./${name.toLowerCase()}`);
  generator[`register${name}Schemas`]();

  runGenerators(filePath);
  resetSchemas();
  return require(filePath);
}

export function removeValidators(name: string) {
  const filePath = join(__dirname, name.toLowerCase() + ".test-gen.ts");
  unlinkSync(filePath);
}

/**
 * Loads the specified Validator and the ValidationError class
 */
export function getValidator(
  validators: any,
  name: string,
): {
  err: { new (...args: any[]): any };
  validator: (value: unknown) => any;
} {
  const validator = validators[name];
  const err = validators["ValidationError"];

  // @ts-ignore
  global.expect(err.constructor).toBeDefined();

  // @ts-ignore
  global.expect(validator).toBeDefined();
  // @ts-ignore
  global.expect(typeof validator).toBe("function");
  // @ts-ignore
  global.expect(validator.length).toBe(1);

  return {
    err,
    validator,
  };
}
