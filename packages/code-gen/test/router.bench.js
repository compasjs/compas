import assert from "assert";
import { bench, mainBenchFn } from "@compas/cli";
import { createBodyParsers } from "@compas/server";

mainBenchFn(import.meta);

bench("router - github static path", async (b) => {
  const { router, reposHandlers, setBodyParsers } = await import(
    "../../../generated/testing/bench/index.js"
  );

  reposHandlers.reposListForAuthenticatedUser = (ctx, next) => {
    ctx.callCount++;
    return next();
  };
  setBodyParsers(createBodyParsers());
  const callCtx = {
    callCount: 0,
    method: "GET",
    path: "/user/repos/",
    request: {
      query: {},
    },
  };

  b.resetTime();
  for (let i = 0; i < b.N; ++i) {
    await new Promise((r) => {
      router(callCtx, r);
    });
  }

  assert(callCtx.callCount > 0);
});

bench("router - github path params", async (b) => {
  const { router, activityHandlers, setBodyParsers } = await import(
    "../../../generated/testing/bench/index.js"
  );

  activityHandlers.activityListStargazersForRepo = (ctx, next) => {
    ctx.callCount++;
    return next();
  };
  setBodyParsers(createBodyParsers());
  const callCtx = {
    callCount: 0,
    method: "GET",
    path: "/repos/compasjs/compas/stargazers",
    request: {
      query: {},
    },
  };

  b.resetTime();
  for (let i = 0; i < b.N; ++i) {
    await new Promise((r) => {
      router(callCtx, r);
    });
  }

  assert(callCtx.callCount > 0);
});
