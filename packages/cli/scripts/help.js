import { dirnameForModule, mainFn } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { join } from "path";
import { cliLogger, getKnownScripts } from "../index.js";

const { name, version } = JSON.parse(
  readFileSync(join(dirnameForModule(import.meta), "../package.json"), "utf-8"),
);

const formatCommands = () => {
  const scripts = getKnownScripts();
  let result = {
    USER: [],
    CLI: [],
    YARN: [],
  };

  for (const key of Object.keys(scripts)) {
    result[scripts[key].type].push(key);
  }

  return `LBU internal: ${result["CLI"].join(", ")}
User: ${result["USER"].join(", ")}
Package.json: ${result["YARN"].join(", ")}`;
};

mainFn(import.meta, cliLogger, async logger => {
  logger.info(
    `${name} -- ${version}\nUsage: lbu [command] [...args]\n\nAvailable commands:\n${formatCommands()}`,
  );
});

export const disallowNodemon = true;
