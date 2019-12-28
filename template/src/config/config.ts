export default {
  env: process.env.NODE_ENV,
  myKey: "none",
  codegen: {
    input: "./src/gen/index.ts",
    output: "./src/generated/",
  },
  postgres: {
    host: process.env.PGHOST,
    poolSize: 20,
    // Uses defaults from node-postgres (https://node-postgres.com/api/pool)
    statement_timeout: undefined,
    query_timeout: undefined,
    connectionTimeoutMillis: undefined,
    idleTimeoutMillis: 10000,
  },
};
