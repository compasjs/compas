const { getSecondsSinceEpoch, gc } = require("./utils");

module.exports = t => {
  t.test("getSecondsSinceEpoch", t => {
    t.ok(Number.isInteger(getSecondsSinceEpoch()));

    t.end();
  });

  t.test("gc", t => {
    t.doesNotThrow(() => gc());

    t.end();
  });
};
