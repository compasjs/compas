import { Logger } from "../insight";
import { exec, spawn } from "../stdlib";

export async function dockerCommand(
  logger: Logger,
  [command]: string[],
): Promise<void> {
  if (command !== "up" && command !== "down") {
    logger.error("Unknown argument. Please specify up|down");
    return;
  }

  // check if docker is installed
  try {
    await exec(logger, "docker -v");
  } catch (e) {
    logger.error("Docker not found. Please install docker.");
    return;
  }

  if (command === "up") {
    await runDockerUp(logger);
  } else if (command === "down") {
    await runDockerDown(logger);
  }
}

dockerCommand.help =
  "lbf docker [up|down] -- Start a persistent postgres container\nNote: Currently it is not possible to overwrite the default username and password\nUsername: postgres\nPassword: postgres";

// Note that the volume is created implicitly
async function runDockerUp(logger: Logger) {
  const { stdout } = await exec(
    logger,
    "docker container ls -a --filter name=lbf-postgres --format '{{.Names}}'",
  );

  if (stdout.indexOf("lbf-postgres") === -1) {
    await spawn(logger, "docker", [
      "create",
      "-e",
      "POSTGRES_USER=postgres",
      "-e",
      "POSTGRES_PASSWORD=postgres",
      "-e",
      "PGDATA=/var/lib/postgresql/data/pgdata",
      "-v",
      "lbf-pg-data:/var/lib/postgresql/data/pgdata",
      "-p",
      "5432:5432",
      "--name",
      "lbf-postgres",
      "postgres:12",
    ]);
  }

  await exec(logger, "docker start lbf-postgres");
}

async function runDockerDown(logger: Logger) {
  await exec(logger, "docker stop lbf-postgres");
}
