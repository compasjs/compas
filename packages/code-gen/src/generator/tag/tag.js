import { isNil } from "@lbu/stdlib";
import { cleanTemplateOutput } from "../utils.js";

const MAX_COLLECT_LOOP = 13;

/**
 * @name StateFn
 * @callback
 * @param {CodeGenTemplateState} state
 * @returns {boolean|number|string|undefined|StateFn|Function}
 */

/**
 * @param {string} strings
 * @param {...(string|StateFn)} args
 * @returns {string}
 */
export function js(strings, ...args) {
  /**
   * @type {CodeGenTemplateState}
   */
  const state = {
    phase: "init",
  };

  for (let i = 0; i < MAX_COLLECT_LOOP + 2; i++) {
    let changed = false;
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === "function") {
        const result = args[i](state);

        // If function returns any value, replace it
        // This works for strings, but also allows functions to replace themselves with
        // another oen
        if (!isNil(result)) {
          args[i] = result;
          changed = true;
        }
      }
    }

    if (state.phase === "init") {
      // init phase only has one iteration
      state.phase = "collect";
    } else if (state.phase === "finish") {
      // finish phase only has one iteration
      break;
    } else if (!changed && state.phase === "collect") {
      // Move on if nothing changed
      state.phase = "finish";
    } else if (i === MAX_COLLECT_LOOP && state.phase === "collect") {
      // Move on if we are out of loop budget
      state.phase = "finish";
    }
  }

  // Combine plain strings with the resulting args
  const result = [strings[0]];
  for (let i = 0; i < args.length; ++i) {
    if (Array.isArray(args[i])) {
      result.push(args[i].join("\n"), strings[i + 1]);
    } else if (typeof args[i] === "function") {
      result.push(strings[i + 1]);
    } else {
      result.push(args[i] ?? "", strings[i + 1]);
    }
  }

  return cleanTemplateOutput(result.join(""));
}
