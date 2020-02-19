const { isNil, isPlainObject, merge } = require("./lodash");

module.exports = t => {
  t.test("isNil", t => {
    t.ok(isNil(null));
    t.ok(isNil(undefined));

    t.notOk(isNil(true));
    t.notOk(isNil(false));
    t.notOk(isNil(0));
    t.notOk(isNil(1.3));
    t.notOk(isNil(""));
    t.notOk(isNil("foo"));
    t.notOk(isNil([]));
    t.notOk(isNil([true]));
    t.notOk(isNil({}));
    t.notOk(isNil({ foo: "bar" }));

    t.end();
  });

  t.test("isPlainObject", t => {
    t.ok(isPlainObject({}));
    t.ok(isPlainObject({ foo: "bar" }));

    t.notOk(isPlainObject([]));
    t.notOk(isPlainObject(null));
    t.notOk(isPlainObject(new (class {})()));

    t.end();
  });

  t.test("merge", t => {
    let result = merge({}, { foo: true });
    t.equal(result.foo, true);

    result = merge({}, {});
    t.equal(Object.keys(result).length, 0);

    result = merge({ foo: "foo" }, { bar: "bar" }, { baz: "baz" });
    t.equal(Object.keys(result).length, 3);

    const obj = { foo: true };
    merge(obj, { foo: false });
    t.equal(obj.foo, false);

    t.end();
  });
};
