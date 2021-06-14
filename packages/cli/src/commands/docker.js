import { environment, exec, spawn } from "@compas/stdlib";
import { dockerMigrateCommand } from "../migrate/index.js";

const SUB_COMMANDS = ["up", "down", "clean", "reset", "migrate"];

const containers = {
  "compas-postgres-12": {
    pullCommand: ["docker", ["pull", "postgres:12"]],
    createCommand: `docker create -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e PGDATA=/var/lib/postgresql/data/pgdata -v compas-postgres-12:/var/lib/postgresql/data/pgdata -p 5432:5432 --name compas-postgres-12 postgres:12`,
  },
  "compas-postgres-13": {
    pullCommand: ["docker", ["pull", "postgres:13"]],
    createCommand: `docker create -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e PGDATA=/var/lib/postgresql/data/pgdata -v compas-postgres-13:/var/lib/postgresql/data/pgdata -p 5432:5432 --name compas-postgres-13 postgres:13`,
  },
  "compas-minio": {
    pullCommand: ["docker", ["pull", "minio/minio"]],
    createCommand: `docker create -e MINIO_ACCESS_KEY=minio -e MINIO_SECRET_KEY=minio123  -v compas-minio:/data -p 9000:9000 --name compas-minio minio/minio server /data`,
  },
};

/**
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @returns {Promise<{ exitCode?: number }>}
 */
export async function dockerCommand(logger, command) {
  const subCommand = command.arguments[0];
  if (SUB_COMMANDS.indexOf(subCommand) === -1) {
    logger.info(
      `Unknown command: 'compas docker ${
        subCommand ?? ""
      }'. Please use one of ${SUB_COMMANDS.join(", ")}`,
    );
    return { exitCode: 1 };
  }

  if (subCommand === "migrate") {
    return await dockerMigrateCommand(logger, command);
  }

  if (!(await isDockerAvailable())) {
    logger.error(
      "Make sure to install Docker first. See https://docs.docker.com/install/",
    );
    return { exitCode: 1 };
  }

  const { knownContainers, exitCode, stdout, stderr } =
    await getKnownContainers();
  if (exitCode !== 0) {
    logger.error(`Could not list containers.`);
    logger.error({ exitCode, stderr, stdout });
  }

  const enabledContainers = [
    `compas-postgres-${getPostgresVersion()}`,
    `compas-minio`,
  ];

  const disabledContainers = Object.keys(containers).filter(
    (it) => enabledContainers.indexOf(it) === -1,
  );

  const containerInfo = {
    knownContainers,
    enabledContainers,
    disabledContainers,
  };

  if (subCommand === "up") {
    return { exitCode: await startContainers(logger, containerInfo) };
  } else if (subCommand === "down") {
    return { exitCode: await stopContainers(logger, containerInfo) };
  } else if (subCommand === "clean") {
    return { exitCode: await cleanContainers(logger, containerInfo) };
  } else if (subCommand === "reset") {
    return { exitCode: await resetDatabase(logger, containerInfo) };
  }
}

/**
 * @param {Logger} logger
 * @param {{
 *   enabledContainers: string[],
 *   disabledContainers: string[],
 *   knownContainers: string[]
 * }} containerInfo
 * @returns {Promise<number>}
 */
async function startContainers(logger, containerInfo) {
  const stopExitCode = await stopContainers(logger, {
    knownContainers: containerInfo.knownContainers,
    enabledContainers: containerInfo.disabledContainers,
    disabledContainers: [],
  });

  if (stopExitCode !== 0) {
    return stopExitCode;
  }

  for (const name of containerInfo.enabledContainers) {
    logger.info(`Creating ${name} container`);
    if (containerInfo.knownContainers.indexOf(name) === -1) {
      logger.info(`Pulling ${name}`);
      const { exitCode: pullExitCode } = await spawn(
        ...containers[name].pullCommand,
      );
      if (pullExitCode !== 0) {
        return pullExitCode;
      }

      const { exitCode: createExitCode } = await exec(
        containers[name].createCommand,
      );
      if (createExitCode !== 0) {
        return createExitCode;
      }
    }
  }

  logger.info(`Starting containers`);
  const { exitCode } = await spawn(`docker`, [
    "start",
    ...containerInfo.enabledContainers,
  ]);

  if (exitCode !== 0) {
    return exitCode;
  }

  logger.info(`Waiting for Postgres ${getPostgresVersion()} to be ready...`);
  // Race for 30 seconds against the pg_isready command
  await Promise.race([
    exec(
      `until docker exec compas-postgres-${getPostgresVersion()} pg_isready ; do sleep 1 ; done`,
      { shell: true },
    ),
    new Promise((resolve, reject) => {
      setTimeout(reject, 30000);
    }),
  ]);

  return exitCode;
}

/**
 * Stops 'available' containers.
 * By using the `knownContainers` as a check, we don't error when a container is not yet
 * created.
 *
 * @param {Logger} logger
 * @param {{
 *   enabledContainers: string[],
 *   disabledContainers: string[],
 *   knownContainers: string[]
 * }} containerInfo
 * @returns {Promise<number>}
 */
async function stopContainers(logger, containerInfo) {
  const containers = containerInfo.enabledContainers.filter(
    (it) => containerInfo.knownContainers.indexOf(it) !== -1,
  );

  if (containers.length === 0) {
    return 0;
  }

  logger.info(`Stopping containers`);
  const { exitCode } = await spawn(`docker`, ["stop", ...containers]);

  return exitCode;
}

/**
 * Cleanup 'available' known containers.
 * By using the `knownContainers` as a check, we don't error when a container is not yet
 * created.
 *
 * @param {Logger} logger
 * @param {{
 *   enabledContainers: string[],
 *   disabledContainers: string[],
 *   knownContainers: string[]
 * }} containerInfo
 * @returns {Promise<number>}
 */
async function cleanContainers(logger, containerInfo) {
  const stopExit = await stopContainers(logger, containerInfo);
  if (stopExit !== 0) {
    return stopExit;
  }

  logger.info(`Removing containers`);
  const containersAndVolumes = containerInfo.enabledContainers.filter(
    (it) => containerInfo.knownContainers.indexOf(it) !== -1,
  );
  const { exitCode: rmExit } = await spawn(`docker`, [
    "rm",
    ...containersAndVolumes,
  ]);
  if (rmExit !== 0) {
    return rmExit;
  }

  logger.info(`Removing volumes`);
  const { exitCode: volumeRmExit } = await spawn(`docker`, [
    "volume",
    "rm",
    ...containersAndVolumes,
  ]);

  return volumeRmExit;
}

/**
 * @param {Logger} logger
 * @param {{ enabledContainers: string[], disabledContainers: string[], knownContainers:
 *   string[] }} containerInfo
 * @returns {Promise<number>}
 */
async function resetDatabase(logger, containerInfo) {
  const startExitCode = await startContainers(logger, containerInfo);
  if (startExitCode !== 0) {
    return startExitCode;
  }

  const name = environment.APP_NAME;

  logger.info(`Resetting ${name} database`);
  const { exitCode: postgresExit } = await spawn(`sh`, [
    "-c",
    `echo 'DROP DATABASE IF EXISTS ${name}; CREATE DATABASE ${name}' | docker exec -i compas-postgres-${getPostgresVersion()} psql --user postgres`,
  ]);

  if (postgresExit !== 0) {
    return postgresExit;
  }

  return 0;
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

/**
 * Get list of available containers
 *
 * @returns {Promise<{ exitCode: number, knownContainers: string[], stdout?: string,
 *   stderr?: string }>}
 */
async function getKnownContainers() {
  const { exitCode, stdout, stderr } = await exec(
    "docker container ls -a --format '{{.Names}}'",
  );
  if (exitCode !== 0) {
    return { exitCode, knownContainers: [], stdout, stderr };
  }

  const knownContainers = stdout
    .split("\n")
    .map((it) => it.trim())
    .filter((it) => it.length > 0);

  return {
    exitCode,
    knownContainers,
  };
}

function getPostgresVersion() {
  return Number(environment.POSTGRES_VERSION ?? "12");
}
