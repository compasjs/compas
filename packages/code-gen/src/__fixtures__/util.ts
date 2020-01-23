import { writeFileSync } from "fs";
import { join } from "path";
import { generateValidatorStringFromValidators } from "../validator";

/**
 * Require fixture, run generators and require the resulting file.
 */
export function loadValidators(name: string): any {
  const filePath = join(__dirname, name.toLowerCase() + ".test-gen.ts");

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const generator = require(`./${name.toLowerCase()}`);
  const validators = generator[`register${name}Schemas`]();

  const output = generateValidatorStringFromValidators(validators);
  writeFileSync(filePath, output);

  return require(filePath);
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
