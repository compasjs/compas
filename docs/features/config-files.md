# Config files

## Environment variables

Compas lets you forget loading your `.env` files. All main entry points (`mainFn`,
`mainTestFn` and `mainBenchFn`) will load both the `.env` and `.env.local` files
automatically. The loader that is used is provided by the
[dotenv](https://www.npmjs.com/package/dotenv) package.

Compas advises to check in a ready to go `.env.example` in your version control or
preferably when using all Compas provided tooling, just a `.env` file without any actual
production secrets. This way new contributors can just fire up some commands and verify
that they can run your project locally instead of trying to figure out what they need to
configure where.

The `.env` file loader skips keys already present in your environment. This is also used
by the `.env.local` file. It is loaded first so any environment variables present in both
`.env.local` and `.env` will have the value defined by the former.

To speed up accessing environment variables the @compas/stdlib package provides an
exported object `environment` which is an exact copy of `process.env` before the callback
is called in `mainFn`. If you use `process.env` to set values, please don't, you can use
`refreshEnvironmentCache` to make a new copy.

::: danger

Never check in production secrets in to your version control.

:::

## Config loader

Compas also comes with a configuration file loader in `@compas/stdlib`. This will be used
by other Compas features, but also allows you to have a project specific configuration
file. You can use this to validate and convert your environment variables for example
doing the following transformation:

```dotenv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

to

```js
// config/my-project.js

export function config() {
	return {
		postgres: {
			user: environment.POSTGRES_USER,
			password: environment.POSTGRES_PASSWORD,
		},
	};
}
```

Or it can be used by for example Compas to let you specify your migrations directory to
make `compas migrate` more configurable.

The configuration files can be in 2 formats: JSON or ES modules (both `.js` and `.mjs`
extensions are supported). The ES module should export a synchronous function returning a
config data object. The configuration files can be loaded from the project root, the
project `config` directory, or from the OS and user specific config directory.

**configLoaderGet()**

The config file load function, it caches results based on the provided name and key. It
returns promise resolving to an object with the following properties:

```js
const result = await configLoaderGet({ name: "example", location: "project" });

// always equals to the provided name, 'example'
result.name;
// always equal to the provided location, 'project'
result.location;

// object, does not exist if no config file is found
result.resolvedLocation;
// The directory where the config file is found
result.resolvedLocation.directory;
// Filename with extension, `example.json` or `example.js` or `example.mjs`
result.resolvedLocation.filename;

// Object, either the object returned from a config function or a parsed json file.
// This is an empty object if no config file is found
result.data;
```

**configLoaderDeleteCache**

Delete the config loader cache. This can be used if your tool overwrites the config, or
when writing some reload / watch behaviour.
