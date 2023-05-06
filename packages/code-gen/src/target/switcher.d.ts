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
export function targetLanguageSwitch<F extends (...args: any) => any>(
  generateContext: import("../generate.js").GenerateContext,
  functions: Record<"js" | "ts", F | (() => void)>,
  args: [...Parameters<F>],
): ReturnType<F> | undefined;
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
export function targetCustomSwitch<
  F extends (...args: any) => any,
  Targets extends string,
>(
  functions: Record<Targets, F | (() => void)>,
  target: Targets | undefined,
  args: [...Parameters<F>],
): ReturnType<F> | undefined;
//# sourceMappingURL=switcher.d.ts.map
