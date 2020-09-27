# Environment variables

A quick reference for all environment variables supported across the packages:

## General

**NODE_ENV**

Allowed values: 'development' and 'production'. Various configurations
automatically will switch to a production ready setup. e.g the logger from
@lbu/insight stops pretty printing, the minio client from @lbu/store will try to
use an SSL connection.

**IS_STAGING**

Allowed values: 'true' or undefined. Can only be 'true' when `NODE_ENV` is set
to 'production'. When `NODE_ENV` is not set to production, this variable is
automatically 'true'. This can be used to differentiate between staging and
production environments.

**CI**

If set to `true`, some commands may behave differently. For example the
`lbu lint` command will run `prettier --check` instead of `prettier --write`
which makes sure the command exits with an error on nonformatted files. The
bench runner will write it's summary to a file called `benchmark_output.txt` in
the project root, so other programs can use this more easily.

**APP_NAME**

Used for database creation and selection, default s3 bucket name. In general
this environment variable is required.

**APP_KEYS**

Keys used for signing cookies. Can be a comma separated string to support
multiple keys.

Use for example
`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` to
generate these.

## @lbu/store

**POSTGRES_URI**

Connection string to Postgres. Should not include a database name.

**MINIO_URI**

Minio base url without port and without 'http(s)://'.

**MINIO_PORT**

Optional Minio port. Useful in development when Minio runs on port 9000

**MINIO_ACCESS_KEY**

Minio access key

**MINIO_SECRET_KEY**

Minio secret key for authorizing bucket and object creation and deletion

## @lbu/server

**CORS_URL**

Default CORS origin check. Can be a comma separated string to support multiple
origins.

**PORT**

Port to run the api on. This is a convention and not set in stone. Future lbu
versions may use this as this defaults.

**COOKIE_URL**

Default domain for the cookie in production. Used by the `session` middleware.

## @lbu/cli

**API_URL** / **NEXT_PUBLIC_API_URL**

Base url that the frontend client will use. From this the port value is
extracted and used in `lbu proxy`.

**PROXY_URL**

The url to proxy for `lbu proxy` command.
