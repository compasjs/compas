/**
 * Load the specified directories and return a command array
 *
 * @param {InsightEvent} event
 * @param {{inputs: { directory: string, validateOnLoad: boolean }[]}} options
 * @returns {Promise<import("../generated/common/types").CliCommandDefinitionInput[]>}
 */
export function cliLoaderLoadDirectories(
  event: InsightEvent,
  options: {
    inputs: {
      directory: string;
      validateOnLoad: boolean;
    }[];
  },
): Promise<import("../generated/common/types").CliCommandDefinitionInput[]>;
//# sourceMappingURL=loader.d.ts.map
