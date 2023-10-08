import { TypeCreator } from "@compas/code-gen";

/**
 * @param {Generator} generator
 */
export function applyCompasStructure(generator) {
  const T = new TypeCreator("compas");

  // Note that we map some raw validation errors to human readable errors while parsing
  // the configs
  const config = {
    cli: T.object()
      .keys({
        commandDirectories: T.array()
          .optional()
          .values(T.string())
          .docs(
            "Array of directories relative to the project root. All JavaScript files will be imported by the CLI and checked if it exports a 'cliDefinition'.",
          ),
        globalWatchOptions: T.object()
          .optional()
          .keys({
            extensions: T.array()
              .optional()
              .values(T.string())
              .docs("Add file extensions that should be watched"),
            ignorePatterns: T.array()
              .optional()
              .values(T.string())
              .docs(
                "Remove directories from being watched, this has precedence over the included extensions",
              ),
          })
          .docs(
            "Project level watch options, applied to all commands running in 'watch' mode via the Compas CLI.",
          ),
      })
      .optional()
      .docs("Old @compas/cli config"),

    projects: T.array()
      .values(T.string())
      .default(`[]`)
      .docs(
        "Relative paths to projects. Each project is expected to provide their own configuration.",
      ),

    actions: T.array()
      .values({
        name: T.string(),
        shortcut: T.string(),
        command: T.array().values(T.string()).min(1),
      })
      .default(`[]`)
      .docs("Available actions for this project."),

    dockerContainers: T.generic()
      .keys(T.string().pattern(/[a-z-0-9]+/g))
      .values({
        image: T.string(),
        createArguments: T.string().optional(),
        runArguments: T.string().optional(),
      })
      .default("{}")
      .docs("Docker container configuration."),

    migrations: T.object()
      .keys({})
      .optional()
      .docs(
        "Migration configuration. Nothing to configure yet, but is required for the migration integration to kick in.",
      ),
  };

  generator.add(
    T.object("config").keys(config).loose(),
    T.object("resolvedConfig")
      .keys({
        rootDirectory: T.string().min(0),

        ...config,

        projects: T.array().values(T.reference("compas", "resolvedConfig")),
      })
      .loose(),

    T.object("cache")
      .keys({
        version: T.string().docs(
          "Compas version, used for cache invalidations.",
        ),

        config: T.reference("compas", "resolvedConfig")
          .optional()
          .docs(
            "The resolved config. Managed by {@link configLoaderIntegration}.",
          ),

        rootDirectories: T.array()
          .values(T.string())
          .optional()
          .min(1)
          .docs(
            "Resolved project root directories. Managed by {@link rootDirectoriesIntegration}.",
          ),

        dynamicAvailableActions: T.array()
          .values({
            shortcut: T.string(),
            name: T.string(),
            callback: T.string(),
            rootDirectory: T.string().optional(),
          })
          .default("[]")
          .docs("Dynamic actions that are available."),

        packageManager: T.generic()
          .keys(T.string())
          .values({
            name: T.string(),
            installCommand: T.string(),
            nodeModulesBinCommand: T.string(),
            packageJsonScriptCommand: T.string(),
          })
          .optional()
          .docs(
            "The inferred package manager per rootDirectory. Managed by {@link packageManagerIntegration}.",
          ),

        packageManagerSourceFiles: T.generic()
          .keys(T.string())
          .values(T.string())
          .optional()
          .docs(
            "Cached package manager files. Managed by {@link packageManagerIntegration}.",
          ),

        prettier: T.generic()
          .keys(T.string())
          .values({
            configValue: T.anyOf().values(
              {
                // Write default config file to cache dir and use that.
                type: "compasEslintPlugin",
              },
              {
                // Either no path, or let Prettier figure out the path.
                type: "default",
              },
            ),
          })
          .optional()
          .docs("Detected prettier config per root directory."),
      })
      .loose(),
  );
}
