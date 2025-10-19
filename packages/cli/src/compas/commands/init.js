import { writeFile } from "node:fs/promises";
import { pathJoin } from "@compas/stdlib";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "init",
  shortDescription: "Init various files in the current project.",
  flags: [
    {
      name: "dumpAll",
      rawName: "--all",
      description: "Enable '--gitignore', '--jsconfig' and '--lint-config'.",
    },
    {
      name: "dumpGitignore",
      rawName: "--gitignore",
      description:
        "Creates or overwrites the .gitignore, with defaults for IDE(s), Yarn/NPM and caches.",
    },
    {
      name: "dumpJSConfig",
      rawName: "--jsconfig",
      description:
        "Creates or overwrites the root jsconfig.json file, to use with the Typescript Language Server.",
    },
  ],
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export async function cliExecutor(logger, state) {
  let didDump = false;

  if (state.flags.dumpGitignore || state.flags.dumpAll) {
    didDump = true;
    await writeGitignore();
  }

  if (state.flags.dumpJSConfig || state.flags.dumpAll) {
    didDump = true;
    await writeJSConfig();
  }

  if (didDump) {
    logger.info("Init successful.");

    return {
      exitStatus: "passed",
    };
  }

  logger.info("Init did not write any files.");

  return {
    exitStatus: "failed",
  };
}

async function writeGitignore() {
  await writeFile(
    pathJoin(process.cwd(), ".gitignore"),
    `# OS
.DS_Store

# IDE
.idea
.vscode

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Dependency directories
node_modules

# Various tools + cache
.cache
.clinic
coverage
.nyc_output

# Common build directories
dist
out

# Generator output
structure.sql

# Local environment
.env.local
`,
  );
}

async function writeJSConfig() {
  await writeFile(
    pathJoin(process.cwd(), "jsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: "esnext",
          lib: ["esnext"],
          noEmit: true,
          module: "esnext",
          checkJs: true,
          maxNodeModuleJsDepth: 0,
          baseUrl: "./",
          moduleResolution: "node",
          strict: true,
        },
        typeAcquisition: {
          enable: true,
        },
        include: ["**/*.js"],
        exclude: ["**/*.test.js"],
      },
      null,
      2,
    )}\n`,
  );
}
