# Temp docs instance

Outputs:

- Debug logger
  - Enable via `--debug`
  - Writes files to `.cache/compas-debug-1111.txt`
- If `zakmes dev` is used, a small TUI is printed, giving information about
  available actions and automations running in the background.

Config:

- Resolves config files in `config/compas.json`
- All keys are optional, no extra keys are allowed, creates an empty file in the
  'root' project
- Supports nested projects
  - Relative paths like "packages/my-project" or ["backend", "frontend"]
  - Integrates with all output systems
- Current options:
  - projects: include nested projects
