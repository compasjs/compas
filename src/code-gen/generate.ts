import { CONFIG } from "../config";
import { Logger } from "../insight";
import { isNil } from "../stdlib";
import { writeFileSync } from "fs";
import { join } from "path";
import { get } from "./util";
import {
  generateValidator,
  getBaseValidatorOutput,
  optsSetDefaults,
  schemaSetDefaults,
  ValidationOptions,
  ValidationSchema,
} from "./validation";

interface Store {
  validations: Record<
    string,
    {
      opts: ValidationOptions;
      schema: ValidationSchema;
    }
  >;
}

const generationStore: Store = {
  validations: {},
};

/**
 * Require input file
 * Generate all data
 * Store at output directory
 */
export function runCodeGen(logger: Logger) {
  const { input, output } = get(CONFIG).getConfigValue("codegen");
  if (isNil(input) || isNil(output)) {
    throw new Error(
      `Make sure to set { codegen: {input: "./src/gen/index.ts", output: "./src/generated" } } in your config files`,
    );
  }

  require(input);
  runForValidators(logger, output);
}

function runForValidators(logger: Logger, output: string) {
  logger.info(
    "Running generation for",
    Object.keys(generationStore.validations),
    "validators",
  );

  const validatorOutput = getBaseValidatorOutput();

  Object.entries(generationStore.validations).forEach(
    ([key, { opts, schema }]) => {
      generateValidator(key, schema, opts);
    },
  );

  writeFileSync(join(output, "validator.ts"), validatorOutput);
}

/**
 * Create a new validator
 *
 * Note that a reference is kept before the generator it self will run.
 *
 * So if you want to modify an argument for later validators, make sure to create a copy
 */
export function createValidator(
  name: string,
  schema: ValidationSchema,
  opts: ValidationOptions = { strict: true },
) {
  optsSetDefaults(opts);
  schemaSetDefaults(schema);

  generationStore.validations[name] = {
    opts,
    schema,
  };
}
