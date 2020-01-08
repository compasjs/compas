import { addTypeFilter, Logger, removeTypeFilter } from "@lightbase/insight";
import { exec as cpExec, spawn as cpSpawn } from "child_process";
import { promisify } from "util";
import { setFlagsFromString } from "v8";
import { runInNewContext } from "vm";
import { isNil } from "./lodash";

/**
 * Returns an integer with the current amount of seconds since Unix Epoch
 */
export function getSecondsSinceEpoch(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Internal gc function reference
 * Note that this is undefined if the gc function is not called and Node is not running with
 * --expose-gc on
 */
let internalGc = global.gc;

/**
 * Let V8 know to please run the garbage collector.
 */
export function gc() {
  if (isNil(internalGc)) {
    setFlagsFromString("--expose_gc");
    internalGc = runInNewContext("gc");
  }

  internalGc();
}

const promExec = promisify(cpExec);

export async function exec(
  logger: Logger,
  command: string,
): Promise<{ stdout: string; stderr: string }> {
  logger.info("Executing", command);
  return promExec(command, { encoding: "utf8" });
}

export async function spawn(
  logger: Logger,
  command: string,
  args: string[],
): Promise<void> {
  logger.info("Spawning", command, args.join(" "));
  return new Promise((resolve, reject) => {
    const sp = cpSpawn(command, args, { stdio: "inherit" });

    sp.once("error", reject);
    sp.once("exit", resolve);
  });
}

function lbfLogFilter(type: string): boolean {
  return !type.startsWith("LBF:");
}

/**
 * All lbf related packages will use the LBF:* type in the log context, this adds / removes
 * the type filter in @lightbase/insight
 * @param enabled
 */
export function enableOrDisableLBFLogging(enabled: boolean) {
  if (enabled) {
    addTypeFilter(lbfLogFilter);
  } else {
    removeTypeFilter(lbfLogFilter);
  }
}
