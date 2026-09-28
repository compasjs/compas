import { mainTestFn, test } from "@compas/cli";
import { testGeneratorStaticOutput } from "../../test/testing.js";

mainTestFn(import.meta);

test("code-gen/router/js-koa", (t) => {
  t.test("matchedRoute uses the normalized path template", (t) => {
    testGeneratorStaticOutput(
      t,
      {
        relativePath: "common/router.js",
        partialValue: `ctx.matchedRoute = { name: "router.app.single", path: "/user/:id" };`,
      },
      (T) => {
        const R = T.router("/user/");

        return [R.get("/:id/", "single").params({ id: T.uuid() }).response({})];
      },
    );
  });

  t.test("matchedRoute of the root route is '/'", (t) => {
    testGeneratorStaticOutput(
      t,
      {
        relativePath: "common/router.js",
        partialValue: `ctx.matchedRoute = { name: "router.app.root", path: "/" };`,
      },
      (T) => {
        const R = T.router("/");

        return [R.get("/", "root").response({})];
      },
    );
  });
});
