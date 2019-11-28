/* eslint-disable */
process.env.NODE_ENV = "production";

const bench = require("fastbench");

const run = bench([], 1);

run(run);
