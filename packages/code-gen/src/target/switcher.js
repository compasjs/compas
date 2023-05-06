/**
 * Execute a function based on the target language defined in the context.
 *
 * @template {(...args: any) => any} F
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {Record<import("../generated/common/types.js").ExperimentalGenerateOptions["targetLanguage"], F|(() =>
 *   void)>} functions
 * @param {[...Parameters<F>]} args
 * @returns {ReturnType<F>|undefined}
 */
export function targetLanguageSwitch(generateContext, functions, args) {
  const fn = functions[generateContext.options.targetLanguage];

  if (!fn) {
    return;
  }

  return fn(...args);
}

/**
 * Execute a function based on the provided target.
 *
 * @template {(...args: any) => any} F
 * @template {string} Targets
 *
 * @param {Record<Targets, F|(() =>
 *   void)>} functions
 * @param {Targets|undefined} target
 * @param {[...Parameters<F>]} args
 * @returns {ReturnType<F>|undefined}
 */
export function targetCustomSwitch(functions, target, args) {
  if (!target) {
    return;
  }

  const fn = functions[target];

  if (!fn) {
    return;
  }

  return fn(...args);
}
