import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { CONFIG } from "../config";
import { Logger } from "../insight";
import { isNil } from "../stdlib";
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

  require(join(process.cwd(), input));

  const outDir = join(process.cwd(), output);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  runForValidators(logger, outDir);
}

function runForValidators(logger: Logger, output: string) {
  logger.info(
    "Running generation for",
    Object.keys(generationStore.validations).length,
    "validators",
  );

  let validatorOutput = getBaseValidatorOutput();

  Object.entries(generationStore.validations).forEach(
    ([key, { opts, schema }]) => {
      validatorOutput += generateValidator(key, schema, opts) + "\n";
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
