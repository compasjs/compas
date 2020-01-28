import { spawnSync } from "child_process";
import { PluginMetaData } from "../../types";

export function getPlugin(): PluginMetaData {
  return {
    name: "lint",
    description: "Run eslint & prettier via lbu lint",
    hooks: {
      postRunner: () => {
        spawnSync(`yarn`, ["lbu", "lint"], { stdio: "inherit" });
      },
    },
  };
}
