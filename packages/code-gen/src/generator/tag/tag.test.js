import { mainTestFn, test } from "@lbu/cli";
import { js } from "./tag.js";

mainTestFn(import.meta);

test("code-gen/generator/tag", (t) => {
  t.test("js - returns output cleaned up", (t) => {
    const result = js`const foo = true;`;

    t.equal(result, `const foo = true;`);
  });

  t.test("js - interpolates static values", (t) => {
    const result = js`const foo = ${true};`;

    t.equal(result, `const foo = true;`);
  });

  t.test("js - execute functions", (t) => {
    let callCount = 0;
    const fn = () => callCount++;

    const result = js`const foo = ${fn};`;

    t.equal(result, `const foo = 0;`);
    t.equal(callCount, 1);
  });

  t.test("js - execute functions over different 'phases'", (t) => {
    const phases = [];
    const fn = (context) => {
      phases.push(context.phase);
    };

    js`const foo = ${fn};`;
    t.deepEqual(phases, ["init", "collect", "finish"]);
  });

  t.test("js - allows returning a different function in phase->init", (t) => {
    const fn = (context) => {
      if (context.phase === "init") {
        return () => `"foo"`;
      }
    };

    const result = js`const foo = ${fn};`;

    t.equal(result, `const foo = "foo";`);
  });

  t.test(
    "js - allows returning a different function in phase->collect",
    (t) => {
      const fn = (context) => {
        if (context.phase === "collect") {
          return () => `"foo"`;
        }
      };

      const result = js`const foo = ${fn};`;

      t.equal(result, `const foo = "foo";`);
    },
  );

  t.test("js - allows returning a result in phase->finish", (t) => {
    const fn = (context) => {
      if (context.phase === "finish") {
        return `"foo"`;
      }
    };

    const result = js`const foo = ${fn};`;

    t.equal(result, `const foo = "foo";`);
  });
});
