import { existsSync, readdirSync, readFileSync } from "fs";
import { exec, pathJoin, spawn } from "@compas/stdlib";
import { watcherRunWithSpawn } from "./watcher.js";

/**
 * @typedef {object} CollectedScript
 * @property {"user"|"package"} type
 * @property {string} name
 * @property {string|undefined} [path]
 * @property {string|undefined} [script]
 */

/**
 * @typedef {{[k: string]: CollectedScript}} ScriptCollection
 */

/**
 * @typedef {object} CliWatchOptions
 *
 * Scripts can export this to control if and how they
 * will be watched.
 *
 * Example:
 * ```
 * export const cliWatchOptions = {
 *   disable: false,
 *   extensions: ["js"],
 *   ignoredPatterns: ["docs"]
 * };
 * ```
 *
 * @property {boolean|undefined} [disable] Disable watch mode
 * @property {string[]|undefined} [extensions] Array of extensions to watch. Defaults to
 *    `["js", "json", "mjs", "cjs"]`.
 * @property {(string|RegExp)[]|undefined} [ignoredPatterns] Ignore specific patterns.
 *    Always ignores node_modules and `.dotfiles`.
 */

/**
 * @typedef {object} NonNullableWatchOptions
 * @property {boolean} disable
 * @property {string[]} extensions
 * @property {(string|RegExp)[]} ignoredPatterns
 */

/**
 * Load scripts directory and package.json scripts.
 *
 * @returns {ScriptCollection}
 */
export function collectScripts() {
  /** @type {ScriptCollection} */
  const result = {};

  const userDir = pathJoin(process.cwd(), "scripts");
  if (existsSync(userDir)) {
    for (const item of readdirSync(userDir)) {
      if (!item.endsWith(".js")) {
        continue;
      }

      const name = item.split(".")[0];

      result[name] = {
        type: "user",
        name,
        path: pathJoin(userDir, item),
      };
    }
  }

  const pkgJsonPath = pathJoin(process.cwd(), "package.json");
  if (existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
    for (const name of Object.keys(pkgJson.scripts || {})) {
      result[name] = {
        type: "package",
        name,
        script: pkgJson.scripts[name],
      };
    }
  }

  return result;
}

/**
 * Not so fool proof way of returning the accepted cli arguments of Node.js and v8
 *
 * @returns {Promise<string[]>}
 */
export async function collectNodeArgs() {
  const [{ stdout: nodeStdout }, { stdout: v8Stdout }] = await Promise.all([
    exec(`node --help`),
    exec(`node --v8-options`),
  ]);

  return `${nodeStdout}\n${v8Stdout}`
    .split("\n")
    .filter((it) => it.trim() && it.length > 2)
    .map((it) => it.trim())
    .filter((it) => it.startsWith("--"))
    .map((it) => {
      // May look like:
      // `--c Docs for this`
      // `--foo-bar=... And some docs`
      // `--foo-bar[=...] More docs for optional arg`
      return it.split(" ")[0].replace(/[[=.].*/g, "");
    })
    .filter((it) => it.length > 2);
}

/**
 * @param {*} [options]
 * @returns {NonNullableWatchOptions}
 */
export function watchOptionsWithDefaults(options) {
  /** @type {string[]} } */
  const extensions = options?.extensions ?? ["js", "json", "mjs", "cjs"];
  /** @type {string[]} } */
  const ignoredPatterns = options?.ignoredPatterns ?? ["__fixtures__"];
  /** @type {boolean} */
  const disable = options?.disable ?? false;

  if (!Array.isArray(extensions)) {
    throw new TypeError(
      `Expected cliWatchOptions.extensions to be an array. Found ${extensions}`,
    );
  }

  if (!Array.isArray(ignoredPatterns)) {
    throw new TypeError(
      `Expected cliWatchOptions.ignoredPatterns to be an array. Found ${ignoredPatterns}`,
    );
  }

  for (let i = 0; i < extensions.length; ++i) {
    // Remove '.' from extension if specified
    if (extensions[i].startsWith(".")) {
      extensions[i] = extensions[i].substring(1);
    }
  }

  return {
    disable,
    extensions,
    ignoredPatterns,
  };
}

/**
 * Compiles an chokidar ignore array for the specified options
 *
 * @param {NonNullableWatchOptions} options
 * @returns {function(string): boolean}
 */
export function watchOptionsToIgnoredArray(options) {
  // Compiled patterns contains extension filter and ignores dotfiles and node_modules
  const patterns = [
    RegExp(`\\.(?!${options.extensions.join("|")})[a-z]{1,8}$`),
    /(^|[/\\])\../,
    /node_modules/,
  ];

  for (const pattern of options.ignoredPatterns) {
    if (pattern instanceof RegExp) {
      patterns.push(pattern);
    } else if (typeof pattern === "string") {
      patterns.push(RegExp(pattern));
    } else {
      throw new TypeError(
        `cliWatchOptions.ignoredPatterns accepts only string and RegExp. Found ${pattern}`,
      );
    }
  }

  const cwd = process.cwd();

  return (path) => {
    if (path.startsWith(cwd)) {
      path = path.substring(cwd.length);
    }

    for (const pattern of patterns) {
      if (pattern.test(path)) {
        return true;
      }
    }

    return false;
  };
}

/**
 * @param logger
 * @param verbose
 * @param watch
 * @param command
 * @param commandArgs
 * @param {CliWatchOptions|NonNullableWatchOptions|undefined} watchOptions
 * @returns {Promise<{ exitCode: number}|void>|void}
 */
export function executeCommand(
  logger,
  verbose,
  watch,
  command,
  commandArgs,
  watchOptions,
) {
  if (verbose) {
    logger.info({
      msg: "Executing command",
      verbose,
      watch,
      command,
      commandArgs,
    });
  }

  if (!watch) {
    // Easy mode
    return spawn(command, commandArgs);
  }

  // May supply empty watchOptions so all defaults again
  const ignored = watchOptionsToIgnoredArray(
    watchOptionsWithDefaults(watchOptions),
  );

  const chokidarOptions = {
    persistent: true,
    ignorePermissionErrors: true,
    ignored,
    cwd: process.cwd(),
  };

  watcherRunWithSpawn(
    logger,
    {
      chokidarOptions,
      // @ts-ignore
      hooks: {},
    },
    {
      cpArguments: [
        command,
        commandArgs,
        {
          stdio: "inherit",
        },
      ],
    },
  );
}
