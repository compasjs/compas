/**
 * Execute a function based on the target language defined in the context.
 *
 * @template {(...args: any) => any} F
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {Record<import("../generated/common/types").ExperimentalGenerateOptions["targetLanguage"], F>} functions
 * @param {[...Parameters<F>]} args
 * @returns {ReturnType<F>|undefined}
 */
export function targetLanguageSwitch<F extends (...args: any) => any>(
  generateContext: import("../generate").GenerateContext,
  functions: Record<"js" | "ts", F>,
  args: [...Parameters<F>],
): ReturnType<F> | undefined;
//# sourceMappingURL=switcher.d.ts.map
