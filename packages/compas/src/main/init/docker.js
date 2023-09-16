import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { configResolveProjectConfig } from "../../shared/config.js";
import { writeFileChecked } from "../../shared/fs.js";
import { logger } from "../../shared/output.js";

/**
 * @param {import("../../shared/config.js").ConfigEnvironment} env
 * @returns {Promise<void>}
 */
export async function initDocker(env) {
  if (env.isCI) {
    logger.info({
      message: "'compas init docker' is not supported in CI.",
    });
    return;
  }

  const config = await configResolveProjectConfig();

  if (Object.keys(config.dockerContainers).length > 0) {
    logger.info(
      "The project already includes 'dockerContainers' in the config. Please edit the file manually or remove 'dockerContainers' from the config and rerun 'compas init docker'.",
    );

    return;
  }

  const dockerContainers = {
    [`compas-postgres-16`]: {
      image: "postgres:16",
      createArguments:
        "-e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e PGDATA=/var/lib/postgresql/data/pgdata -v compas-postgres-16:/var/lib/postgresql/data/pgdata -p 5432:5432",
    },
    "compas-minio": {
      image: "minio/minio",
      createArguments:
        "-e MINIO_ACCESS_KEY=minio -e MINIO_SECRET_KEY=minio123  -v compas-minio:/data -p 9000:9000",
      runArguments: "server /data",
    },
  };

  if (existsSync("./config/compas.json")) {
    const contents = JSON.parse(
      await readFile("./config/compas.json", "utf-8"),
    );
    contents.dockerContainers = dockerContainers;

    await writeFileChecked(
      "./config/compas.json",
      `${JSON.stringify(contents, null, 2)}\n`,
    );
  } else {
    await writeFileChecked(
      "./config/compas.json",
      `${JSON.stringify(
        {
          dockerContainers,
        },
        null,
        2,
      )}\n`,
    );
  }

  logger.info(
    "Updated the config. Run 'compas' to automatically start the containers. If 'compas' was still running, it is downloading the images and starting them as soon as possible.",
  );
}
