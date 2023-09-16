# Docker integration

Most of the time your application requires external services. Compas supports
automatically spinning up those external services via
[Docker](https://docs.docker.com/).

## Getting started

The docker integration is not enabled by default. You can run the following
command or apply the config changes below manually.

```shell
compas init docker
```

This creates or updates the Compas config file in `config/compas.json` with the
following contents:

```json
{
  "dockerContainers": {
    "compas-postgres-15": {
      "image": "postgres:15",
      "createArguments": "-e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e PGDATA=/var/lib/postgresql/data/pgdata -v compas-postgres-15:/var/lib/postgresql/data/pgdata -p 5432:5432",
      "runArguments": ""
    }
  }
}
```

## Config

Each container definition has the following properties:

- The image name, in the above example 'compas-postgres-15'. This name should
  either be unique over all your projects, or the container is reused across
  projects that specify the same name. This may be the desired behavior if you
  work on multiple projects that share the same set of services.
- `createArguments`: Arguments to pass to the `docker create` command. See the
  [Docker documentation](https://docs.docker.com/engine/reference/commandline/create/)
  for more information. The `--name` argument and image are provided by Compas.
- `image`: The image to create the container from. Anything that Docker supports
  works. It is advised to develop against the same versions as your production
  environment will have.

## Limitations

- Compas only evaluates the state of the Docker containers on startup and on
  configuration changes.
- Compas automatically stops all containers that are not required for the
  current project. However, once the development environment exits, the
  containers will be kept running.
- Compas assumes that containers with the same name are compatible across
  projects. Make sure to use unique names when that is not the case.
- Compas does not detect changes to the `image`, `createArguments` or
  `runArguments`. Manually remove the container with `docker container rm $name`
  to let Compas recreate the container.
