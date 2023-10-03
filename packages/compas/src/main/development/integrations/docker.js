import { exec, isNil } from "@compas/stdlib";

/**
 * @type {import("./base.js").Integration}
 */
export const dockerIntegration = {
  getStaticName() {
    return "docker";
  },

  async onColdStart(state) {
    await dockerStartNecessaryContainers(state);
  },

  async onCachedStart(state) {
    await dockerStartNecessaryContainers(state);
  },

  async onExternalChanges(state, { filePaths }) {
    const hasConfigChange = filePaths.some((it) =>
      it.endsWith("config/compas.json"),
    );

    if (hasConfigChange) {
      await dockerStartNecessaryContainers(state);
    }
  },
};

/**
 *
 * @param {import("../state.js").State} state
 * @returns {Promise<void>}
 */
async function dockerStartNecessaryContainers(state) {
  const containersInConfig = dockerListContainersInConfig(state);

  if (Object.keys(containersInConfig).length === 0) {
    return;
  }

  if (!(await dockerCheckEnv())) {
    state.logInformation(
      "Can't start docker containers. Make sure that Docker can be executed without 'sudo'. See https://docs.docker.com/install/ for more information.",
    );

    return;
  }

  let didExecuteAHostAction = false;

  const { containersOnHost, runningContainersOnHost } =
    await dockerContainersOnHost();

  const containersToStop = runningContainersOnHost.filter((it) =>
    isNil(containersInConfig[it]),
  );

  if (containersToStop.length > 0) {
    didExecuteAHostAction = true;

    state.logInformation(
      "Stopping containers that are not required for the current project.",
    );
    await exec(`docker stop ${containersToStop.join(" ")}`);
  }

  const imagesToPull = [];
  for (const key of Object.keys(containersInConfig)) {
    if (!containersOnHost.includes(key)) {
      imagesToPull.push(containersInConfig[key].image);
    }
  }

  if (imagesToPull.length > 0) {
    didExecuteAHostAction = true;

    state.logInformation(
      "Downloading images and creating containers in the background...",
    );
    await Promise.all(imagesToPull.map((it) => exec(`docker pull ${it}`)));
  }

  for (const key of Object.keys(containersInConfig)) {
    if (!containersOnHost.includes(key)) {
      didExecuteAHostAction = true;

      const info = containersInConfig[key];
      await exec(
        `docker create ${info.createArguments ?? ""} --name ${key} ${
          info.image
        } ${info.runArguments ?? ""}`,
      );
    }
  }

  const containersToStart = Object.keys(containersInConfig).filter(
    (it) => !runningContainersOnHost.includes(it),
  );

  if (containersToStart.length > 0) {
    didExecuteAHostAction = true;

    await exec(`docker start ${Object.keys(containersInConfig).join(" ")}`);
  }

  if (didExecuteAHostAction) {
    state.logInformation("Required docker containers are running!");
  }
}

/**
 *
 * @param {import("../state.js").State} state
 * @returns {import("../../../generated/common/types.js").CompasResolvedConfig["dockerContainers"]}
 */
function dockerListContainersInConfig(state) {
  /** @type {import("../../../generated/common/types.js").CompasResolvedConfig["dockerContainers"]} */
  const result = {};

  if (!state.cache.config) {
    return result;
  }

  function handleConfig(config) {
    for (const name of Object.keys(config.dockerContainers ?? {})) {
      result[name] = config.dockerContainers[name];
    }

    for (const p of config.projects) {
      handleConfig(p);
    }
  }

  handleConfig(state.cache.config);

  return result;
}

async function dockerCheckEnv() {
  try {
    await exec("docker -v");
    return true;
  } catch {
    return false;
  }
}

async function dockerContainersOnHost() {
  const { stdout: allStdout } = await exec(
    "docker container ls -a --format '{{.Names}}'",
  );
  const { stdout: runningStdout } = await exec(
    "docker container ls --format '{{.Names}}'",
  );

  const containersOnHost = allStdout
    .split("\n")
    .map((it) => it.trim())
    .filter((it) => it.length > 0);

  const runningContainersOnHost = runningStdout
    .split("\n")
    .map((it) => it.trim())
    .filter((it) => it.length > 0);

  return {
    containersOnHost,
    runningContainersOnHost,
  };
}
