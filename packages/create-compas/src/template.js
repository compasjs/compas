import { mkdir, readFile, writeFile } from "fs/promises";
import https from "https";
import { normalize } from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { AppError, environment, pathJoin, spawn } from "@compas/stdlib";
import tar from "tar";

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

  let stream = Readable.from(Buffer.from(""));

  if (options.template.provider === "github") {
    logger.info(`Resolving remote template...`);

    // @ts-expect-error
    stream = await templateGetHttpStream(
      `https://codeload.github.com/${options.template.repository}/tar.gz${
        options.template.ref ? `/${options.template.ref}` : ""
      }`,
    );
  }

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

  logger.info(`Downloading and extracting template...`);

  await pipeline(
    stream,
    tar.extract(
      {
        cwd: options.outputDirectory,
        strip: options.template.path
          ? normalize(options.template.path).split("/").length + 1
          : 1,
      },
      [dirToExtract],
    ),
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
    await spawn("npx", metadata.generating.split(" "), {
      cwd: options.outputDirectory,
    });
  }

  logger.info(`Done!`);
  if (metadata?.initMessage) {
    logger.info(metadata.initMessage);
  }
}