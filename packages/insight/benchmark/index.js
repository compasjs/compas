/* eslint-disable */

process.env.NODE_ENV = "production";

const bench = require("fastbench");
const pino = require("pino");
const { resetWriter, log } = require("../");
const fs = require("fs");
const path = require("path");
const pinoDest = pino(pino.destination("/dev/null"));

const writerOutput = fs.createWriteStream("/dev/null");
resetWriter(writerOutput);

const bigObj = Object.assign(
  {},
  require(path.join(process.cwd(), "tsconfig.json")),
);

const run = bench(
  [
    function benchPino(cb) {
      for (let i = 0; i < 10; i++) {
        pinoDest.info("hello world");
      }
      setImmediate(cb);
    },
    function benchLogger(cb) {
      for (let i = 0; i < 10; i++) {
        log.info("hello world");
      }

      setImmediate(cb);
    },
    function benchPinoObject(cb) {
      for (let i = 0; i < 10; i++) {
        pinoDest.info({ hello: "world" });
      }
      setImmediate(cb);
    },
    function benchLoggerObject(cb) {
      for (let i = 0; i < 10; i++) {
        log.info({ hello: "world" });
      }

      setImmediate(cb);
    },
    function benchPinoBigObject(cb) {
      for (let i = 0; i < 10; i++) {
        pinoDest.info(bigObj, bigObj);
      }
      setImmediate(cb);
    },
    function benchLoggerBigObject(cb) {
      for (let i = 0; i < 10; i++) {
        log.info(bigObj, bigObj);
      }

      setImmediate(cb);
    },
  ],
  10000,
);

run(run);
