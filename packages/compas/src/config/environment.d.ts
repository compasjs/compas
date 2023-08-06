/**
 * Load .env files, resolve Compas version and information to determine in which mode we
 * are booting.
 *
 * @param {string} relativeDirectory
 * @param {boolean} hasNodeEnvSet
 * @returns {Promise<{
 *   isCI: boolean,
 *   isDevelopment: boolean,
 *   appName: string,
 *   compasVersion: string,
 *   nodeVersion: string,
 * }>}
 */
export function configLoadEnvironment(
  relativeDirectory: string,
  hasNodeEnvSet: boolean,
): Promise<{
  isCI: boolean;
  isDevelopment: boolean;
  appName: string;
  compasVersion: string;
  nodeVersion: string;
}>;
//# sourceMappingURL=environment.d.ts.map
