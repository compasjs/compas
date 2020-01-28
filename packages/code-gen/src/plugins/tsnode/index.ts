import { PluginMetaData } from "../../types";

export function getPlugin(): PluginMetaData {
  return {
    name: "tsnode",
    description: "Use Typescript for the generator input",
    hooks: {
      beforeRequire: () => {
        try {
          require("ts-node/register");
        } catch {}
      },
    },
  };
}
