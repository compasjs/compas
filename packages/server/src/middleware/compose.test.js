/*
 Forked from https://github.com/koajs/compose/tree/06e82e65a368ac12cd6405beaf19fd5d208a1477
 Original license: MIT
 License file: Unknown
 License specifier: https://github.com/koajs/compose/blob/06e82e65a368ac12cd6405beaf19fd5d208a1477/package.json#L29
 */

import { mainTestFn, test } from "@compas/cli";
import { compose } from "./compose.js";

mainTestFn(import.meta);

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 1);
  });
}

function isPromise(x) {
  return x && typeof x.then === "function";
}

test("Koa Compose", (t) => {
  t.test("should work", async (t) => {
    const arr = [];
    const stack = [];

    stack.push(async (context, next) => {
      arr.push(1);
      await wait(1);
      await next();
      await wait(1);
      arr.push(6);
    });

    stack.push(async (context, next) => {
      arr.push(2);
      await wait(1);
      await next();
      await wait(1);
      arr.push(5);
    });

    stack.push(async (context, next) => {
      arr.push(3);
      await wait(1);
      await next();
      await wait(1);
      arr.push(4);
    });

    await compose(stack)({});
    t.deepEqual(arr, [1, 2, 3, 4, 5, 6]);
  });

  t.test("should be able to be called twice", async (t) => {
    const stack = [];

    stack.push(async (context, next) => {
      context.arr.push(1);
      await wait(1);
      await next();
      await wait(1);
      context.arr.push(6);
    });

    stack.push(async (context, next) => {
      context.arr.push(2);
      await wait(1);
      await next();
      await wait(1);
      context.arr.push(5);
    });

    stack.push(async (context, next) => {
      context.arr.push(3);
      await wait(1);
      await next();
      await wait(1);
      context.arr.push(4);
    });

    const fn = compose(stack);
    const ctx1 = { arr: [] };
    const ctx2 = { arr: [] };
    const out = [1, 2, 3, 4, 5, 6];

    await fn(ctx1);
    t.deepEqual(out, ctx1.arr);
    await fn(ctx2);
    t.deepEqual(out, ctx2.arr);
  });

  t.test("should only accept an array", (t) => {
    try {
      compose();
      t.fail("should throw");
    } catch (e) {
      t.ok(e instanceof TypeError);
    }
  });

  t.test("should create next functions that return a Promise", (t) => {
    const stack = [];
    const arr = [];
    for (let i = 0; i < 5; i++) {
      stack.push((context, next) => {
        arr.push(next());
      });
    }

    compose(stack)({});

    for (const next of arr) {
      t.ok(isPromise(next), "one of the functions next is not a Promise");
    }
  });

  t.test("should work with 0 middleware", async (t) => {
    try {
      await compose([])({});
      t.pass();
    } catch (_e) {
      t.fail("should not throw on empty array");
    }
  });

  t.test("should only accept middleware as functions", (t) => {
    try {
      compose([{}]);
      t.fail("should throw");
    } catch (e) {
      t.ok(e instanceof TypeError);
    }
  });

  t.test("should work when yielding at the end of the stack", async (t) => {
    const stack = [];
    let called = false;

    stack.push(async (ctx, next) => {
      await next();
      called = true;
    });

    await compose(stack)({});
    t.ok(called);
  });

  t.test("should reject on errors in middleware", async (t) => {
    const stack = [];

    stack.push(() => {
      throw new Error();
    });

    try {
      await compose(stack)({});
      t.fail("Not rejected");
    } catch (e) {
      t.ok(e instanceof Error);
    }
  });

  t.test("should keep the context", async (t) => {
    const ctx = {};

    const stack = [];

    stack.push(async (ctx2, next) => {
      await next();
      t.equal(ctx2, ctx);
    });

    stack.push(async (ctx2, next) => {
      await next();
      t.equal(ctx2, ctx);
    });

    stack.push(async (ctx2, next) => {
      await next();
      t.equal(ctx2, ctx);
    });

    await compose(stack)(ctx);
  });

  t.test("should catch downstream errors", async (t) => {
    const arr = [];
    const stack = [];

    stack.push(async (ctx, next) => {
      arr.push(1);
      try {
        arr.push(6);
        await next();
        arr.push(7);
      } catch (_err) {
        arr.push(2);
      }
      arr.push(3);
    });

    stack.push(() => {
      arr.push(4);
      throw new Error();
    });

    await compose(stack)({});
    t.deepEqual(arr, [1, 6, 4, 2, 3]);
  });

  t.test("should compose w/ next", async (t) => {
    let called = false;

    await compose([])({}, () => {
      called = true;
    });
    t.ok(called);
  });

  t.test("should handle errors in wrapped non-async functions", async (t) => {
    const stack = [];

    stack.push(function () {
      throw new Error();
    });

    try {
      await compose(stack)({});
      t.fail("should throw");
    } catch (e) {
      t.ok(e instanceof Error);
    }
  });

  // https://github.com/koajs/compose/pull/27#issuecomment-143109739
  t.test("should compose w/ other compositions", async (t) => {
    const called = [];

    await compose([
      compose([
        (ctx, next) => {
          called.push(1);
          return next();
        },
        (ctx, next) => {
          called.push(2);
          return next();
        },
      ]),
      (ctx, next) => {
        called.push(3);
        return next();
      },
    ])({});

    t.deepEqual(called, [1, 2, 3]);
  });

  t.test("should throw if next() is called multiple times", async (t) => {
    try {
      await compose([
        async (ctx, next) => {
          await next();
          await next();
        },
      ])({});
      t.fail("should throw");
    } catch (e) {
      t.ok(e.message.indexOf("multiple times") !== -1);
    }
  });

  t.test("should return a valid middleware", async (t) => {
    let val = 0;
    await compose([
      compose([
        (ctx, next) => {
          val++;
          return next();
        },
        (ctx, next) => {
          val++;
          return next();
        },
      ]),
      (ctx, next) => {
        val++;
        return next();
      },
    ])({});

    t.equal(val, 3);
  });

  t.test("should return last return value", async (t) => {
    const stack = [];

    stack.push(async (context, next) => {
      const val = await next();
      t.equal(val, 2);
      return 1;
    });

    stack.push(async (context, next) => {
      const val = await next();
      t.equal(val, 0);
      return 2;
    });

    const next = () => 0;
    const val = await compose(stack)({}, next);
    t.equal(val, 1);
  });

  t.test("should not affect the original middleware array", (t) => {
    const middleware = [];
    const fn1 = (ctx, next) => {
      return next();
    };
    middleware.push(fn1);

    for (const fn of middleware) {
      t.equal(fn, fn1);
    }

    compose(middleware);

    for (const fn of middleware) {
      t.equal(fn, fn1);
    }
  });

  t.test("should not get stuck on the passed in next", async (t) => {
    const middleware = [
      (ctx, next) => {
        ctx.middleware++;
        return next();
      },
    ];
    const ctx = {
      middleware: 0,
      next: 0,
    };

    await compose(middleware)(ctx, (ctx, next) => {
      ctx.next++;
      return next();
    });
    t.deepEqual(ctx, {
      middleware: 1,
      next: 1,
    });
  });
});
