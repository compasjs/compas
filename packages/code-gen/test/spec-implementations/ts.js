import { writeFileSync } from "node:fs";
import {
  AppError,
  environment,
  exec,
  isNil,
  mainFn,
  pathJoin,
} from "@compas/stdlib";
import { Generator } from "../../src/index.js";
import { upperCaseFirst } from "../../src/utils.js";
import { codeGenSpecification } from "../spec/specification.js";
import { codeGenSpecificationCreate } from "../spec/structure.js";

const generateOutputDirectory = `./.cache/specification/ts/generated`;

mainFn(import.meta, async (logger) => {
  const IN_TEST = environment.COMPAS_SPEC_TEST === "true";

  if (!IN_TEST) {
    codeGenSpecificationCreate(logger);
  }

  await specificationTestsRun(logger, { enableFullLogging: !IN_TEST });
});

/**
 * @typedef {object} SpecResult
 * @property {import("@compas/stdlib").Logger} log
 * @property {number} passed
 * @property {number} skipped
 * @property {number} failed
 * @property {Array<{
 *   name: string,
 *   index: number,
 * }>} suites
 * @property {Array<any>} extraLogs
 */

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {{ enableFullLogging: boolean }} options
 */
async function specificationTestsRun(logger, options) {
  const results = {
    log: logger,
    passed: 0,
    skipped: 0,
    failed: 0,
    suites: [],
    extraLogs: [],
  };

  logger.info("Dispatching Root");

  await dispatchSpec(results, codeGenSpecification);

  if (options.enableFullLogging) {
    for (const log of results.extraLogs) {
      logger.info(log);
    }
  }

  logger.info(`Compas-Passed: ${results.passed};`);
  logger.info(`Compas-Skipped: ${results.skipped};`);
  logger.info(`Compas-Failed: ${results.failed};`);
}

/**
 *
 * @param {SpecResult} result
 * @param {import("../spec/specification.js").CodeGenSpecification} spec
 */
async function dispatchSpec(result, spec) {
  switch (spec.type) {
    case "suite":
      await runSuite(result, spec);
      break;
    case "generate":
      await runGenerate(result, spec);
      break;
    case "validator":
      await runValidator(result, spec);
      break;
    case "routeMatcher":
      await runRouteMatcher(result, spec);
      break;
    default:
      runSkip(result, spec);
      break;
  }
}

function formatSpecPath(result) {
  return result.suites.map((it) => `${it.name} (${it.index})`).join(" -> ");
}

/**
 * Skip the current spec
 *
 * @param {SpecResult} result
 * @param {import("../spec/specification.js").CodeGenSpecification} spec
 */
function runSkip(result, spec) {
  result.skipped++;
  result.extraLogs.push(`Skipped '${spec.type}' at ${formatSpecPath(result)}`);
}

/**
 * Run all components of a suite recursively
 *
 * @param {SpecResult} result
 * @param {import("../spec/specification.js").CodeGenSpecificationSuite} spec
 */
async function runSuite(result, spec) {
  const suite = {
    name: spec.name,
    index: 0,
  };
  result.suites.push(suite);

  for (const component of spec.components) {
    await dispatchSpec(result, component);
    suite.index++;
  }

  result.suites.pop();
}

/**
 * Run generators with full options enabled.
 *
 * @param {SpecResult} result
 * @param {import("../spec/specification.js").CodeGenSpecificationGenerate} spec
 */
async function runGenerate(result, spec) {
  try {
    const generator = new Generator(result.log);
    generator.addStructure(spec.structureDirectory);
    generator.generate({
      targetLanguage: "ts",
      outputDirectory: generateOutputDirectory,
      generators: {
        validators: {
          includeBaseTypes: true,
        },
        apiClient: {
          target: {
            library: "fetch",
            globalClient: false,
            targetRuntime: "browser",
            includeWrapper: "react-query",
          },
        },
      },
    });

    writeFileSync(
      pathJoin(generateOutputDirectory, "../tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          target: "es5",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          downlevelIteration: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "node",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          noImplicitAny: false,
        },
        exclude: ["node_modules"],
        include: ["**/*.ts", "**/*.d.ts", "**/*.tsx"],
      }),
    );

    const { stdout, exitCode } = await exec(
      `tsc -p ${generateOutputDirectory}/../tsconfig.json`,
    );

    if (exitCode !== 0) {
      throw AppError.serverError({
        message: "Could not compile with tsc",
        stdout,
      });
    }

    result.passed++;
  } catch (e) {
    result.failed++;
    result.extraLogs.push(
      `Failed to generate ('${spec.structureDirectory}') at ${formatSpecPath(result)}`,
    );
    result.extraLogs.push(AppError.format(e));
  }
}

/**
 * Run validator
 *
 * @param {SpecResult} result
 * @param {import("../spec/specification.js").CodeGenSpecificationValidator} spec
 */
async function runValidator(result, spec) {
  try {
    const imported = await import(
      pathJoin(
        process.cwd(),
        generateOutputDirectory,
        `${spec.generatedType.group}/validators.js`,
      )
    );
    const validator =
      imported[
        `validate${upperCaseFirst(spec.generatedType.group)}${upperCaseFirst(
          spec.generatedType.name,
        )}`
      ];

    if (isNil(validator)) {
      throw AppError.serverError({
        message: "Could not locate validator",
        spec,
      });
    }

    const { error, value } = validator(
      spec.input ? JSON.parse(spec.input) : undefined,
    );

    if (
      spec.assertValidatorError &&
      error?.[spec.assertValidatorError.key]?.key !==
        spec.assertValidatorError.errorKey
    ) {
      throw AppError.serverError({
        message: "Validator did not return correct error",
        spec,
        error,
        value,
      });
    } else if (!spec.assertValidatorError && !isNil(error)) {
      throw AppError.serverError({
        message: "Validator should not have returned an error",
        spec,
        error,
        value,
      });
    } else {
      result.passed++;
    }
  } catch (e) {
    result.failed++;
    result.extraLogs.push(`Failed to validate at ${formatSpecPath(result)}`);
    result.extraLogs.push(AppError.format(e));
  }
}

/**
 * Run route matcher
 *
 * @param {SpecResult} result
 * @param {import("../spec/specification.js").CodeGenSpecificationRouteMatcher} spec
 */
function runRouteMatcher(result, spec) {
  result.skipped++;

  return spec;
}
