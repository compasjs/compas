import { exec, spawn } from "@lbu/stdlib";

const SUB_COMMANDS = ["up", "down", "clean", "reset"];

const supportedContainers = {
  "lbu-postgres": {
    createCommand:
      "docker create -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e PGDATA=/var/lib/postgresql/data/pgdata -v lbu-postgres:/var/lib/postgresql/data/pgdata -p 5432:5432 --name lbu-postgres postgres:12",
  },
  "lbu-minio": {
    createCommand: `docker create -e MINIO_ACCESS_KEY=minio -e MINIO_SECRET_KEY=minio123  -v lbu-minio:/data -p 9000:9000 --name lbu-minio minio/minio server /data`,
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
      `Unknown command: 'lbu docker ${subCommand}'. Please use one of ${SUB_COMMANDS.join(
        ", ",
      )}`,
    );
    return { exitCode: 1 };
  }

  if (!(await isDockerAvailable())) {
    logger.error(
      "Make sure to install Docker first. See https://docs.docker.com/install/",
    );
    return { exitCode: 1 };
  }

  if (subCommand === "up") {
    return { exitCode: await startContainers(logger) };
  } else if (subCommand === "down") {
    return { exitCode: await stopContainers(logger) };
  } else if (subCommand === "clean") {
    return { exitCode: await cleanContainers(logger) };
  } else if (subCommand === "reset") {
    return { exitCode: await resetDatabase(logger) };
  }
}

/**
 * @param {Logger} logger
 * @returns {Promise<number>}
 */
async function startContainers(logger) {
  const { stdout, exitCode: listContainersExit } = await exec(
    "docker container ls -a --format '{{.Names}}'",
  );
  if (listContainersExit !== 0) {
    return listContainersExit;
  }

  for (const name of Object.keys(supportedContainers)) {
    logger.info(`Creating ${name} container`);
    if (stdout.indexOf(name) === -1) {
      const { exitCode } = await exec(supportedContainers[name].createCommand);
      if (exitCode !== 0) {
        return exitCode;
      }
    }
  }

  logger.info(`Starting containers`);
  const { exitCode } = await spawn(`docker`, [
    "start",
    ...Object.keys(supportedContainers),
  ]);

  return exitCode;
}

/**
 * @param {Logger} logger
 * @returns {Promise<number>}
 */
async function stopContainers(logger) {
  logger.info(`Stopping containers`);
  const { exitCode } = await spawn(`docker`, [
    "stop",
    ...Object.keys(supportedContainers),
  ]);

  return exitCode;
}

/**
 * @param {Logger} logger
 * @returns {Promise<number>}
 */
async function cleanContainers(logger) {
  const stopExit = await stopContainers(logger);
  if (stopExit !== 0) {
    return stopExit;
  }

  logger.info(`Removing containers`);
  const { exitCode: rmExit } = await spawn(`docker`, [
    "rm",
    ...Object.keys(supportedContainers),
  ]);
  if (rmExit !== 0) {
    return rmExit;
  }

  logger.info(`Removing volumes`);
  const { exitCode: volumeRmExit } = await spawn(`docker`, [
    "volume",
    "rm",
    ...Object.keys(supportedContainers),
  ]);

  return volumeRmExit;
}

/**
 * @param {Logger} logger
 * @returns {Promise<number>}
 */
async function resetDatabase(logger) {
  const startExit = await startContainers(logger);
  if (startExit !== 0) {
    return startExit;
  }

  const name = process.env.APP_NAME;

  logger.info(`Resetting ${name} database`);
  const { exitCode: postgresExit } = await spawn(`sh`, [
    "-c",
    `echo 'DROP DATABASE ${name}; CREATE DATABASE ${name}' | docker exec -i lbu-postgres psql --user postgres`,
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
