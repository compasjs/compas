/**
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("../generated/common/types").CliCommandDefinitionInput} root
 * @param {{
 *   commandDirectories: {
 *     directory: string,
 *     validateOnLoad: boolean,
 *   }[],
 * }} options
 * @returns {Promise<import("./types").CliResolved>}
 */
export function cliInit(
  event: import("@compas/stdlib").InsightEvent,
  root: import("../generated/common/types").CliCommandDefinitionInput,
  options: {
    commandDirectories: {
      directory: string;
      validateOnLoad: boolean;
    }[];
  },
): Promise<import("./types").CliResolved>;
//# sourceMappingURL=init.d.ts.map
