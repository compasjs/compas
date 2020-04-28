# Environment variables

A quick reference for all environment variables supported across the packages:

**NODE_ENV**

Allowed values: 'development' and 'production'. Various configurations
automatically will switch to a production ready setup. e.g the logger from
@lbu/insight stops pretty printing, the minio client from @lbu/store will try to
use a SSL connection.

**APP_NAME**

Used for database creation and selection, default s3 bucket name. In general
this environment variable is required.

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
