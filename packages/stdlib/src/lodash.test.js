import { flatten, isNil, isPlainObject, merge, unFlatten } from "./lodash.js";

export const test = t => {
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

  t.test("flatten", t => {
    t.deepEqual(
      flatten({
        foo: {
          bar: {
            baz: "foo",
            bar: 5,
            quix: [1, 2, 3],
            suip: { foo: true },
            soup: [{ foo: "bar" }],
          },
        },
      }),
      {
        "foo.bar.baz": "foo",
        "foo.bar.bar": 5,
        "foo.bar.quix": [1, 2, 3],
        "foo.bar.suip.foo": true,
        "foo.bar.soup": [{ foo: "bar" }],
      },
    );

    t.end();
  });

  t.test("unFlatten", t => {
    t.deepEqual(
      unFlatten({
        "foo.bar.baz": "foo",
        "foo.bar.bar": 5,
        "foo.bar.quix": [1, 2, 3],
        "foo.bar.suip.foo": true,
        "foo.bar.soup": [{ foo: "bar" }],
      }),
      {
        foo: {
          bar: {
            baz: "foo",
            bar: 5,
            quix: [1, 2, 3],
            suip: { foo: true },
            soup: [{ foo: "bar" }],
          },
        },
      },
    );

    t.deepEqual(
      unFlatten({
        foo: "Overwritten",
        "foo.baz": "Yep overwritten",
        str: false,
      }),
      {
        foo: { baz: "Yep overwritten" },
        str: false,
      },
    );

    t.end();
  });
};
