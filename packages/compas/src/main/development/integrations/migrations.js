import { exec, isNil, pathJoin } from "@compas/stdlib";
import { configFlatten } from "../../../shared/config.js";
import { writeFileChecked } from "../../../shared/fs.js";
import { cacheRemoveDynamicAction } from "../cache.js";

const MIGRATIONS_RUN_ACTION = "migrationsRunAction";
const MIGRATIONS_REBUILD_ACTION = "migrationsRebuildAction";

const CHECK_PATH = ".cache/compas/migrations/check.js";
const EXEC_PATH = ".cache/compas/migrations/exec.js";
const REBUILD_PATH = ".cache/compas/migrations/rebuild.js";

/**
 * @type {import("./base.js").Integration}
 */
export const migrationsIntegration = {
  getStaticName() {
    return "migrations";
  },

  onColdStart(state) {
    state.dynamicActionCallbacks[MIGRATIONS_RUN_ACTION] = migrationsRunAction;
    state.dynamicActionCallbacks[MIGRATIONS_REBUILD_ACTION] =
      migrationsRebuildAction;

    state.runTask("migrationsDetermineState", migrationsDetermineState);
  },

  onCachedStart(state) {
    state.dynamicActionCallbacks[MIGRATIONS_RUN_ACTION] = migrationsRunAction;
    state.dynamicActionCallbacks[MIGRATIONS_REBUILD_ACTION] =
      migrationsRebuildAction;

    state.runTask("migrationsDetermineState", migrationsDetermineState);
  },

  onExternalChanges(state, { filePaths }) {
    if (filePaths.length === 0) {
      state.runTask("migrationsDetermineState", migrationsDetermineState);
    } else if (filePaths.some((it) => it.includes("migrations"))) {
      state.runTask("migrationsDetermineState", migrationsDetermineState);
    }
  },
};

/**
 *
 * @param {import("../state.js").State} state
 * @returns {Promise<void>}
 */
async function migrationsDetermineState(state) {
  const configs = configFlatten(state.cache.config);

  for (const config of configs) {
    if (
      !state.cache.rootDirectories?.includes(config.rootDirectory) ||
      isNil(state.cache.config?.migrations)
    ) {
      cacheRemoveDynamicAction(
        state.cache,
        MIGRATIONS_RUN_ACTION,
        config.rootDirectory,
      );
      cacheRemoveDynamicAction(
        state.cache,
        MIGRATIONS_REBUILD_ACTION,
        config.rootDirectory,
      );
      continue;
    }

    const filePath = pathJoin(config.rootDirectory, CHECK_PATH);

    await writeFileChecked(
      filePath,
      `
import { existsSync } from "node:fs";
import { mainFn, pathJoin } from "@compas/stdlib";
import {
  migrationsInitContext,
  migrationsGetInfo,
  newPostgresConnection,
} from "@compas/store";

mainFn(import.meta, main);

async function main() {
  const settingsPath = pathJoin(process.cwd(), "src/services/postgres.js");
  const { postgresConnectionSettings } = existsSync(settingsPath)
    ? await import(settingsPath)
    : {
        postgresConnectionSettings: {
          max: 1,
          createIfNotExists: true,
        },
      };

  postgresConnectionSettings.max = 1;

  const sql = await newPostgresConnection(postgresConnectionSettings);

  const mc = await migrationsInitContext(sql);
  const { hashChanges, migrationQueue } = await migrationsGetInfo(mc);
  const filteredHashChanges = hashChanges.filter(
    (it) => !migrationQueue.some((queue) => queue.number === it.number),
  );

  let result = "result: no-changes";

  if (migrationQueue.length > 0) {
    result = "result: migrate";
  }

  if (filteredHashChanges.length > 0) {
    result = "result: rebuild";
  }

  console.log(result);
  process.exit(0);
}
`,
    );

    const { stdout } = await exec(`node ${CHECK_PATH}`, {
      cwd: config.rootDirectory,
      env: state.env.hostEnv,
    });

    if (stdout.includes("result: migrate")) {
      state.cache.dynamicAvailableActions.push({
        name: "Execute pending migrations",
        rootDirectory: config.rootDirectory,
        callback: MIGRATIONS_RUN_ACTION,
        shortcut: "M",
      });
    } else if (stdout.includes("result: rebuild")) {
      state.cache.dynamicAvailableActions.push({
        name: "Reapply all migrations",
        rootDirectory: config.rootDirectory,
        callback: MIGRATIONS_REBUILD_ACTION,
        shortcut: "M",
      });
    }
  }
}

/**
 *
 * @param {import("../state.js").State} state
 * @param {string} rootDirectory
 * @returns {Promise<void>}
 */
async function migrationsRunAction(state, rootDirectory) {
  cacheRemoveDynamicAction(state.cache, MIGRATIONS_RUN_ACTION, rootDirectory);

  const filePath = pathJoin(rootDirectory, EXEC_PATH);

  await writeFileChecked(
    filePath,
    `
import { existsSync } from "node:fs";
import { mainFn, pathJoin } from "@compas/stdlib";
import {
  migrationsInitContext,
  migrationsGetInfo,
  newPostgresConnection,
  migrationsRun,
} from "@compas/store";

mainFn(import.meta, main);

async function main() {
  const settingsPath = pathJoin(process.cwd(), "src/services/postgres.js");
  const { postgresConnectionSettings } = existsSync(settingsPath)
    ? await import(settingsPath)
    : {
        postgresConnectionSettings: {
          max: 1,
          createIfNotExists: true,
        },
      };

  postgresConnectionSettings.max = 1;

  const sql = await newPostgresConnection(postgresConnectionSettings);

  const mc = await migrationsInitContext(sql);
  await migrationsGetInfo(mc);
  await migrationsRun(mc);
  process.exit(0);
}
`,
  );

  await exec(`node ${EXEC_PATH}`, {
    cwd: rootDirectory,
    env: state.env.hostEnv,
  });
}

/**
 *
 * @param {import("../state.js").State} state
 * @param {string} rootDirectory
 * @returns {Promise<void>}
 */
async function migrationsRebuildAction(state, rootDirectory) {
  cacheRemoveDynamicAction(
    state.cache,
    MIGRATIONS_REBUILD_ACTION,
    rootDirectory,
  );

  const filePath = pathJoin(rootDirectory, REBUILD_PATH);

  await writeFileChecked(
    filePath,
    `
import { existsSync } from "node:fs";
import { environment, exec, mainFn, pathJoin } from "@compas/stdlib";
import {
  migrationsInitContext,
  migrationsGetInfo,
  newPostgresConnection,
  migrationsRun,
} from "@compas/store";

mainFn(import.meta, main);

async function main() {
  const settingsPath = pathJoin(process.cwd(), "src/services/postgres.js");
  const { postgresConnectionSettings } = existsSync(settingsPath)
    ? await import(settingsPath)
    : {
        postgresConnectionSettings: {
          max: 1,
          createIfNotExists: true,
        },
      };

  postgresConnectionSettings.max = 1;

  const { stdout: runningStdout } = await exec(
    "docker container ls --format '{{.Names}}'",
  );

  const containersOnHost = runningStdout
    .split("\\n")
    .map((it) => it.trim())
    .filter((it) => it.length > 0);

  const postgresContainer = containersOnHost.find((it) =>
    it.includes("postgres"),
  );
  const projects = [environment.APP_NAME];

  const { stdout } = await exec(
    \`echo "SELECT 'DROP DATABASE ' || quote_ident(datname) || ';' FROM pg_database WHERE ($\{projects
      .map((it) => \`datname LIKE '$\{it}%'\`)
      .join(" OR ",)}) AND datistemplate=false" | docker exec -i $\{postgresContainer} psql --user postgres\`,
  );

  logger.info(
    \`Removing $\{stdout.split("DROP").length -
    1} database(s) and creating $\{projects.length} new empty database(s).\`,
  );

  let pgCommand =
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid();";
  for (const command of stdout.split("\\n")) {
    if (command.trim().startsWith("DROP DATABASE")) {
      pgCommand += \`$\{command.trim()}\`;
    }
  }

  for (const project of projects) {
    pgCommand += \`CREATE DATABASE "$\{project}";\`;
  }

  await exec(
    \`echo '$\{pgCommand}' | docker exec -i $\{postgresContainer} psql --user postgres\`,
  );

  const sql = await newPostgresConnection(postgresConnectionSettings);

  const mc = await migrationsInitContext(sql);
  await migrationsGetInfo(mc);
  await migrationsRun(mc);
  process.exit(0);
}
`,
  );

  await exec(`node ${REBUILD_PATH}`, {
    cwd: rootDirectory,
    env: state.env.hostEnv,
  });
}
