// @ts-nocheck

import { rmSync } from "fs";
import { pathToFileURL } from "url";
import { isPlainObject, pathJoin } from "@compas/stdlib";
import { generate, writeFiles } from "./generator/index.js";

/**
 * @typedef {object} GenerateTypeOpts
 * @property {string} outputDirectory
 * @property {string[]} inputPaths
 * @property {boolean|string[]|undefined} [dumpCompasTypes]
 * @property {boolean|undefined} [verbose]
 * @property {string|undefined} [fileHeader]
 */

/**
 * @param {Logger} logger
 * @param {GenerateTypeOpts} options
 * @returns {Promise<void>}
 */
export async function generateTypes(logger, options) {
  const structureAndOptionPairs = await validateAndReadStructureFiles(options);

  if (options.verbose) {
    logger.info({
      specifiedInputPaths: options.inputPaths.length,
      loadingInputPaths: structureAndOptionPairs.length,
    });
  }

  options.typeCache = {
    rawImports: new Set(),
    typeMap: new Map(),
    calculatingTypes: new Set(),
  };

  let context;

  for (let i = 0; i < structureAndOptionPairs.length; i++) {
    const pair = structureAndOptionPairs[i];

    pair.options.typeCache = options.typeCache;
    pair.options.returnContext = true;

    if (i === structureAndOptionPairs.length - 1) {
      // Make sure that the last one does type generation.
      pair.options.enabledGenerators.push("type");
    }

    context = await generate(logger, pair.options, pair.structure);
  }

  const outputFiles = [];

  const typeFile = context?.outputFiles?.find((it) =>
    it.relativePath.endsWith("types.d.ts"),
  );
  if (typeFile) {
    outputFiles.push(typeFile);
  }

  if (options.dumpCompasTypes) {
    if (!Array.isArray(options.dumpCompasTypes)) {
      options.dumpCompasTypes = [
        "cli",
        "code-gen",
        "server",
        "stdlib",
        "store",
      ];
    }

    let contents = `${options.fileHeader}
    ${
      options.dumpCompasTypes.includes("cli")
        ? `import * as cli from "@compas/cli";`
        : ""
    }
    ${
      options.dumpCompasTypes.includes("code-gen")
        ? `import * as codeGen from "@compas/code-gen";`
        : ""
    }
    ${
      options.dumpCompasTypes.includes("server")
        ? `import * as server from "@compas/server";`
        : ""
    }
    ${
      options.dumpCompasTypes.includes("stdlib")
        ? `import * as stdlib from "@compas/stdlib";`
        : ""
    }
    ${
      options.dumpCompasTypes.includes("store")
        ? `import * as store from "@compas/store";`
        : ""
    }

    declare global {
    `;

    for (const generator of options.dumpCompasTypes) {
      if (generator === "cli") {
        contents += `
          type CliWatchOptions = cli.CliWatchOptions;
        `;
      } else if (generator === "code-gen") {
        contents += `
          type App = codeGen.App;
          type TypeCreator = codeGen.TypeCreator;
          type RouteCreator = codeGen.RouteCreator;
          type TypeBuilder = codeGen.TypeBuilder;
          type TypeBuilderLike = codeGen.TypeBuilderLike;
        `;
      } else if (generator === "stdlib") {
        contents += `
            type Logger = stdlib.Logger;
            type InsightEvent = stdlib.InsightEvent;
            type AppError = stdlib.AppError;
            type Either<T, E = AppError> =
                | { value: T; error?: never }
                | { value?: never; error: E };
            type EitherN<T, E = AppError> =
                | { value: T; errors: never }
                | { value: never; errors: E[] };
          `;
      } else if (generator === "store") {
        contents += `
          type Postgres = store.Postgres;
          type QueryPart<T = any> = store.QueryPart<T>;
          type QueryPartArg = store.QueryPartArg;
          type MinioClient = store.MinioClient;
          type GetStreamFn = store.GetStreamFn;
          type SessionStore = store.SessionStore;
          type FileCache = store.FileCache;
          type StoreSessionStoreSettings = store.StoreSessionStoreSettings;
          `;
      } else if (generator === "server") {
        contents += `
          type Application = server.Application
          type Context<
            StateT = import("koa").DefaultState,
            ContextT = import("koa").DefaultContext,
            ResponseBodyT = unknown,
          > = server.Context<StateT, ContextT, ResponseBodyT>;
          type Next = server.Next;
          type Middleware = server.Middleware;
          type BodyParserPair = server.BodyParserPair;
          type AxiosInstance = import("axios").AxiosInstance;
          type AxiosError = import("axios").AxiosError;
          type AxiosRequestConfig = import("axios").AxiosRequestConfig;
          `;
      }
    }

    contents += "\n}";

    outputFiles.push({
      relativePath: "./common/compas.d.ts",
      contents,
    });
  }

  logger.info(`Cleaning output directory and writing files.`);
  rmSync(options.outputDirectory, {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 10,
  });

  writeFiles({
    outputFiles,
    options,
  });
}

/**
 * Read and validate the structure files based on the input paths.
 * Checking if the files exists is already done by the 'App'.
 *
 * @param {GenerateTypeOpts} options
 * @returns {Promise<{ structure: CodeGenStructure, options: GenerateOpts }[]>}
 */
async function validateAndReadStructureFiles(options) {
  const pairs = [];

  for (const inputPath of options.inputPaths) {
    const structureFile = pathJoin(inputPath, "/common/structure.js");

    // @ts-ignore
    const { structure, compasGenerateSettings: options } = await import(
      pathToFileURL(structureFile)
    );

    if (isPlainObject(structure) && isPlainObject(options)) {
      pairs.push({ structure, options });
    }
  }

  return pairs;
}
