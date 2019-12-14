import { Logger } from "@lightbase/insight";
import { spawn } from "child_process";

/**
 * Executes command via child_process#spawn which uses the same stdio as this process
 */
export function promiseSpawn(logger: Logger, command: string, args: string[]) {
  logger.info("Spawning:", command, args.join(" "));
  return new Promise((resolve, reject) => {
    const sp = spawn(command, args, { stdio: "inherit" });

    sp.on("error", reject);
    sp.on("exit", resolve);
  });
}
