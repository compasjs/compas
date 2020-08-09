# Environment variables

A quick reference for all environment variables supported across the packages:

**NODE_ENV**

Allowed values: 'development' and 'production'. Various configurations
automatically will switch to a production ready setup. e.g the logger from
@lbu/insight stops pretty printing, the minio client from @lbu/store will try to
use a SSL connection.

**IS_STAGING**

Allowed values: 'true' or undefined. Can only be 'true' when `NODE_ENV` is set
to 'production'. When `NODE_ENV` is not set to production, this variable is
automatically 'true'. This can be used to differentiate between staging and
production environments.

**APP_NAME**

Used for database creation and selection, default s3 bucket name. In general
this environment variable is required.

**APP_URL**

Full url where this api is available

**APP_KEYS**

Keys used for signing cookies. Can be a comma separated string to support
multiple keys.

Use for example
`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` to
generate these.

**CORS_URL**

Default CORS origin check. Can be a comma separated string to support multiple
origins.

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
