import { createWriteStream } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import https from "node:https";
import os from "node:os";
import { normalize } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import {
  AppError,
  environment,
  exec,
  pathJoin,
  spawn,
  uuid,
} from "@compas/stdlib";
import * as tar from "tar";

/**
 * Try to resolve the template, this way we can explicitly error instead of an extraction
 * error because of a 40x response.
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("./arg-parser.js").CreateCompasArgs} options
 * @returns {Promise<void>}
 */
export async function templateCheckIfExists(logger, options) {
  if (options.help) {
    return;
  }

  const errorMessage = `The template could not be resolved, see 'create-compas --help'.
  If you used a Compas provided template, make sure it exists at 'https://github.com/compasjs/compas/tree/${
    options.template.ref ?? "main"
  }/examples/'.`;

  if (options.template.provider === "github") {
    try {
      await new Promise((resolve, reject) => {
        const req = https.request(
          `https://github.com/${options.template.repository}/blob/${
            options.template.ref ? options.template.ref : "-"
          }/${
            options.template.path
              ? `${options.template.path}/package.json`
              : "package.json"
          }`,
          {
            method: "HEAD",
          },
          (res) => {
            res.on("error", reject);

            if ((res?.statusCode ?? 500) > 399) {
              reject(new Error());
            } else {
              // @ts-expect-error
              resolve();
            }
          },
        );

        req.on("error", reject);
        req.end();
      });
    } catch {
      logger.error(errorMessage);

      return process.exit(1);
    }
  } else {
    logger.error(errorMessage);

    return process.exit(1);
  }
}

/**
 * Download and extract the template repository.
 * Does not do any post-processing.
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("./arg-parser.js").CreateCompasArgs} options
 * @returns {Promise<void>}
 */
export async function templateGetAndExtractStream(logger, options) {
  if (options.help) {
    return;
  }

  await mkdir(options.outputDirectory, { recursive: true });

  const tmpFile = pathJoin(os.tmpdir(), `create-compas-${uuid()}`);
  let httpStream = Readable.from(Buffer.from(""));

  if (options.template.provider === "github") {
    logger.info(`Resolving remote template...`);

    // @ts-expect-error
    httpStream = await templateGetHttpStream(
      `https://codeload.github.com/${options.template.repository}/tar.gz${
        options.template.ref ? `/${options.template.ref}` : ""
      }`,
    );
  }

  logger.info("Downloading template...");
  await pipeline(httpStream, createWriteStream(tmpFile));

  let dirToExtract = options.template.path;

  if (options.template.provider === "github") {
    dirToExtract = `${options.template.repository.split("/").pop()}-${(
      options.template.ref ?? "main"
    ).replaceAll(/\//g, "-")}/${
      options.template.path ? normalize(options.template.path) : ""
    }`;

    // For some reason, GitHub strips the `v` prefix of tagged refs in the Compas repo.
    // Have to figure out a better way to fix this. When resolving the tree
    // `compasjs/compas/tree/v0.0.211` this isn't happening.
    if (options.template.ref && /^v\d+\.\d+\.\d+$/.test(options.template.ref)) {
      dirToExtract = dirToExtract.replace(
        options.template.ref,
        options.template.ref.substring(1),
      );
    }
  }

  logger.info(`Extracting template...`);

  await tar.extract(
    {
      // @ts-expect-error this just works :tm:
      file: tmpFile,
      cwd: options.outputDirectory,
      strip: options.template.path
        ? normalize(options.template.path).split("/").length + 1
        : 1,
    },
    [dirToExtract],
  );
}

/**
 * @param {string} url
 * @returns {Promise<NodeJS.ReadableStream>}
 */
export function templateGetHttpStream(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const code = response.statusCode ?? 200;
        if (code >= 400) {
          reject(
            new AppError("fetch.error", code, {
              message: response.statusMessage,
            }),
          );
        } else if (code >= 300) {
          // @ts-expect-error
          templateGetHttpStream(response.headers.location).then(
            resolve,
            reject,
          );
        } else {
          resolve(response);
        }
      })
      .on("error", reject);
  });
}

/**
 * Do necessary post-processing.
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("./arg-parser.js").CreateCompasArgs} options
 * @param {string} compasVersion
 * @returns {Promise<void>}
 */
export async function templatePostProcess(logger, options, compasVersion) {
  logger.info("Post processing...");

  const packageJson = JSON.parse(
    await readFile(pathJoin(options.outputDirectory, "package.json"), "utf-8"),
  );

  const metadata = packageJson.exampleMetadata;

  delete packageJson.name;
  delete packageJson.exampleMetadata;

  for (const depType of ["dependencies", "devDependencies"]) {
    for (const key of Object.keys(packageJson[depType] ?? {})) {
      if (key === "compas" || key.startsWith("@compas/")) {
        if (packageJson[depType][key] === "*") {
          packageJson[depType][key] = compasVersion;
        }
      }
    }
  }

  await writeFile(
    pathJoin(options.outputDirectory, "package.json"),
    JSON.stringify(packageJson, null, 2),
  );

  logger.info("Running npm/yarn...");
  let command = `npm`;
  if (environment.npm_config_user_agent?.startsWith("yarn")) {
    command = "yarn";
  }
  await spawn(command, command === "npm" ? ["i"] : [], {
    cwd: options.outputDirectory,
  });

  if (metadata?.generating) {
    logger.info("Generating...");
    await exec(`npx ${metadata.generating}`, {
      cwd: options.outputDirectory,
    });
  }

  logger.info("Collecting environment info...");
  await spawn(`npx`, ["compas", "check-env"], {
    cwd: options.outputDirectory,
  });

  logger.info(
    `Started a new Compas project in ${options.outputDirectory}. See the README.md for how to get started.`,
  );
}
