import { environment, exec, isNil, spawn } from "@compas/stdlib";

/**
 * @typedef {{
 *   containersForContext: {
 *     [p: string]: {
 *       createCommand: string,
 *       pullCommand: [string,string[]]
 *     }
 *   },
 *   globalContainers: string[]
 * } & {
 *   containersOnHost: string[],
 * }} DockerContext
 */

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "docker",
  shortDescription: "Manage common docker components.",
  longDescription: `Manages a single PostgreSQL and Minio container for use in all your local projects.
It can switch between multiple PostgreSQL versions (12, 13 and 14 are supported via --postgres-version), however only a single version can be 'up' at a time.

PostgreSQL credentials:
> postgresql://postgres:postgres@127.0.0.1:5432/postgres

Minio credentials:
- ACCESS_KEY: minio
- SECRET_KEY: minio123


Don't use this command and secrets for your production deployment.
`,
  modifiers: {
    isCosmetic: true,
  },
  subCommands: [
    {
      name: "up",
      shortDescription: "Start the managed containers.",
    },
    {
      name: "down",
      shortDescription: "Stop the managed containers.",
      longDescription:
        "Stop any of the containers that could possibly be started by this CLI.\n" +
        "It ignores context and stops any PostgreSQL container started by this CLI, ignoring `--postgres-version`.",
    },
    {
      name: "clean",
      shortDescription:
        "Clean up all containers and volumes, or only the PostgreSQL databases of the specified projects.",
      longDescription: `When no arguments are passed, all created docker containers and volumes are removed.

By passing '--project', it can clean up PostgreSQL databases without having to restart the containers.
The flag is repeatable, so multiple projects can be cleaned at the same time. If no value is passed, it defaults to 'process.env.APP_NAME'.
`,
      flags: [
        {
          name: "projects",
          rawName: "--project",
          description:
            "Specify the project(s) to remove. If no value is passed, the current project is read from `environment.APP_NAME`.",
          modifiers: {
            isRepeatable: true,
          },
          value: {
            specification: "booleanOrString",
          },
        },
      ],
    },
  ],
  flags: [
    {
      name: "postgresVersion",
      rawName: "--postgres-version",
      description: "Specify the PostgreSQL version to use. Defaults to 12.",
      value: {
        specification: "number",
        validator: (value) => {
          const isValid = [12, 13, 14].includes(value);

          if (isValid) {
            return { isValid };
          }

          return {
            isValid,
            error: {
              message: "Only PostgreSQL version 12, 13 and 14 are supported.",
            },
          };
        },
      },
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
  const context = getContainerInformation(state.flags.postgresVersion ?? "12");

  if (!(await isDockerAvailable())) {
    logger.error(
      "Make sure to install Docker first. See https://docs.docker.com/install/",
    );

    return { exitStatus: "failed" };
  }

  const { exitCode, stdout, stderr } = await exec(
    "docker container ls -a --format '{{.Names}}'",
  );

  if (exitCode !== 0) {
    logger.error(
      "Could not list containers available on host. Is Docker correctly installed?",
    );

    // TODO: Enable with verbose flag?
    if (state.flags.verbose) {
      logger.error({
        stdout,
        stderr,
      });
    }

    return {
      exitStatus: "failed",
    };
  }

  context.containersOnHost = stdout
    .split("\n")
    .map((it) => it.trim())
    .filter((it) => it.length > 0);

  if (state.command.includes("up")) {
    return await startContainers(logger, state, context);
  } else if (state.command.includes("down")) {
    return await stopContainers(logger, state, context);
  } else if (state.command.includes("clean")) {
    return await cleanContainers(logger, state, context);
  }

  return {
    exitStatus: "passed",
  };
}

/**
 * Bring containers up based on context
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @param {DockerContext} context
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
async function startContainers(logger, state, context) {
  // Stop all containers that should not be brought up by this context.
  // Prevent conflicts of having multiple PostgreSQL containers using the same ports.
  const stopResult = await stopContainers(logger, state, {
    globalContainers: context.globalContainers,
    containersOnHost: context.containersOnHost.filter((it) =>
      isNil(context.containersForContext[it]),
    ),
    containersForContext: context.containersForContext,
  });

  if (stopResult.exitStatus === "failed") {
    return stopResult;
  }

  for (const name of Object.keys(context.containersForContext)) {
    logger.info(`Creating '${name}' container.`);

    // If the container exists, we expect it is created by us, so we can reuse it,
    // otherwise we need to pull and create the container.
    if (!context.containersOnHost.includes(name)) {
      logger.info(`Pulling '${name}'.`);

      const { exitCode: pullExitCode } = await spawn(
        ...context.containersForContext[name].pullCommand,
      );

      if (pullExitCode !== 0) {
        return {
          exitStatus: "failed",
        };
      }

      const {
        exitCode: createExitCode,
        stdout,
        stderr,
      } = await exec(context.containersForContext[name].createCommand);

      if (createExitCode !== 0) {
        logger.error(`Could not create '${name}'.`);

        if (state.flags.verbose) {
          logger.info({
            stdout,
            stderr,
          });
        }

        return {
          exitStatus: "failed",
        };
      }
    }
  }

  logger.info(
    `Starting ${
      Object.keys(context.containersForContext).length
    } container(s).`,
  );

  const { exitCode } = await spawn(`docker`, [
    "start",
    ...Object.keys(context.containersForContext),
  ]);

  if (exitCode !== 0) {
    return {
      exitStatus: "failed",
    };
  }

  const postgresContainer = Object.keys(context.containersForContext).find(
    (it) => it.startsWith("compas-postgres-"),
  );

  logger.info(`Waiting for '${postgresContainer} to be ready.`);
  await exec(
    `until docker exec ${postgresContainer} pg_isready ; do sleep 1 ; done`,
  );

  return {
    exitStatus: "passed",
  };
}

/**
 * Stop all known containers, disregarding any context.
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @param {DockerContext} context
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
async function stopContainers(logger, state, context) {
  const containersToStop = context.globalContainers.filter((it) =>
    context.containersOnHost.includes(it),
  );

  logger.info(`Stopping ${containersToStop.length} container(s).`);

  if (containersToStop.length === 0) {
    return {
      exitStatus: "passed",
    };
  }

  const { exitCode } = await spawn(`docker`, ["stop", ...containersToStop]);

  if (exitCode !== 0) {
    logger.error("Could not stop the containers.");
    return {
      exitStatus: "failed",
    };
  }

  return {
    exitStatus: "passed",
  };
}

/**
 * Bring containers up based on context
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @param {DockerContext} context
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
async function cleanContainers(logger, state, context) {
  const allProjects = isNil(state.flags.projects);

  if (allProjects) {
    logger.info("Removing all containers and volumes.");

    const stopResult = await stopContainers(logger, state, context);

    if (stopResult.exitStatus === "failed") {
      return stopResult;
    }

    const containersToRemove = context.globalContainers.filter((it) =>
      context.containersOnHost.includes(it),
    );

    logger.info("Removing containers.");
    const { exitCode: rmExit } = await spawn(`docker`, [
      `rm`,
      ...containersToRemove,
    ]);

    if (rmExit !== 0) {
      return {
        exitStatus: "failed",
      };
    }

    logger.info("Removing volumes.");
    const { exitCode: volumeRmExit } = await spawn(`docker`, [
      `volume`,
      `rm`,
      ...containersToRemove,
    ]);

    if (volumeRmExit !== 0) {
      return {
        exitStatus: "failed",
      };
    }

    return {
      exitStatus: "passed",
    };
  }

  /**
   * @type {string[]}
   */
  // @ts-ignore
  const projects = state.flags.projects.map((it) =>
    it === true ? environment.APP_NAME : it,
  );

  logger.info(`Resetting databases for '${projects.join("', '")}'.`);

  // Make sure containers are started
  const startResult = await startContainers(logger, state, context);
  if (startResult.exitStatus === "failed") {
    return startResult;
  }

  const postgresContainer = Object.keys(context.containersForContext).find(
    (it) => it.startsWith("compas-postgres-"),
  );

  const { stdout } = await exec(
    `echo "SELECT 'DROP DATABASE ' || quote_ident(datname) || ';' FROM pg_database WHERE (${projects
      .map((it) => `datname LIKE '${it}%'`)
      .join(
        " OR ",
      )}) AND datistemplate=false" | docker exec -i ${postgresContainer} psql --user postgres`,
  );

  logger.info(
    `Removing ${stdout.split("DROP").length - 1} database(s) and creating ${
      projects.length
    } new empty database(s).`,
  );

  let pgCommand =
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid();";
  for (const command of stdout.split("\n")) {
    if (command.trim().startsWith("DROP DATABASE")) {
      pgCommand += `${command.trim()};`;
    }
  }

  for (const project of projects) {
    pgCommand += `CREATE DATABASE ${project};`;
  }

  const { exitCode, ...dockerLogs } = await exec(
    `echo "${pgCommand}" | docker exec -i ${postgresContainer} psql --user postgres`,
  );

  if (exitCode !== 0) {
    logger.error("Could not drop and recreate the selected databases.");
    logger.error(dockerLogs);
  }

  return {
    exitStatus: exitCode === 0 ? "passed" : "failed",
  };
}

/**
 *
 * @param postgresVersion
 * @returns {DockerContext}
 */
function getContainerInformation(postgresVersion) {
  return {
    containersForContext: {
      [`compas-postgres-${postgresVersion}`]: {
        pullCommand: ["docker", ["pull", `postgres:${postgresVersion}`]],
        createCommand: `docker create -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e PGDATA=/var/lib/postgresql/data/pgdata -v compas-postgres-${postgresVersion}:/var/lib/postgresql/data/pgdata -p 5432:5432 --name compas-postgres-${postgresVersion} postgres:${postgresVersion}`,
      },
      "compas-minio": {
        pullCommand: ["docker", ["pull", "minio/minio"]],
        createCommand: `docker create -e MINIO_ACCESS_KEY=minio -e MINIO_SECRET_KEY=minio123  -v compas-minio:/data -p 9000:9000 --name compas-minio minio/minio server /data`,
      },
    },
    globalContainers: [
      "compas-postgres-12",
      "compas-postgres-13",
      "compas-postgres-14",
      "compas-minio",
    ],
    containersOnHost: [],
  };
}

/**
 * Brute force check if docker is available
 */
async function isDockerAvailable() {
  try {
    await exec("docker -v");
    return true;
  } catch {
    return false;
  }
}
