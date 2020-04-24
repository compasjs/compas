import { exec } from "@lbu/stdlib";

const SUB_COMMANDS = ["up", "down"];

const supportedContainers = {
  "lbu-postgres": {
    createCommand:
      "docker create -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e PGDATA=/var/lib/postgresql/data/pgdata -v lbu-pg-data:/var/lib/postgresql/data/pgdata -p 5432:5432 --name lbu-postgres postgres:12",
  },
  "lbu-minio": {
    createCommand: `docker create -e MINIO_ACCESS_KEY=minio -e MINIO_SECRET_KEY=minio123  -v lbu-minio:/data -p 9000:9000 --name lbu-minio minio/minio server /data`,
  },
};

/**
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @return {Promise<void>}
 */
export async function dockerCommand(logger, command) {
  const subCommand = command.arguments[0];
  if (SUB_COMMANDS.indexOf(subCommand) === -1) {
    logger.info(
      `Unknown command: 'lbu docker ${subCommand}'. Please use one of ${SUB_COMMANDS.join(
        ", ",
      )}`,
    );
    return;
  }

  if (!(await isDockerAvailable())) {
    logger.error(
      "Make sure to install Docker first. See https://docs.docker.com/install/",
    );
    return;
  }

  if (subCommand === "up") {
    await startContainers();
  } else if (subCommand === "down") {
    await stopContainers();
  }
}

async function startContainers() {
  const { stdout } = await exec("docker container ls -a --format '{{.Names}}'");

  for (const name of Object.keys(supportedContainers)) {
    if (stdout.indexOf(name) === -1) {
      await exec(supportedContainers[name].createCommand);
    }
  }

  for (const name of Object.keys(supportedContainers)) {
    await exec(`docker start ${name}`);
  }
}

async function stopContainers() {
  for (const name of Object.keys(supportedContainers)) {
    await exec(`docker stop ${name}`);
  }
}

async function isDockerAvailable() {
  try {
    await exec("docker -v");
    return true;
  } catch {
    return false;
  }
}
