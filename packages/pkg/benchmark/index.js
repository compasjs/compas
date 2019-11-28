/* eslint-disable */
process.env.NODE_ENV = "production";

const bench = require("fastbench");
const arr = new Array(1000).map(() => Math.random());

const run = bench(
  [
    function benchForLoop(cb) {
      let sum = 0;
      for (let i = 0; i < arr; i++) {
        sum += arr[i];
      }
      setImmediate(cb.bind(null, sum));
    },
    function benchForOf(cb) {
      let sum = 0;
      for (const it of arr) {
        sum += it;
      }
      setImmediate(cb.bind(null, sum));
    },
    function benchForEach(cb) {
      let sum = 0;
      arr.forEach(it => {
        sum += it;
      });
      setImmediate(cb.bind(null, sum));
    },
    function benchReduce(cb) {
      const sum = arr.reduce((acc, it) => {
        acc += it;
        return acc;
      }, 0);
      setImmediate(cb.bind(null, sum));
    },
  ],
  1000,
);

run(run);
