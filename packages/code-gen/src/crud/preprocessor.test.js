import { mainTestFn, test } from "@compas/cli";
import { codeGenToTemporaryDirectory } from "../../test/legacy/utils.test.js";
import { TypeCreator } from "../builders/index.js";

mainTestFn(import.meta);

test("code-gen/crud/preprocessor", (t) => {
  t.test("validation", (t) => {
    t.test("error - unnamed object", async (t) => {
      const T = new TypeCreator("app");
      const { stdout, exitCode, cleanupGeneratedDirectory } =
        await codeGenToTemporaryDirectory(
          [T.crud("/bar").entity(T.object().enableQueries())],
          {
            enabledGenerators: ["type", "sql"],
          },
        );

      await cleanupGeneratedDirectory();

      t.equal(exitCode, 1);
      t.ok(
        stdout.includes(
          "Found a 'T.crud()' in the 'app' group which did not call '.entity()'",
        ),
      );
    });

    t.test("error - not enabled queries", async (t) => {
      const T = new TypeCreator("app");
      const { stdout, exitCode, cleanupGeneratedDirectory } =
        await codeGenToTemporaryDirectory(
          [T.crud("/bar").entity(T.object("bar"))],
          {
            enabledGenerators: ["type", "sql"],
          },
        );

      await cleanupGeneratedDirectory();

      t.equal(exitCode, 1);
      t.ok(
        stdout.includes(
          "Found a 'T.crud()' in the 'app' group which did not call '.entity()'",
        ),
      );
    });

    t.test("error soft delete not supported", async (t) => {
      const T = new TypeCreator("app");
      const { stdout, exitCode, cleanupGeneratedDirectory } =
        await codeGenToTemporaryDirectory(
          [
            T.crud("/bar").entity(
              T.object("bar").enableQueries({ withSoftDeletes: true }),
            ),
          ],
          {
            enabledGenerators: ["type", "sql"],
          },
        );

      await cleanupGeneratedDirectory();

      t.equal(exitCode, 1);
      t.ok(stdout.includes("Replace 'withSoftDeletes' with 'withDates' "));
    });

    t.test("error - store file not supported", async (t) => {
      const T = new TypeCreator("app");
      const { stdout, exitCode, cleanupGeneratedDirectory } =
        await codeGenToTemporaryDirectory(
          [
            T.crud("/bar").entity(
              new TypeCreator("store")
                .object("file")
                .enableQueries({ withDates: true }),
            ),
          ],
          {
            enabledGenerators: ["type", "sql"],
          },
        );

      await cleanupGeneratedDirectory();

      t.equal(exitCode, 1);
      t.ok(
        stdout.includes(
          "files, but it is used in a 'T.crud()' call in the 'app' group",
        ),
      );
    });

    t.test("error - store file reference", async (t) => {
      const T = new TypeCreator("app");
      const { stdout, exitCode, cleanupGeneratedDirectory } =
        await codeGenToTemporaryDirectory(
          [
            new TypeCreator("store")
              .object("file")
              .enableQueries({ withDates: true }),

            T.object("post")
              .enableQueries({ withDates: true })
              .relations(
                T.oneToOne("image", T.reference("store", "file"), "postImage"),
              ),

            T.crud("/bar").entity(T.reference("app", "post")),
          ],
          {
            enabledGenerators: ["type"],
          },
        );

      await cleanupGeneratedDirectory();

      t.equal(exitCode, 1);
      t.ok(stdout.includes("files, but it is referenced by 'AppPost'"));
    });

    t.test("error - unknown from parent", async (t) => {
      const T = new TypeCreator("app");
      const { stdout, exitCode, cleanupGeneratedDirectory } =
        await codeGenToTemporaryDirectory(
          [
            T.object("post")
              .enableQueries({
                withDates: true,
              })
              .relations(T.oneToMany("tags", T.reference("app", "postTag"))),

            T.object("postTag")
              .enableQueries({
                withDates: true,
              })
              .relations(
                T.manyToOne("post", T.reference("app", "post"), "tags"),
              ),

            T.crud("/bar")
              .entity(T.reference("app", "post"))
              .inlineRelations(
                T.crud().fromParent("tags"),
                T.crud().fromParent("images"),
              ),
          ],
          {
            enabledGenerators: ["type", "sql"],
          },
        );

      await cleanupGeneratedDirectory();

      t.equal(exitCode, 1);
      t.ok(
        stdout.includes(
          "Relation in CRUD from 'AppPost' via 'images' could not be resolved",
        ),
      );
    });
  });
});
