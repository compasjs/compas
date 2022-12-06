/**
 * Execute a function based on the target language defined in the context.
 *
 * @template {(...args: any) => any} F
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {Record<import("../generated/common/types").ExperimentalGenerateOptions["targetLanguage"], F|(() =>
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
