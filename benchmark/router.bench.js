/* eslint-disable import/no-unresolved */

import assert from "assert";
import { readFileSync } from "fs";
import { pathToFileURL } from "url";
import { bench, mainBenchFn } from "@compas/cli";
import { codeGenToTemporaryDirectory } from "@compas/code-gen/test/legacy/utils.test.js";
import { createBodyParsers } from "@compas/server";
import { AppError, mainFn, pathJoin } from "@compas/stdlib";

mainFn(import.meta, main);

async function main() {
  const githubApiFixture = pathJoin(
    process.cwd(),
    "__fixtures__/code-gen/githubapi.json",
  );

  const { exitCode, stdout, stderr, generatedDirectory } =
    await codeGenToTemporaryDirectory(
      {
        extendWithOpenApi: [
          ["githubApi", JSON.parse(readFileSync(githubApiFixture, "utf-8"))],
        ],
      },
      {
        isNodeServer: true,
        enabledGenerators: ["validator", "router"],
        dumpStructure: true,
      },
    );

  if (exitCode !== 0) {
    throw AppError.serverError({
      exitCode,
      stdout,
      stderr,
    });
  }

  const { router, setBodyParsers } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "common/router.js"))
  );
  const { reposHandlers } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "repos/controller.js"))
  );

  const { activityHandlers } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "activity/controller.js"))
  );

  bench("router - github static path", async (b) => {
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

  mainBenchFn(import.meta);
}
