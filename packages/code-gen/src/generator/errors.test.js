import { mainTestFn, test } from "@compas/cli";
import { generateAndRunForBuilders } from "../../test/utils.test.js";
import { TypeCreator } from "../builders/TypeCreator.js";

mainTestFn(import.meta);

test("code-gen/errors", (t) => {
  t.test("sqlEnableValidator", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode } = await generateAndRunForBuilders(
      [T.object("foo").keys({}).enableQueries()],
      {
        enabledGenerators: ["sql"],
      },
    );

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Validator generator not enabled"));
  });

  t.test("sqlThrowingValidators", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode } = await generateAndRunForBuilders(
      [T.object("foo").keys({}).enableQueries()],
      {
        enabledGenerators: ["sql", "validator"],
        throwingValidators: false,
      },
    );

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Option 'throwingValidators' not enabled"));
  });

  t.test("sqlMissingPrimaryKey", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode } = await generateAndRunForBuilders(
      [
        T.object("foo").keys({}).enableQueries({
          withPrimaryKey: false,
        }),
      ],
      {
        isNodeServer: true,
      },
    );

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Type 'foo' is missing a primary key"));
  });

  t.test(
    "sqlMissingPrimaryKey - via reference that has no queries enabled",
    async (t) => {
      const T = new TypeCreator("app");
      const { stdout, exitCode } = await generateAndRunForBuilders(
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

      t.equal(exitCode, 1);
      t.ok(stdout.includes("Type 'bar' is missing a primary key"));
    },
  );

  t.test("sqlForgotEnableQueries", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode } = await generateAndRunForBuilders(
      [
        T.object("foo")
          .keys({})
          .enableQueries({})
          .relations(T.oneToOne("bar", T.reference("app", "bar"), "foo")),

        T.object("bar").keys({
          // Needs a primary key, else a missing primary key error will be thrown
          id: T.uuid().primary(),
        }),
      ],
      {
        isNodeServer: true,
      },
    );

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Type 'bar' did not call 'enableQueries'"));
  });

  t.test("sqlMissingOneToMany", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode } = await generateAndRunForBuilders(
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

    t.equal(exitCode, 1);
    t.ok(
      stdout.includes(
        "Relation from 'foo' is missing the inverse 'T.oneToMany()'",
      ),
    );
  });

  t.test("sqlUnusedOneToMany", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode } = await generateAndRunForBuilders(
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

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Relation defined for 'bar', referencing 'foo'"));
  });

  t.test("sqlDuplicateShortName", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode } = await generateAndRunForBuilders(
      [
        T.object("foo").keys({}).enableQueries({}).shortName("test"),

        T.object("bar").keys({}).enableQueries().shortName("test"),
      ],
      {
        isNodeServer: true,
      },
    );

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Short name 'test' is used by both"));
  });

  t.test("sqlReservedRelationKey", async (t) => {
    const T = new TypeCreator("app");
    const { stdout, exitCode } = await generateAndRunForBuilders(
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

    t.equal(exitCode, 1);
    t.ok(stdout.includes("Relation name 'select' from type 'foo'"));
    t.ok(stdout.includes("Relation name 'orderBy' from type 'bar'"));
  });
});
