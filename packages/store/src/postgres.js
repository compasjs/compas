import { environment, isProduction, merge } from "@compas/stdlib";
import postgres from "postgres";

/**
 * Check environment variables for creating a Postgres connection
 */
export function postgresEnvCheck() {
  if (
    !environment.POSTGRES_URI &&
    !(
      environment.POSTGRES_USER &&
      environment.POSTGRES_HOST &&
      environment.POSTGRES_PASSWORD
    )
  ) {
    throw new Error(
      "Provide the 'POSTGRES_URI' or ('POSTGRES_USER', 'POSTGRES_PASSWORD' and 'POSTGRES_HOST') environment variables.",
    );
  }

  if (!environment.POSTGRES_URI) {
    environment.POSTGRES_URI = `postgres://${environment.POSTGRES_USER}:${environment.POSTGRES_PASSWORD}@${environment.POSTGRES_HOST}/`;
    // Set the env, in case someone calls the refreshEnv function in stdlib
    process.env.POSTGRES_URI = environment.POSTGRES_URI;
  } else if (!environment.POSTGRES_URI.endsWith("/")) {
    environment.POSTGRES_URI += "/";
  }

  if (!environment.APP_NAME && !environment.POSTGRES_DATABASE) {
    throw new Error(
      `Provide the 'APP_NAME' or 'POSTGRES_DATABASE' environment variable.`,
    );
  }

  if (!environment.POSTGRES_DATABASE) {
    environment.POSTGRES_DATABASE = environment.APP_NAME;
    // Set the env, in case someone calls the refreshEnv function in stdlib
    process.env.POSTGRES_DATABASE = environment.POSTGRES_DATABASE;
  }
}

/**
 * Create a new postgres connection, using the default environment variables.
 * A database may be created using the provided credentials.
 *
 * @since 0.1.0
 *
 * @param {object} [opts]
 * @param {boolean} [opts.createIfNotExists]
 * @returns {Promise<Postgres>}
 */
export async function newPostgresConnection(opts) {
  postgresEnvCheck();

  const connectionOpts = merge(
    {
      connection: {
        application_name: environment.APP_NAME,
      },
      no_prepare: true,
      ssl: isProduction() ? "require" : "prefer",
    },
    opts,
  );

  if (opts && opts.createIfNotExists) {
    const oldConnection = await createDatabaseIfNotExists(
      undefined,
      environment.POSTGRES_DATABASE,
      undefined,
      connectionOpts,
    );
    setImmediate(() => oldConnection.end());
  }

  return postgres(
    environment.POSTGRES_URI + environment.POSTGRES_DATABASE,
    connectionOpts,
  );
}

/**
 * @param sql
 * @param databaseName
 * @param template
 * @param connectionOptions
 * @returns {Promise<Postgres>}
 */
export async function createDatabaseIfNotExists(
  sql,
  databaseName,
  template,
  connectionOptions,
) {
  if (!sql) {
    sql = postgres(environment.POSTGRES_URI, connectionOptions);
  }
  const [db] = await sql`
    SELECT
      datname
    FROM
      pg_database
    WHERE
      datname = ${databaseName}
  `;

  if (!db || !db.datname) {
    if (template) {
      await sql`
        CREATE DATABASE ${sql(databaseName)} WITH TEMPLATE ${sql(
        template,
      )} OWNER ${sql(sql.options.user)}
      `;
    } else {
      await sql`
        CREATE DATABASE ${sql(databaseName)} WITH OWNER ${sql(sql.options.user)}
      `;
    }
  }

  return sql;
}

export { postgres };
