import { exec, isNil } from "@compas/stdlib";
import { BaseIntegration } from "./base.js";

export class DockerIntegration extends BaseIntegration {
  constructor(state) {
    super(state, "dockerIntegration");
  }

  async init() {
    await super.init();

    const resolvedContainers = this.listContainers();
    if (
      Object.keys(resolvedContainers).length > 0 &&
      !(await this.checkEnv())
    ) {
      this.state.logInformation(
        "Can't start docker containers. Make sure that Docker can be executed without 'sudo'. See https://docs.docker.com/install/ for more information.",
      );
    }

    this.state.runTask("dockerStart", this.startContainers(resolvedContainers));
  }

  async onCacheUpdated() {
    await super.onCacheUpdated();

    const resolvedContainers = this.listContainers();
    this.state.runTask("dockerCheck", this.startContainers(resolvedContainers));
  }

  async checkEnv() {
    try {
      await exec("docker -v");
      return true;
    } catch {
      return false;
    }
  }

  async startContainers(containerObject) {
    if (Object.keys(containerObject).length === 0) {
      return;
    }

    if (!(await this.checkEnv())) {
      return;
    }

    let didExecuteAHostAction = false;

    const { containersOnHost, runningContainersOnHost } =
      await this.containersOnHost();

    const containersToStop = runningContainersOnHost.filter((it) =>
      isNil(containerObject[it]),
    );

    if (containersToStop.length > 0) {
      didExecuteAHostAction = true;

      this.state.logInformation(
        "Stopping containers that are not required for the current project.",
      );
      await exec(`docker stop ${containersToStop.join(" ")}`);
    }

    const imagesToPull = [];
    for (const key of Object.keys(containerObject)) {
      if (!containersOnHost.includes(key)) {
        imagesToPull.push(containerObject[key].image);
      }
    }

    if (imagesToPull.length > 0) {
      didExecuteAHostAction = true;

      this.state.logInformation(
        "Downloading images and creating containers in the background...",
      );
      await Promise.all(imagesToPull.map((it) => exec(`docker pull ${it}`)));
    }

    for (const key of Object.keys(containerObject)) {
      if (!containersOnHost.includes(key)) {
        didExecuteAHostAction = true;

        const info = containerObject[key];
        await exec(
          `docker create ${info.createArguments ?? ""} --name ${key} ${
            info.image
          } ${info.runArguments ?? ""}`,
        );
      }
    }

    const containersToStart = Object.keys(containerObject).filter(
      (it) => !runningContainersOnHost.includes(it),
    );

    if (containersToStart.length > 0) {
      didExecuteAHostAction = true;

      await exec(`docker start ${Object.keys(containerObject).join(" ")}`);
    }

    if (didExecuteAHostAction) {
      this.state.logInformation("Required docker containers are running!");
    }
  }

  async containersOnHost() {
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

  listContainers() {
    const result = {};

    function handleConfig(config) {
      for (const name of Object.keys(config.dockerContainers)) {
        result[name] = config.dockerContainers[name];
      }

      for (const p of config.projects) {
        handleConfig(p);
      }
    }

    handleConfig(this.state.cache.config);

    return result;
  }
}
