/**
 * Download and extract the template repository.
 * Does not do any post-processing.
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("./arg-parser.js").CreateCompasArgs} options
 * @returns {Promise<void>}
 */
export function templateGetAndExtractStream(
  logger: import("@compas/stdlib").Logger,
  options: import("./arg-parser.js").CreateCompasArgs,
): Promise<void>;
/**
 * @param {string} url
 * @returns {Promise<NodeJS.ReadableStream>}
 */
export function templateGetHttpStream(
  url: string,
): Promise<NodeJS.ReadableStream>;
/**
 * Do necessary post-processing.
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("./arg-parser.js").CreateCompasArgs} options
 * @param {string} compasVersion
 * @returns {Promise<void>}
 */
export function templatePostProcess(
  logger: import("@compas/stdlib").Logger,
  options: import("./arg-parser.js").CreateCompasArgs,
  compasVersion: string,
): Promise<void>;
//# sourceMappingURL=template.d.ts.map
