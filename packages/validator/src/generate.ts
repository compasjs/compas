import { Logger } from "@lightbase/insight";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { makeError } from "./errors";
import {
  generators,
  getBaseValidatorOutput,
  optsSetDefaults,
  schemaSetDefaults,
  ValidationOptions,
  ValidationSchema,
} from "./util";

const loggerType = "LBF:VALIDATOR";

const logger = new Logger(3, { type: loggerType });

type ValidatorStore = Record<
  string,
  {
    opts: ValidationOptions;
    schema: ValidationSchema;
  }
>;

const generationStore: ValidatorStore = {};

/**
 * Require input file
 * Generate all data
 * Store at output file
 */
export function runCodeGen(inputFile: string, outputFile: string) {
  require(inputFile);

  const outDir = outputFile.substring(0, outputFile.lastIndexOf("/"));
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  runForValidators(outDir);
}

function runForValidators(output: string) {
  logger.info(
    "Running generation for",
    Object.keys(generationStore).length,
    "validators",
  );

  let validatorOutput = getBaseValidatorOutput();

  Object.entries(generationStore).forEach(([key, { opts, schema }]) => {
    validatorOutput += generateValidator(key, schema, opts) + "\n";
  });

  writeFileSync(join(output, "validator.ts"), validatorOutput);
}

/**
 * Create a new validator
 * Note that a reference is kept before the generator it self will run.
 * So if you want to modify an argument for later validators, make sure to create a copy
 */
export function createValidator(
  name: string,
  schema: ValidationSchema,
  opts: ValidationOptions = { strict: true },
) {
  optsSetDefaults(opts);
  schemaSetDefaults(schema);

  generationStore[name] = {
    opts,
    schema,
  };
}

export function generateValidator(
  name: string,
  schema: ValidationSchema,
  opts: ValidationOptions,
) {
  const tsInterface = generateInterface(name, schema);
  const func = generateValdiatorFunc(name, schema, opts);

  return `${tsInterface}\n\n${func}`;
}

function generateInterface(name: string, schema: ValidationSchema): string {
  const src = [`export interface ${name} {`];

  Object.entries(schema).forEach(([key, value]) => {
    src.push(generators[value.type].types(key, value as any));
  });

  src.push("}");
  return src.join("\n");
}

function generateValdiatorFunc(
  name: string,
  schema: ValidationSchema,
  opts: ValidationOptions,
): string {
  const src = [
    `export function validate${name}(data: any): ${name} {`,
    "if (data === null) {",
    makeError("base.null"),
    "}",
    `if (typeof data !== "object") {`,
    makeError("base.object"),
    "}",
  ];

  if (opts.strict) {
    src.push(`const entries = Object.keys(data);`);
  }

  Object.entries(schema).forEach(([key, value]) => {
    const validationSrc = generators[value.type].validations(key, value as any);
    src.push(validationSrc, "");

    if (opts.strict) {
      src.push(`entries.splice(entries.indexOf("${key}"), 1);`);
    }
  });

  if (opts.strict) {
    src.push(`if (entries.length > 0) {`, makeError("strict"), "}");
  }

  src.push(`return data as ${name};`, "}");
  return src.join("\n");
}
