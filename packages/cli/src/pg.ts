import { Logger } from "@lbu/insight";
import { exec, spawn } from "@lbu/stdlib";
import { Command, CliContext } from "./types";
import { execCommand, getLbuVersion } from "./utils";

const commandMap: Command = {
  up: pgUpCommand,
  down: pgDownCommand,
  help: pgHelpCommand,
};

export const pgCommand: Command = (ctx, args) => {
  return execCommand(ctx, args, commandMap, "help");
};

async function pgHelpCommand({ logger }: CliContext) {
  const str = `
lbu pg [up|down|help] -- ${getLbuVersion()} 
Manage a postgres docker container with a default username and password of 'lbu-postgres'.${await formatDockerRequirement(
    logger,
  )}`;

  logger.info(str);
}

async function pgUpCommand({ logger }: CliContext) {
  const dockerAvailable = await checkDockerAvailability(logger);
  if (!dockerAvailable) {
    logger.info(await formatDockerRequirement(logger));
    return;
  }

  const { stdout } = await exec(
    logger,
    "docker container ls -a --filter name=lbu-postgres --format '{{.Names}}'",
  );

  if (stdout.indexOf("lbu-postgres") === -1) {
    await spawn(logger, "docker", [
      "create",
      "-e",
      "POSTGRES_USER=lbu-postgres",
      "-e",
      "POSTGRES_PASSWORD=lbu-postgres",
      "-e",
      "PGDATA=/var/lib/postgresql/data/pgdata",
      "-v",
      "lbu-pg-data:/var/lib/postgresql/data/pgdata",
      "-p",
      "5432:5432",
      "--name",
      "lbu-postgres",
      "postgres:12",
    ]);
  }

  await exec(logger, "docker start lbu-postgres");
}

async function pgDownCommand({ logger }: CliContext) {
  const dockerAvailable = await checkDockerAvailability(logger);
  if (!dockerAvailable) {
    logger.info(await formatDockerRequirement(logger));
    return;
  }

  await exec(logger, "docker stop lbu-postgres");
}

async function formatDockerRequirement(logger: Logger): Promise<string> {
  const dockerAvailable = await checkDockerAvailability(logger);
  return dockerAvailable
    ? ""
    : "\n\nMake sure to install Docker first. See https://docs.docker.com/install/";
}

async function checkDockerAvailability(logger: Logger): Promise<boolean> {
  try {
    await exec(logger, "docker -v");
    return true;
  } catch (e) {
    return false;
  }
}
