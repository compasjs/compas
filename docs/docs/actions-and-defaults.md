# Actions and defaults

Compas will do a few things automatically for you when it is running. These are
called integrations. Some of them only run once configured. Others are enabled
by default.

By default, Compas will watch your package.json files and determine if it needs
to reinstall your dependencies. This way your local environment always matches
the required dependency versions.

Other actions, like automatically spinning up development dependencies in Docker
need to be configured explicitly. See the respective integrations for how this
works.

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
syntax is correct.
