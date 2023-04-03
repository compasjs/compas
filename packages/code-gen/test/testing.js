import { existsSync } from "fs";
import { AppError, isNil, pathJoin, uuid } from "@compas/stdlib";
import { testTemporaryDirectory } from "../../../src/testing.js";
import { TypeCreator } from "../src/builders/index.js";
import { Generator } from "../src/experimental/index.js";

/**
 * @param {{
 *   withOutputDirectory: string|undefined,
 * }} options
 * @returns {import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions}
 */
function testGeneratorDefaultGenerateOptions(options) {
  return {
    targetLanguage: "js",
    outputDirectory: options.withOutputDirectory,
    generators: {
      structure: {},
      validators: {
        includeBaseTypes: true,
      },
      apiClient: {
        target: {
          library: "axios",
          targetRuntime: "node.js",
          globalClient: false,
        },
      },
      database: {
        target: {
          dialect: "postgres",
          includeDDL: true,
        },
        includeEntityDiagram: true,
      },
      router: {
        target: {
          library: "koa",
        },
        exposeApiStructure: true,
      },
      openApi: {
        openApiRouteExtensions: {},
        openApiExtensions: {},
      },
      types: {},
    },
  };
}

/**
 * Tests errors that could occur while generating.
 *
 * @param {TestRunner} t
 * @param {{
 *   partialError: string,
 *   generateOptions:
 *   import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }|{
 *   pass: true,
 *   generateOptions:
 *   import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: TypeCreator) => ((TypeBuilder|TypeBuilderLike)[])} builders
 * @returns {void}
 */
export function testGeneratorError(t, options, builders) {
  const generator = new Generator(t.log);

  try {
    generator.add(...builders(new TypeCreator("app")));
    generator.generate(
      options.generateOptions ?? testGeneratorDefaultGenerateOptions({}),
    );

    if (options.pass) {
      t.pass();
    } else {
      t.fail(`Expected an error: '${options.partialError}'.`);
    }
  } catch (e) {
    if (options.pass) {
      t.fail(
        `Expected the input to pass. Found '${JSON.stringify(
          AppError.format(e),
        )}'`,
      );
      return;
    }
    if (!AppError.instanceOf(e)) {
      t.fail(
        `Expected the thrown error to be an AppError. Found '${JSON.stringify(
          AppError.format(e),
        )}'`,
      );

      return;
    }

    if (e.key?.includes(options.partialError)) {
      t.pass();
      return;
    }

    if (e.info.message?.includes(options.partialError)) {
      t.pass();
      return;
    }

    if (
      Array.isArray(e.info.messages) &&
      e.info.messages.find((it) => it.includes(options.partialError))
    ) {
      t.pass();
      return;
    }

    t.fail(
      `Could not match '${options.partialError}' in '${JSON.stringify(
        AppError.format(e),
      )}'`,
    );
  }
}

/**
 * Tests types that have been generated via the JS validators
 *
 * @param {TestRunner} t
 * @param {{
 *   group: string,
 *   validatorName: string,
 *   validatorInput: any,
 *   generateOptions:
 *   import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: TypeCreator) => ((TypeBuilder|TypeBuilderLike)[])} builders
 * @returns {Promise<{ value: any, error: Record<string, ValidatorErrorMap> }>}
 */
export async function testGeneratorType(t, options, builders) {
  const generator = new Generator(t.log);
  const outputDirectory = `${testTemporaryDirectory}/${uuid()}`;

  generator.add(...builders(new TypeCreator("app")));
  generator.generate(
    options.generateOptions ??
      testGeneratorDefaultGenerateOptions({
        withOutputDirectory: outputDirectory,
      }),
  );

  const filePath = pathJoin(outputDirectory, options.group, "validators.js");

  if (!existsSync(filePath)) {
    throw AppError.serverError({
      message: "Could not load the validator file",
      outputDirectory,
      filePath,
      options,
    });
  }

  const file = await import(filePath);

  if (isNil(file[options.validatorName])) {
    throw AppError.serverError({
      message: "Could not load the validator function",
      outputDirectory,
      filePath,
      options,
    });
  }

  return file[options.validatorName](options.validatorInput);
}

/**
 * Tests if the outputFiles include the provided value
 *
 * @param {TestRunner} t
 * @param {{
 *   relativePath: string,
 *   partialValue: string,
 *   generateOptions:
 *   import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: TypeCreator) => ((TypeBuilder|TypeBuilderLike)[])} builders
 * @returns {void}
 */
export function testGeneratorStaticOutput(t, options, builders) {
  const generator = new Generator(t.log);

  generator.add(...builders(new TypeCreator("app")));
  const generatedFiles = generator.generate(
    options.generateOptions ?? testGeneratorDefaultGenerateOptions({}),
  );

  const outputFile = generatedFiles.find(
    (it) => it.relativePath === options.relativePath,
  );

  t.fail(`The relative path '${options.relativePath}' could not be found.`);

  t.ok(
    outputFile.contents.includes(options.partialValue),
    `Could not find '${options.partialValue}' in ${outputFile.contents}.`,
  );
}

/**
 * Test the dynamic generator output. Returns the path where the files are written to.
 *
 * @param {TestRunner} t
 * @param {{
 *   generateOptions:
 *   import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: TypeCreator) => ((TypeBuilder|TypeBuilderLike)[])} builders
 * @returns {string}
 */
export function testGeneratorDynamicOutput(t, options, builders) {
  const generator = new Generator(t.log);
  const outputDirectory = `${testTemporaryDirectory}/${uuid()}`;

  generator.add(...builders(new TypeCreator("app")));
  generator.generate(
    options.generateOptions ??
      testGeneratorDefaultGenerateOptions({
        withOutputDirectory: outputDirectory,
      }),
  );

  return outputDirectory;
}
