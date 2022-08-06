/**
 * Parse the provided arguments. Note that this ignores flags without a value.
 *
 * Copied and a bit simplified from the @compas/cli flag parser. At some point we may
 * extract a package to simplify this.
 *
 * @param {Map<string, any>} availableFlags
 * @param {string[]} flagArgs
 * @returns {import("@compas/stdlib").Either<any, { message: string }>}
 */
export function argParserParse(
  availableFlags: Map<string, any>,
  flagArgs: string[],
): import("@compas/stdlib").Either<
  any,
  {
    message: string;
  }
>;
/**
 * Statically validate the provided input.
 *
 * @param {Record<string, any>} input
 * @param {string} defaultRef
 * @returns {CreateCompasArgs}
 */
export function argParserValidate(
  input: Record<string, any>,
  defaultRef: string,
): CreateCompasArgs;
/**
 * @typedef {{
 *   help: true,
 *   message?: string,
 * }|{
 *   help: false,
 *   template: {
 *     provider: "github",
 *     repository: string,
 *     ref?: string,
 *     path?: string,
 *   },
 *   outputDirectory?: string,
 * }} CreateCompasArgs
 */
export const createCompasFlags: Map<
  string,
  {
    rawName: string;
    name: string;
  }
>;
export type CreateCompasArgs =
  | {
      help: true;
      message?: string;
    }
  | {
      help: false;
      template: {
        provider: "github";
        repository: string;
        ref?: string;
        path?: string;
      };
      outputDirectory?: string;
    };
//# sourceMappingURL=arg-parser.d.ts.map
