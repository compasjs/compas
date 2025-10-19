# @compas/cli

<p>
  <a href="https://packagephobia.com/result?p=@compas/cli" target="_blank">
    <img src="https://packagephobia.com/badge?p=@compas/cli" alt="Install size">
  </a>

  <a href="https://github.com/compasjs/compas/actions/workflows/checks.yml" target="_blank">
    <img src="https://github.com/compasjs/compas/actions/workflows/checks.yml/badge.svg" alt="CI status badge">
  </a>
  <a href="https://codecov.io/gh/compasjs/compas" target="_blank">
    <img src="https://codecov.io/gh/compasjs/compas/branch/main/graph/badge.svg?token=81D84CV04U" alt="Codecov status">
  </a>
</p>

---

CLI to help with your local development environment, testing and more. Take a
look at the [documentation](https://compasjs.com/getting-started.html).

## Maintenance mode

Compas is in maintenance mode. The packages will be maintained for the
foreseeable future. New features might be added, but some will also be dropped
in favor of other ecosystem-available libraries. Please don't start new projects
using Compas.

## Reference

For the full reference, view the
[documentation](https://compasjs.com/references/cli.html). Below is the short
reference, generated via `compas help`.

```
Usage: compas COMMAND

The Compas CLI

Unified backend tooling.

Examples:
- compas docker up
- compas lint --jsdoc
- compas visualise erd --generated-directory ./src/generated

References:
- Docs: https://compasjs.com
- Source: https://github.com/compasjs/compas
- Issues: https://github.com/compasjs/compas/issues


Commands:
  check-env          Various checks helping with a better Compas experience.
  code-mod           Execute code-mods to help migrating to new Compas versions.
  completions        Configure shell auto-complete for this CLI.
  docker             Manage common docker components.
  help               Display help for any of the available commands.
  init               Init various files in the current project.
  lint               Lint all project files.
  migrate            Run PostgreSQL migrations via the @compas/store migration system.
  run                Run arbitrary JavaScript files, scripts defined in the package.json and scripts located in the scripts directory.
  test               Run all tests in your project.
  version            Print the installed Compas version and exit
  visualise          Visualise various code-generated structures.
  watch              Run the command, restarting it when file changes happen.

Flags:
  -h, --help     Display information about the current command. (boolean)

Run 'compas help COMMAND' for more information of a specific sub command.
```
