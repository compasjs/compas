import { existsSync } from "fs";
import { readFile } from "fs/promises";
import {
  dirnameForModule,
  exec,
  isNil,
  pathJoin,
  processDirectoryRecursive,
} from "@compas/stdlib";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "check-env",
  shortDescription: "Various checks helping with a better Compas experience.",
  longDescription: `This command is able to check a few things in the current project, to see if it is optimally configured.
  
- Checks if the '.env.local' is in the .gitignore if it exists
- Checks if all Compas packages are the same version
- Checks if graphviz is available
`,
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export async function cliExecutor(logger) {
  const { version: compasVersion } = JSON.parse(
    await readFile(
      pathJoin(dirnameForModule(import.meta), "../../../package.json"),
      "utf-8",
    ),
  );

  logger.info(`
Running 'compas check-env':

Versions:
- Compas:   v${compasVersion}
- Node.js:  ${process.version}
`);

  const results = (
    await Promise.all([
      areOtherCompasVersionsInstalled(compasVersion),
      isEnvLocalNotIgnored(),
      isDotCacheNotIgnored(),
      isDockerInstalled(),
      isGraphvizInstalled(),
    ])
  ).filter((it) => it.failed);

  if (results.length) {
    logger.info(`Setup checks:
${results.map((it) => it.message ?? "").join("\n")}
`);
  } else {
    logger.info("Static setup checks passed!\n");
  }

  return {
    exitStatus: results.length ? "failed" : "passed",
  };
}

/**
 * If a `.env.local` exists, it should be ignored
 *
 * @returns {Promise<{ failed: boolean, message?: string }>}
 */
async function isEnvLocalNotIgnored() {
  let result;
  if (!existsSync("./.env.local")) {
    result = false;
  } else {
    const { exitCode } = await exec(`git check-ignore -q .env.local`);
    // 128 if no git repo exists in directory
    result = exitCode !== 0 && exitCode !== 128;
  }

  if (!result) {
    return {
      failed: false,
    };
  }

  return {
    failed: true,
    message:
      "X '.env.local' found but not git ignored. Please add it to your '.gitignore'.",
  };
}

/**
 * Checks if the `.cache` folder is ignored.
 *
 * @returns {Promise<{ failed: boolean, message?: string }>}
 */
async function isDotCacheNotIgnored() {
  const { exitCode } = await exec(`git check-ignore -q .cache`);

  // 128 if no git repo exists in directory
  const result = exitCode !== 0 && exitCode !== 128;

  if (!result) {
    return {
      failed: false,
    };
  }

  return {
    failed: true,
    message:
      "X '.cache' is not git ignored. Please add it to your '.gitignore'. This directory is used to cache results for tools like Prettier and ESLint.",
  };
}

/**
 * Multiple versions of compas conflict with the use of ES Module live bindings, which
 * leads to weird behaviour. So warn if that is happening.
 *
 * @param {string} compasVersion
 * @returns {Promise<{ failed: boolean, message?: string }>}
 */
async function areOtherCompasVersionsInstalled(compasVersion) {
  const foundVersions = [];

  await processDirectoryRecursive(
    process.cwd(),
    async (file) => {
      if (file.endsWith("/@compas/stdlib/package.json")) {
        const { version } = JSON.parse(await readFile(file, "utf-8"));
        if (
          version !== compasVersion &&
          isNil(foundVersions.find((it) => it.version === version))
        ) {
          foundVersions.push({
            path: file,
            version,
          });
        }
      }
    },
    {
      skipNodeModules: false,
    },
  );

  if (foundVersions.length > 0) {
    let message = `X Multiple @compas/stdlib versions found, to to ensure a stable experience use the version that is commonly accepted by all your dependencies.`;
    for (const { path, version } of foundVersions) {
      message += `\n  - v${version} - ${path}`;
    }
    return {
      failed: true,
      message,
    };
  }

  return {
    failed: false,
  };
}

/**
 * Graphviz is necessary for `compas visualise
 *
 * @returns {Promise<{ failed: boolean, message?: string }>}
 */
async function isGraphvizInstalled() {
  try {
    await exec("dot -V");
    return {
      failed: false,
    };
  } catch {
    return {
      failed: true,
      message: `Could not locate a local 'dot' executable. This is necessary for the 'compas visualise' commands.
  This can be installed via the 'graphviz' package via your systems package manager.`,
    };
  }
}

/**
 * Docker is necessary for `compas docker` usage
 *
 * @returns {Promise<{ failed: boolean, message?: string }>}
 */
async function isDockerInstalled() {
  try {
    await exec("docker -v");
    return {
      failed: false,
    };
  } catch {
    return {
      failed: true,
      message: `Could not locate a local 'docker' executable. This is necessary for the 'compas docker' commands.`,
    };
  }
}
