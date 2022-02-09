# Compas configuration

Most features work without external configuration. They are either relatively
strict to enforce a way of working, or are configurable via their api's.
However, some features are better configured via a global configuration file.
This file is optional, but if exists should be located at
`config/compas.{js,mjs,json}`. The file is loaded via the
[config loader](/features/config-files.html#config-loader).

## Contents

All keys are optional

- **cli** (object): root property for configuration for the CLI package
  - **commandDirectories** (string[]): Array of directories relative to the
    project root. All JavaScript files will be imported by the CLI and checked
    if it exports a 'cliDefinition'. See
    [extending the cli](https://compasjs.com/features/extending-the-cli.html)
    for more information. The loader does not recurse in to sub directories.
  - **globalWatchOptions** (object): Project level watch options, applied to all
    commands running in 'watch' mode via the Compas CLI. The values here are
    appended to the defaults of the specific command that is being watched.
    - **extensions** (string[]): Add file extensions that should be watched. Say
      that you are creating a static site generator, then you most likely also
      want to restart if markdown files are changed.
    - **ignorePatterns** (string[]): Remove directories from being watched, this
      has precedence over the included extensions. Useful to ignore build output
      directories and other temporary output created by the command, so it is
      not restarted because of it's own changes.

### Example

```js
export function config() {
  return {
    cli: {
      commandDirectories: ["./src/my-commands"],

      globalWatchOptions: {
        extensions: ["md"],
        ignorePatterns: ["dist"],
      },
    },
  };
}
```
