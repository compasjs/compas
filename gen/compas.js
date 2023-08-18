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
      .optional()
      .docs(
        "Relative paths to projects. Each project is expected to provide their own configuration.",
      ),

    actions: T.array()
      .values({
        name: T.string(),
        shortcut: T.string(),
        command: T.array().values(T.string()).min(1),
      })
      .optional()
      .docs("Available actions for this project."),
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

    T.object("cache").keys({
      version: T.string(),
      config: T.reference("compas", "resolvedConfig").optional(),
    }),
  );
}
