import { mainTestFn, test } from "@compas/cli";
import { codeGenToTemporaryDirectory } from "../../test/utils.test.js";
import { TypeCreator } from "../builders/index.js";

mainTestFn(import.meta);

test("code-gen/crud/route-creator", (t) => {
  t.test("can generate", async (t) => {
    const T = new TypeCreator("database");
    const Tpost = new TypeCreator("post");

    const { stdout, exitCode, generatedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("post")
            .keys({})
            .enableQueries({
              withDates: true,
            })
            .relations(T.oneToMany("tags", T.reference("database", "tag"))),

          T.object("tag")
            .keys({
              name: T.string(),
            })
            .enableQueries({})
            .relations(
              T.manyToOne("post", T.reference("database", "post"), "tags"),
            ),

          Tpost.crud("/post")
            .entity(T.reference("database", "post"))
            .fields({
              readable: {
                $omit: ["createdAt"],
              },
            })
            .inlineRelations(Tpost.crud().fromParent("tags", { name: "tag" }))
            .nestedRelations(
              Tpost.crud("/tag").fromParent("tags", { name: "tag" }),
            ),
        ],
        {
          enabledGenerators: [
            "type",
            "router",
            "validator",
            "apiClient",
            "sql",
          ],
        },
      );

    t.equal(exitCode, 0);
    t.log.info({
      exitCode,
      stdout,
      generatedDirectory,
    });
  });
});
