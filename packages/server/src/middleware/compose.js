/*
 Forked from https://github.com/koajs/compose/tree/06e82e65a368ac12cd6405beaf19fd5d208a1477
 Original license: MIT
 License file: Unknown
 License specifier: https://github.com/koajs/compose/blob/06e82e65a368ac12cd6405beaf19fd5d208a1477/package.json#L29
 */

/**
 * Compose `middleware` returning of all those which are passed.
 *
 * @since 0.1.0
 *
 * @param {Array<import("koa").Middleware>} middleware
 * @returns {import("koa").Middleware}
 */
export function compose(middleware) {
  if (!Array.isArray(middleware)) {
    throw new TypeError("Middleware stack must be an array!");
  }
  for (const fn of middleware) {
    if (typeof fn !== "function") {
      throw new TypeError("Middleware must be composed of functions!");
    }
  }

  return function (context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);

    function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error("next() called multiple times"));
      }
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) {
        fn = next;
      }
      if (!fn) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
