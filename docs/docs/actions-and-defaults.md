# Actions and defaults

Compas will do a few things automatically for you when it is running. These are
called integrations. Some of them only run once configured. Others are enabled
by default.

By default, Compas will watch your package.json files and determine if it needs
to reinstall your dependencies. This way your local environment always matches
the required dependency versions.

## Configuration

Compas is configurable via a JSON file at `config/compas.json`. An empty config
file is automatically created in your project when you run Compas. In this
config file, you can configure custom actions. These actions will be available
when Compas is running and can be executed via the configured shortcuts.

```json
{
  "actions": [
    {
      "name": "Lint",
      "shortcut": "L",
      "command": ["npm", "run", "lint"]
    }
  ]
}
```

Now when you press 'L' when Compas is running, it will run the defined command
and return back to the menu. When a process is running, you can restart it with
'R' or kill the running process by pressing 'K'.

The configuration file is automatically reloaded on changes, assuming that the
syntax is correct. Allowing you to iterate on it and expand your
[workspace](/docs/workspaces.html).

## Inferred actions

Compas tries to give you a good experience without any configuration. This is
why Compas automatically infers some standard actions based on your project
setup.

These inferred actions are only added when no action with the same or similar
name is defined. For example, 'Lint' is only added if both 'Lint' and 'Format'
are not configured.

- 'Dev' is automatically populated from the package.json scripts.
- 'Lint' defaults to the 'format' script defined in your package.json OR the
  'lint' script defined in your package.json OR to `compas lint` if the
  `@compas/cli` package is installed.
- 'Test' is based on the 'test' script in your package.json OR to `compas test`
  if the `@compas/cli` package is installed.

## Other integrations

Compas supports much more. Like automatically starting Docker containers for
services that your development environment needs, or running the code generators
automatically on changes (not yet implemented). For more information, checkout
the [integrations](/docs/integrations/docker.md).
