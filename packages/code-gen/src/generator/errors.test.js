import { mainTestFn, test } from "@compas/cli";
import { codeGenToTemporaryDirectory } from "../../test/legacy/utils.test.js";
import { TypeCreator } from "../builders/TypeCreator.js";

mainTestFn(import.meta);

test("code-gen/errors", (t) => {
  t.test("error - reserved group", async (t) => {
    const T = new TypeCreator("static");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [T.object("foo").keys({}).enableQueries()],
        {
          enabledGenerators: ["type"],
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Group 'static' is a JavaScript or TypeScript"));
  });

  t.test("error - empty / unknown group", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [T.object("foo").keys({}).enableQueries()],
        {
          enabledGenerators: ["type"],
          enabledGroups: ["foo", "bar"],
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Group 'foo' is provided in"));
    t.ok(stdout.includes("Group 'bar' is provided in"));
  });

  t.test("error - sql requires validator generator", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [T.object("foo").keys({}).enableQueries()],
        {
          enabledGenerators: ["sql"],
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Validator generator not enabled"));
  });

  t.test("error - entity without primary key", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("foo").keys({}).enableQueries({
            withPrimaryKey: false,
          }),
        ],
        {
          isNodeServer: true,
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Type 'foo' is missing a primary key"));
  });

  t.test(
    "error - no primary key via reference that has no queries enabled",
    async (t) => {
      const T = new TypeCreator("app");
      const { stdout, exitCode, cleanupGeneratedDirectory } =
        await codeGenToTemporaryDirectory(
          [
            T.object("foo")
              .keys({})
              .enableQueries({})
              .relations(T.oneToOne("bar", T.reference("app", "bar"), "foo")),

            T.object("bar").keys({}),
          ],
          {
            isNodeServer: true,
          },
        );

      await cleanupGeneratedDirectory();

      t.equal(exitCode, 1);
      t.ok(stdout.includes("Type 'bar' is missing a primary key"));
    },
  );

  t.test("error - missing enableQueries", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("foo")
            .keys({})
            .enableQueries({})
            .relations(T.oneToOne("bar", T.reference("app", "bar"), "foo")),

          // Needs a primary
          // key, else a
          // missing primary
          // key error will be
          // thrown
          T.object("bar").keys({
            id: T.uuid().primary(),
          }),
        ],
        {
          isNodeServer: true,
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Type 'bar' did not call 'enableQueries'"));
  });

  t.test("error - unique own key", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("foo")
            .keys({})
            .enableQueries({})
            .relations(
              T.manyToOne("baz", T.reference("app", "bar"), "baz"),
              T.oneToOne("baz", T.reference("app", "bar"), "baz"),
            ),

          T.object("bar")
            .keys({})
            .enableQueries({})
            .relations(T.oneToMany("baz", T.reference("app", "foo"))),
        ],
        {
          isNodeServer: true,
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(stdout.includes("multiple relations with the same own key 'baz'"));
  });

  t.test("error - duplicate relation", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("foo")
            .keys({})
            .enableQueries({})
            .relations(
              T.manyToOne("baz", T.reference("app", "bar"), "baz"),
              T.oneToOne("baz", T.reference("app", "bar"), "baz"),
            ),

          T.object("bar")
            .keys({})
            .enableQueries({})
            .relations(T.oneToMany("baz", T.reference("app", "foo"))),
        ],
        {
          isNodeServer: true,
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(stdout.includes("multiple relations to 'AppBar'.'baz'"));
  });

  t.test("errror - missing oneToMany", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("foo")
            .keys({})
            .enableQueries({})
            .relations(T.manyToOne("bar", T.reference("app", "bar"), "foo")),

          T.object("bar").keys({}).enableQueries(),
        ],
        {
          isNodeServer: true,
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(
      stdout.includes(
        "Relation from 'foo' is missing the inverse 'T.oneToMany()'",
      ),
    );
  });

  t.test("error - unused oneToMany", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("foo").keys({}).enableQueries({}),

          T.object("bar")
            .keys({})
            .enableQueries()
            .relations(T.oneToMany("foo", T.reference("app", "foo"))),
        ],
        {
          isNodeServer: true,
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Relation defined for 'bar', referencing 'foo'"));
  });

  t.test("error - duplicate shortName", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("foo").keys({}).enableQueries({}).shortName("test"),

          T.object("bar").keys({}).enableQueries().shortName("test"),
        ],
        {
          isNodeServer: true,
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Short name 'test' is used by both"));
  });

  t.test("error - reserved key", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("foo")
            .keys({
              $append: T.string(),
              recursively: T.object().keys({
                $add: T.number(),
              }),
              recursivelyNamed: T.object("named").keys({
                $set: T.string(),
              }),
            })
            .enableQueries({}),
        ],
        {
          isNodeServer: true,
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(
      stdout.includes(
        `Type 'AppFoo' recursively uses the reserved key '$append'`,
      ),
    );
    t.ok(
      stdout.includes(`Type 'AppFoo' recursively uses the reserved key '$add'`),
    );
    t.ok(
      stdout.includes(
        `Type 'AppNamed' recursively uses the reserved key '$set'`,
      ),
    );
  });

  t.test("error - reserved relation key", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("foo")
            .keys({})
            .enableQueries({})
            .relations(
              T.oneToOne("select", T.reference("app", "bar"), "orderBy"),
            ),

          T.object("bar").keys({}).enableQueries(),
        ],
        {
          isNodeServer: true,
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Relation name 'select' from type 'foo'"));
    t.ok(stdout.includes("Relation name 'orderBy' from type 'bar'"));
  });
});
