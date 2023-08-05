/**
 * Try to load the config recursively from disk.
 *
 * Returns undefined when the config couldn't be loaded, for soft errors like no config
 * present, it returns a default empty config.
 *
 * @param {string} projectDirectory
 * @param {boolean} isRootProject
 * @returns {Promise<import("../generated/common/types").CompasResolvedConfig|undefined>}
 */
export function configResolve(
  projectDirectory: string,
  isRootProject: boolean,
): Promise<
  import("../generated/common/types").CompasResolvedConfig | undefined
>;
//# sourceMappingURL=resolve.d.ts.map
