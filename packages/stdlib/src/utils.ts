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

/**
 * Run a back-to-back background job, i.e. setInterval with an extra set of options
 *
 * Params:
 * - name: is used in logging, all log statements produced have type 'JOB:BACKGROUND'
 * - timeout: amount of milliseconds 'between' jobs
 * - awaitCallback: wait for the callback to finish before calling setTimeout again
 * - initialRun: run the callback direct when this function is called, however this will
 * already run in the background, so this function will return immediately
 *
 * Returns a stop function to clear any timeout, if a callback is in progress it will still run
 */
export function runBackGroundJob(
  {
    name,
    timeout,
    awaitCallback,
    initialRun,
  }: { name: string; timeout: number; awaitCallback?: true; initialRun?: true },
  cb: (logger: Logger) => Promise<void>,
) {
  const logger = new Logger(5, {
    type: "JOB:BACKGROUND",
    backgroundJob: name,
  });
  let timer: NodeJS.Timeout;

  if (initialRun) {
    run();
  } else {
    timer = setTimeout(run, timeout);
  }

  return { stop };

  function run() {
    logger.info("Running job");
    let p = cb(logger);
    if (awaitCallback) {
      p = p.then(() => {
        timer = setTimeout(run, timeout);
      });
    } else {
      timer = setTimeout(run, timeout);
    }

    p.then(() => {
      logger.info("Done running job");
    }).catch(err => {
      logger.error("Done running job", err);
    });
  }

  function stop() {
    clearTimeout(timer);
  }
}

/**
 * Run a daily background job
 *
 * Params:
 * - name: is used in logging, all log statements produced have type 'JOB:BACKGROUND'
 * - timeToRun: Date with specified hours, minutes, seconds, millieseconds. Note that this
 * argument will be modified
 *
 * Returns a stop function to clear any timeout, if a callback is in progress it will still
 * run
 */
export function runDailyJob(
  { name, timeToRun }: { name: string; timeToRun: Date },
  cb: (logger: Logger) => Promise<void>,
) {
  const logger = new Logger(5, {
    type: "JOB:DAILY",
    backgroundJob: name,
  });
  let timer: NodeJS.Timeout;

  scheduleTimeout();

  return { stop };

  function scheduleTimeout() {
    const now = new Date();
    timeToRun.setDate(now.getDate());
    if (now.getTime() > timeToRun.getTime()) {
      // Schedule for next day
      timeToRun.setDate(now.getDate() + 1);
    }

    logger.info("Scheduled timeout", { time: timeToRun.toISOString() });
    setTimeout(run, timeToRun.getTime() - now.getTime());
  }

  function run() {
    logger.info("Running job");

    cb(logger)
      .then(() => {
        logger.info("Done running job");
        scheduleTimeout();
      })
      .catch(err => {
        logger.error("Done running job", err);
        scheduleTimeout();
      });
  }

  function stop() {
    clearTimeout(timer);
  }
}
