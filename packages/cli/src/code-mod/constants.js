import { cpus } from "os";
import { executeCodeModVZeroDotZeroDotHundredFortyTwo } from "./mods/v0.0.142.js";
import { executeCodeModVZeroDotZeroDotHundredFortySix } from "./mods/v0.0.146.js";

export const PARALLEL_COUNT = Math.max(cpus().length - 1, 1);

/**
 * @type {Record<string, {
 *    description: string,
 *    exec: (event: InsightEvent, verbose: boolean) => Promise<void>
 * }>}
 */
export const codeModMap = {
  "v0.0.142": {
    description:
      "Convert arguments in call sites of generated react-query hooks, to pass in a single argument object.",
    exec: executeCodeModVZeroDotZeroDotHundredFortyTwo,
  },
  "v0.0.146": {
    description:
      "Replace 'queries.entitySelect' calls with `queryEntity` calls.",
    exec: executeCodeModVZeroDotZeroDotHundredFortySix,
  },
};
