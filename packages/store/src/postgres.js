import { merge } from "@lbu/stdlib";
import postgres from "postgres";

/**
 * @param {object} opts
 * @return {postgres}
 */
export function newPostgresConnection(opts) {
  if (!process.env.POSTGRES_URI || !process.env.APP_NAME) {
    throw new Error(
      "Provide the 'POSTGRES_URI' and 'APP_NAME' environment variables.",
    );
  }

  if (!process.env.POSTGRES_URI.endsWith("/")) {
    process.env.POSTGRES_URI += "/";
  }

  return postgres(
    process.env.POSTGRES_URI + process.env.APP_NAME,
    merge(
      {
        connection: {
          application_name: process.env.APP_NAME,
          ssl: process.env.NODE_ENV === "production",
        },
      },
      opts,
    ),
  );
}

export { postgres };
