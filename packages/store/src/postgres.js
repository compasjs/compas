import { environment, isNil, isProduction, merge } from "@compas/stdlib";
import postgres from "postgres";

/**
 * @param {import("postgres").Options|undefined} opts
 * @returns {import("postgres").Options}
 */
export function buildAndCheckOpts(opts) {
  const finalOpts = /** @type {postgres.Options} */ merge(
    {
      connection: {
        application_name: environment.APP_NAME,
      },
      no_prepare: true,
      ssl: isProduction() ? "require" : "prefer",
      database:
        environment.POSTGRES_DATABASE ??
        environment.PGDATABASE ??
        environment.APP_NAME,
      user:
        environment.POSTGRES_USER ??
        environment.PGUSERNAME ??
        environment.PGUSER,
      password: environment.POSTGRES_PASSWORD ?? environment.PGPASSWORD,
      host: environment.POSTGRES_HOST ?? environment.PGHOST,
      port: environment.POSTGRES_PORT ?? environment.PGPORT,
      max: 15,
      types: {
        // Used by
        // `T.date().dateOnly()`
        // and
        // `T.date().timeOnly()`
        dateOrTimeOnly: {
          to: 25,
          from: [1082, 1083],
          serialize: (x) => x,
          parse: (x) => x,
        },

        jsonb: {
          // PG oid for jsonb
          to: 3802,
          from: [3802],
          serialize: (value) => value,
          parse: (x) => (x ? JSON.parse(x) : undefined),
        },
      },
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
 * Note that by default we add a 'dateOrTimeOnly' type, which serializes and parses
 * 'date' and 'time' columns, used by `T.date().timeOnly()` and `T.date().dateOnly()', as
 * strings.
 *
 * @since 0.1.0
 *
 * @param {import("postgres").Options & {
 *   createIfNotExists?: boolean,
 * }} [opts]
 * @returns {Promise<import("postgres").Sql<{}>>}
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
 * @returns {Promise<import("postgres").Sql<{}>>}
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

  // Don't connect to a database
  const opts = {
    ...connectionOptions,
    database: undefined,
  };
  if (!sql) {
    sql = postgres(environment.POSTGRES_URI ?? opts, opts);
  }
  const [db] = await sql`
    SELECT datname
    FROM pg_database
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
