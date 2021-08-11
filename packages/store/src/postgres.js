import { environment, isNil, isProduction, merge } from "@compas/stdlib";
import postgres from "postgres";

/**
 * @param {postgres.Options} opts
 * @returns {postgres.Options}
 */
export function buildAndCheckOpts(opts) {
  const finalOpts = /** @type {postgres.Options} */ merge(
    {
      connection: {
        application_name: environment.APP_NAME,
      },
      no_prepare: true,
      ssl: isProduction() ? "require" : "prefer",
      database: environment.POSTGRES_DATABASE ?? environment.APP_NAME,
      user: environment.POSTGRES_USER,
      password: environment.POSTGRES_PASSWORD,
      host: environment.POSTGRES_HOST,
      port: environment.POSTGRES_PORT,
      max: 15,
    },
    opts,
  );

  if (isNil(finalOpts.host) && isNil(environment.POSTGRES_URI)) {
    throw new Error(
      `One of 'host' option, 'POSTGRES_HOST' environment variable or the 'POSTGRES_URI' environment variable is required.`,
    );
  }

  return finalOpts;
}

/**
 * Create a new postgres connection, using the default environment variables.
 * A database may be created using the provided credentials.
 *
 * @since 0.1.0
 *
 * @param {postgres.Options & { createIfNotExists?: boolean}} [opts]
 * @returns {Promise<Postgres>}
 */
export async function newPostgresConnection(opts) {
  const connectionOpts = buildAndCheckOpts(opts);

  if (opts?.createIfNotExists) {
    const oldConnection = await createDatabaseIfNotExists(
      undefined,
      connectionOpts.database,
      undefined,
      connectionOpts,
    );
    setImmediate(() => oldConnection.end());
  }

  return postgres(environment.POSTGRES_URI ?? connectionOpts, connectionOpts);
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
  if (isNil(databaseName)) {
    throw new Error(
      "The 'database' option, 'POSTGRES_DATABASE' environment variable or 'APP_NAME' environment variable is required.",
    );
  }

  if (!sql) {
    sql = postgres(
      environment.POSTGRES_URI ?? connectionOptions,
      connectionOptions,
    );
  }
  const [db] = await sql`
    SELECT
      datname
    FROM
      pg_database
    WHERE
      datname = ${databaseName}
  `;

  if (!db?.datname) {
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
