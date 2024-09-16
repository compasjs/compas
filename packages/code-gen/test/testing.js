import { existsSync } from "node:fs";
import { AppError, isNil, pathJoin, uuid } from "@compas/stdlib";
import { testTemporaryDirectory } from "../../../src/testing.js";
import { TypeCreator } from "../src/builders/index.js";
import { Generator } from "../src/index.js";

/**
 * @param {{
 *   withOutputDirectory?: string,
 * }} options
 * @returns {import("../src/generated/common/types.js").StructureGenerateOptions}
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
        responseValidation: {
          looseObjectValidation: false,
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
    },
  };
}

/**
 * Tests errors that could occur while generating.
 *
 * @param {import("@compas/cli").TestRunner} t
 * @param {{
 *   partialError: string,
 *   generateOptions:
 *   import("../src/generated/common/types.js").StructureGenerateOptions|undefined,
 * }|{
 *   pass: true,
 *   generateOptions?:
 *   import("../src/generated/common/types.js").StructureGenerateOptions|undefined,
 * }} options
 * @param {(T: import("@compas/code-gen").TypeCreator) => (Array<(import("../src/builders/TypeBuilder.js").TypeBuilder | import("@compas/code-gen").TypeBuilderLike)>)} builders
 * @returns {void}
 */
export function testGeneratorError(t, options, builders) {
  const generator = new Generator(t.log);

  try {
    generator.add(...builders(new TypeCreator("app")));
    generator.generate(
      options.generateOptions ?? testGeneratorDefaultGenerateOptions({}),
    );

    // @ts-expect-error
    if (options.pass) {
      t.pass();
    } else {
      t.fail(
        // @ts-expect-error
        `Expected an error, but the generator succeeded: '${options.partialError}'.`,
      );
    }
  } catch (e) {
    // @ts-expect-error
    if (options.pass) {
      t.fail(
        `Expected the input to pass. Found '${JSON.stringify(AppError.format(e))}'`,
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

    // @ts-expect-error
    if (e.key?.includes(options.partialError)) {
      t.pass();
      return;
    }

    // @ts-expect-error
    if (e.info.message?.includes(options.partialError)) {
      t.pass();
      return;
    }

    if (
      Array.isArray(e.info.messages) &&
      // @ts-expect-error
      e.info.messages.find((it) => it.includes(options.partialError))
    ) {
      t.pass();
      return;
    }

    t.fail(
      // @ts-expect-error
      `Could not match '${options.partialError}' in '${JSON.stringify(
        AppError.format(e),
      )}'`,
    );
  }
}

/**
 * Tests types that have been generated via the JS validators
 *
 * @param {import("@compas/cli").TestRunner} t
 * @param {{
 *   group: string,
 *   validatorName: string,
 *   validatorInput: any,
 *   generateOptions?:
 *   import("../src/generated/common/types.js").StructureGenerateOptions|undefined,
 * }} options
 * @param {(T: import("@compas/code-gen").TypeCreator) => (Array<(import("../src/builders/TypeBuilder.js").TypeBuilder | import("@compas/code-gen").TypeBuilderLike)>)} builders
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

  const file = await import(pathJoin(process.cwd(), filePath));

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
 * @param {import("@compas/cli").TestRunner} t
 * @param {{
 *   relativePath: string,
 *   partialValue: string,
 *   generateOptions?:
 *   import("../src/generated/common/types.js").StructureGenerateOptions|undefined,
 * }} options
 * @param {(T: import("@compas/code-gen").TypeCreator) => (Array<(import("../src/builders/TypeBuilder.js").TypeBuilder | import("@compas/code-gen").TypeBuilderLike)>)} builders
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

  if (!outputFile) {
    t.fail(
      `The relative path '${
        options.relativePath
      }' could not be found. Available files: ${JSON.stringify(
        generatedFiles.map((it) => it.relativePath),
      )}`,
    );

    return;
  }

  t.ok(
    outputFile.contents.includes(options.partialValue),
    `Could not find '${options.partialValue}' in ${outputFile.contents}.`,
  );
}

/**
 * Get the list of generated output files
 *
 * @param {import("@compas/cli").TestRunner} t
 * @param {{
 *   generateOptions?:
 *   import("../src/generated/common/types.js").StructureGenerateOptions|undefined,
 * }} options
 * @param {(T: import("@compas/code-gen").TypeCreator) => (Array<(import("../src/builders/TypeBuilder.js").TypeBuilder | import("@compas/code-gen").TypeBuilderLike)>)} builders
 * @returns {Array<import("../src/generate.js").OutputFile>}
 */
export function testGeneratorStaticFiles(t, options, builders) {
  const generator = new Generator(t.log);

  generator.add(...builders(new TypeCreator("app")));
  return generator.generate(
    options.generateOptions ?? testGeneratorDefaultGenerateOptions({}),
  );
}
