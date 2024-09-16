import { isNil } from "@compas/stdlib";

/**
 * @typedef {{
 *   help: boolean,
 *   message?: string,
 *   template: {
 *     provider: "github",
 *     repository: string,
 *     ref?: string,
 *     path?: string,
 *   },
 *   outputDirectory: string,
 * }} CreateCompasArgs
 */

export const createCompasFlags = new Map([
  [
    "--help",
    {
      rawName: "--help",
      name: "help",
    },
  ],
  [
    "--template",
    {
      rawName: "--template",
      name: "template",
    },
  ],
  [
    "--output-directory",
    {
      rawName: "--output-directory",
      name: "outputDirectory",
    },
  ],
  [
    "--template-path",
    {
      rawName: "--template-path",
      name: "templatePath",
    },
  ],
  [
    "--template-ref",
    {
      rawName: "--template-ref",
      name: "templateRef",
    },
  ],
]);

/**
 * Parse the provided arguments. Note that this ignores flags without a value.
 *
 * Copied and a bit simplified from the @compas/cli flag parser. At some point we may
 * extract a package to simplify this.
 *
 * @param {Map<string, any>} availableFlags
 * @param {Array<string>} flagArgs
 * @returns {import("@compas/stdlib").Either<any, { message: string }>}
 */
export function argParserParse(availableFlags, flagArgs) {
  const genericErrorMessage = `See 'npx create-compas@latest --help' for more information.`;

  const result = {};

  let i = 0;

  const next = () => {
    const value = flagArgs[i];
    i++;
    return value;
  };

  const peek = () => flagArgs[i] ?? "";

  while (!isNil(flagArgs[i])) {
    const rawFlag = next().split("=");
    const flagName = rawFlag[0];

    const flagDefinition = availableFlags.get(flagName);

    if (isNil(flagDefinition)) {
      return {
        error: {
          message: `Unknown flag: '${rawFlag.join("=")}'.\n\n${genericErrorMessage}`,
        },
      };
    }

    const nextInput = peek();
    const rawValue =
      isNil(rawFlag[1]) ?
        nextInput.startsWith("--") || nextInput === "-h" ?
          undefined
        : next()
      : rawFlag[1];

    if (!isNil(result[flagDefinition.name])) {
      return {
        error: {
          message: `Flag '${flagDefinition.rawName}' is not repeatable, but has been found more than once in the input.\n\n${genericErrorMessage}`,
        },
      };
    }

    if (flagDefinition.name === "help") {
      if (!isNil(rawValue) && rawValue !== "true" && rawValue !== "1") {
        return {
          error: {
            message: `Flag '--help' does not require a value. Found '${rawValue}'.\n\n${genericErrorMessage}`,
          },
        };
      }

      result.help = true;
    } else {
      if (typeof rawValue !== "string" || rawValue.length === 0) {
        return {
          error: {
            message: `Flag '${flagDefinition.rawName}' requires a value to be provided.\n\n${genericErrorMessage}`,
          },
        };
      }

      result[flagDefinition.name] = rawValue;
    }
  }

  return {
    value: result,
  };
}

/**
 * Statically validate the provided input.
 *
 * @param {Record<string, any>} input
 * @param {string} defaultRef
 * @returns {CreateCompasArgs}
 */
export function argParserValidate(input, defaultRef) {
  if (input.help) {
    // @ts-expect-error
    return {
      help: true,
    };
  }

  /**
   * @type {CreateCompasArgs}
   */
  // @ts-expect-error
  const result = {
    help: false,
    template: {
      provider: "github",
      repository: "compasjs/compas",
      ref: defaultRef,
    },
  };

  if (
    (isNil(input.template) ||
      !input.template.includes(":") ||
      !input.template.includes("/")) &&
    !isNil(input.templatePath)
  ) {
    // @ts-expect-error
    return {
      help: true,
      message: `'--template' is required and cannot be a Compas provided template when '--template-path'  is specified`,
    };
  }

  if (isNil(input.template)) {
    result.template.path = `./examples/default`;
  } else {
    const templateParts = input.template.split(":");

    if (templateParts.length === 1 && templateParts[0].includes("/")) {
      // @ts-expect-error
      return {
        help: true,
        message: `Custom repositories need to be prefixed with 'github:', like 'github:compasjs/compas'.`,
      };
    }

    if (templateParts.length === 1) {
      result.template.path = `./examples/${templateParts[0]}`;
    } else {
      result.template.repository = templateParts[1];
    }

    if (input.templatePath) {
      result.template.path = input.templatePath;
    }
  }

  if (input.templateRef) {
    result.template.ref = input.templateRef;
  }

  if (input.outputDirectory) {
    result.outputDirectory = input.outputDirectory;
  }

  if (result.template.path && result.template.path.endsWith("/")) {
    result.template.path = result.template.path.substring(
      0,
      result.template.path.length - 1,
    );
    if (result.template.path.length === 0) {
      result.template.path = undefined;
    }
  }

  return result;
}
