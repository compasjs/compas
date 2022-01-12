import { mainTestFn, test } from "@compas/cli";
import { TypeCreator } from "../../src/builders/index.js";
import { codeGenToTemporaryDirectory } from "../utils.test.js";

mainTestFn(import.meta);

test("code-gen/e2e/route-invalidation", (t) => {
  const T = new TypeCreator("app");
  const R = T.router("/app");

  t.test("no error without invalidations", async (t) => {
    const { exitCode } = await codeGenToTemporaryDirectory(
      [
        R.get("/list", "list").response({}),

        R.get("/:id", "get").params({
          id: T.uuid(),
        }),
      ],
      {
        enabledGenerators: ["validator", "router", "type"],
        isNodeServer: true,
        dumpStructure: true,
      },
    );

    t.equal(exitCode, 0);
  });

  t.test("error with unknown group", async (t) => {
    const { exitCode, stdout } = await codeGenToTemporaryDirectory(
      [R.post("/").invalidations(T.invalidates("unknown"))],
      {
        enabledGenerators: ["validator", "router", "type"],
        isNodeServer: true,
        dumpStructure: true,
      },
    );

    t.equal(exitCode, 1);
    t.ok(
      stdout.includes(
        "Invalidation from 'AppPost' specifies an invalid target (group: 'unknown')",
      ),
    );
  });

  t.test("error with unknown name", async (t) => {
    const { exitCode, stdout } = await codeGenToTemporaryDirectory(
      [R.post("/").invalidations(T.invalidates("app", "unknown"))],
      {
        enabledGenerators: ["validator", "router", "type"],
        isNodeServer: true,
        dumpStructure: true,
      },
    );

    t.equal(exitCode, 1);
    t.ok(
      stdout.includes(
        "Invalidation from 'AppPost' specifies an invalid target (group: 'app', name: 'unknown')",
      ),
    );
  });

  t.test("error target should be a get route", async (t) => {
    const { exitCode, stdout } = await codeGenToTemporaryDirectory(
      [
        R.post("/", "list").response({}),
        R.post("/update", "update").invalidations(T.invalidates("app", "list")),
      ],
      {
        enabledGenerators: ["validator", "router", "type"],
        isNodeServer: true,
        dumpStructure: true,
      },
    );

    t.equal(exitCode, 1);
    t.ok(
      stdout.includes(
        "Invalidation from 'AppUpdate' specifies an invalid target (group: 'app', name: 'list')",
      ),
    );
  });

  t.test("no error on post idempotent", async (t) => {
    const { exitCode } = await codeGenToTemporaryDirectory(
      [
        R.post("/", "list").idempotent().response({}),
        R.post("/update", "update").invalidations(T.invalidates("app", "list")),
      ],
      {
        enabledGenerators: ["validator", "router", "type"],
        isNodeServer: true,
        dumpStructure: true,
      },
    );

    t.equal(exitCode, 0);
  });

  t.test(
    "no error with empty 'useSharedParams' and 'useSharedQuery'",
    async (t) => {
      const { exitCode } = await codeGenToTemporaryDirectory(
        [
          R.get("/", "list").response({}),

          R.post("/:id/update", "update")
            .params({
              id: T.uuid(),
            })
            .invalidations(
              T.invalidates("app", "list", {
                useSharedParams: true,
                useSharedQuery: true,
              }),
            ),
        ],
        {
          enabledGenerators: ["validator", "router", "type"],
          isNodeServer: true,
          dumpStructure: true,
        },
      );

      t.equal(exitCode, 0);
    },
  );

  t.test(
    "no error with 'useSharedParams' and partial 'useSharedQuery'",
    async (t) => {
      const { exitCode } = await codeGenToTemporaryDirectory(
        [
          R.get("/:id", "get")
            .params({
              id: T.uuid(),
            })
            .query({
              startDate: T.date().optional(),
              endDate: T.date().optional(),
            })
            .response({}),

          R.post("/:id/update", "update")
            .params({
              id: T.uuid(),
            })
            .query({
              endDate: T.date().optional(),
            })
            .invalidations(
              T.invalidates("app", "get", {
                useSharedParams: true,
                useSharedQuery: true,
              }),
            ),
        ],
        {
          enabledGenerators: ["validator", "router", "type"],
          isNodeServer: true,
          dumpStructure: true,
        },
      );

      t.equal(exitCode, 0);
    },
  );

  t.test("no error with specification same properties", async (t) => {
    const { exitCode } = await codeGenToTemporaryDirectory(
      [
        R.get("/:id", "get")
          .params({
            id: T.uuid(),
          })
          .query({
            startDate: T.date().optional(),
            endDate: T.date().optional(),
          })
          .response({}),

        R.post("/:id/update", "update")
          .params({
            id: T.uuid(),
          })
          .query({
            endDate: T.date().optional(),
          })
          .invalidations(
            T.invalidates("app", "get", {
              specification: {
                params: {
                  id: ["params", "id"],
                },
                query: {
                  startDate: ["query", "endDate"],
                },
              },
            }),
          ),
      ],
      {
        enabledGenerators: ["validator", "router", "type"],
        isNodeServer: true,
        dumpStructure: true,
      },
    );

    t.equal(exitCode, 0);
  });

  t.test("error on unknown own specification", async (t) => {
    const { exitCode, stdout } = await codeGenToTemporaryDirectory(
      [
        R.get("/:id", "get")
          .params({
            id: T.uuid(),
          })
          .response({}),

        R.post("/update", "update").invalidations(
          T.invalidates("app", "get", {
            specification: {
              params: {
                id: ["params", "id"],
              },
            },
          }),
        ),
      ],
      {
        enabledGenerators: ["validator", "router", "type"],
        isNodeServer: true,
        dumpStructure: true,
      },
    );

    t.equal(exitCode, 1);
    t.ok(
      stdout.includes(
        "Invalidation from 'AppUpdate' to '(group: 'app', name: 'get')' has an invalid specification.",
      ),
    );
    t.ok(
      stdout.includes(
        "source ([params, id]) or target ('specification.params.id')",
      ),
    );
  });

  t.test("error on unknown target specification", async (t) => {
    const { exitCode, stdout } = await codeGenToTemporaryDirectory(
      [
        R.get("/", "list").response({}),

        R.post("/:id/update", "update")
          .params({
            id: T.uuid(),
          })
          .invalidations(
            T.invalidates("app", "list", {
              specification: {
                query: {
                  id: ["params", "id"],
                },
              },
            }),
          ),
      ],
      {
        enabledGenerators: ["validator", "router", "type"],
        isNodeServer: true,
        dumpStructure: true,
      },
    );

    t.equal(exitCode, 1);
    t.ok(
      stdout.includes(
        "Invalidation from 'AppUpdate' to '(group: 'app', name: 'list')' has an invalid specification.",
      ),
    );
    t.ok(
      stdout.includes(
        "source ([params, id]) or target ('specification.query.id')",
      ),
    );
  });
});
