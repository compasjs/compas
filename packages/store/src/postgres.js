import { isProduction, merge } from "@lbu/stdlib";
import postgres from "postgres";

/**
 * @name Postgres
 *
 * See https://github.com/porsager/postgres for docs
 *
 * @typedef {*}
 */

/**
 * @param {object} [opts]
 * @param {boolean} [opts.createIfNotExists]
 * @returns {Postgres}
 */
export async function newPostgresConnection(opts) {
  if (!process.env.POSTGRES_URI || !process.env.APP_NAME) {
    throw new Error(
      "Provide the 'POSTGRES_URI' and 'APP_NAME' environment variables.",
    );
  }

  if (!process.env.POSTGRES_URI.endsWith("/")) {
    process.env.POSTGRES_URI += "/";
  }

  if (opts && opts.createIfNotExists) {
    const oldConnection = await createDatabaseIfNotExists(
      undefined,
      process.env.APP_NAME,
    );
    setImmediate(() => oldConnection.end({}));
  }

  return postgres(
    process.env.POSTGRES_URI + process.env.APP_NAME,
    merge(
      {
        connection: {
          application_name: process.env.APP_NAME,
          ssl: isProduction(),
        },
        no_prepare: true,
      },
      opts,
    ),
  );
}

/**
 * @param sql
 * @param databaseName
 * @param template
 */
export async function createDatabaseIfNotExists(sql, databaseName, template) {
  if (!sql) {
    sql = postgres(process.env.POSTGRES_URI);
  }
  const [db] = await sql`
    SELECT datname
    FROM pg_database
    WHERE datname = ${databaseName}
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
