const { uuid } = require("./datatypes");

module.exports = t => {
  t.test("uuid", t => {
    t.notEqual(uuid(), uuid());

    t.end();
  });
};
