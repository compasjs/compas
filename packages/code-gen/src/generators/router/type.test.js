import { mainTestFn, test } from "@lbu/cli";
import { TypeCreator } from "../../../index.js";

mainTestFn(import.meta);

test("code-gen/router/type", (t) => {
  t.test("does not throw on correct usage of params", (t) => {
    const T = new TypeCreator();
    const R = T.router("/");

    const result = R.get("/:foo").params({ foo: T.string() }).build();

    t.equal(Object.keys(result.params.keys).length, 1);
  });

  t.test("should throw on missing key in param types", (t) => {
    const T = new TypeCreator();
    const R = T.router("/");

    try {
      R.get("/:foo/:bar").params({ foo: T.string() }).build();
      t.fail("Should throw");
    } catch {
      t.pass("Did throw for missing param types");
    }
  });

  t.test("should throw on missing param types ", (t) => {
    const T = new TypeCreator();
    const R = T.router("/");

    try {
      R.get("/:foo/:bar").build();
      t.fail("Should throw");
    } catch {
      t.pass("Did throw for missing param types");
    }
  });

  t.test("should throw on missing param in route ", (t) => {
    const T = new TypeCreator();
    const R = T.router("/");

    try {
      R.get("/:foo")
        .params({
          foo: T.string(),
          bar: T.string(),
        })
        .build();
      t.fail("Should throw");
    } catch {
      t.pass("Did throw for missing param types");
    }
  });
});
