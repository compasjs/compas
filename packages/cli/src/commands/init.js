import { writeFile } from "fs/promises";
import { pathJoin } from "@compas/stdlib";

/**
 * @param {Logger} logger
 * @param {import("../parse").UtilCommand} command
 * @returns {Promise<{ exitCode: number }>}
 */
export async function initCommand(logger, command) {
  const outDir = process.cwd();
  const subCommand = command.arguments[0];

  if (subCommand === "--jsconfig") {
    await writeJsconfig(logger, outDir);

    return { exitCode: 0 };
  }

  logger.error("Unknown subcommand.");
  return { exitCode: 1 };
}

async function writeJsconfig(logger, outDir) {
  logger.info("Set jsconfig.json");
  await writeFile(
    pathJoin(outDir, "jsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "esnext",
          lib: ["esnext"],
          noEmit: true,
          module: "esnext",
          checkJs: true,
          maxNodeModuleJsDepth: 0,
          baseUrl: "./",
          moduleResolution: "node",
          strict: true,
        },
        typeAcquisition: {
          enable: true,
        },
        include: ["**/*.js"],
        exclude: ["**/*.test.js"],
      },
      null,
      2,
    ),
  );
}
