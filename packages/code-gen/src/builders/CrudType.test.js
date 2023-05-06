import { mainTestFn, test } from "@compas/cli";
import { AppError } from "@compas/stdlib";
import { TypeCreator } from "./index.js";

mainTestFn(import.meta);

test("code-gen/crud/CrudType", (t) => {
  t.test("build", (t) => {
    t.test("no entity & no parent", (t) => {
      try {
        const T = new TypeCreator();
        T.crud("/foo").build();
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.ok(e.info.message.includes("either call"));
      }
    });

    t.test("with entity", (t) => {
      const T = new TypeCreator();
      const result = T.crud("/bar")
        .entity(T.reference("database", "post"))
        .build();

      t.equal(result.entity.type, "reference");
    });

    t.test("with fromParent", (t) => {
      const T = new TypeCreator();
      const result = T.crud().fromParent("tags", { name: "tag" }).build();

      t.equal(result.fromParent.field, "tags");
    });
  });

  t.test("inlineRelation", (t) => {
    t.test("invalid type", (t) => {
      try {
        const T = new TypeCreator();
        T.crud("/post")
          .entity(T.reference("database", "post"))
          .inlineRelations(T.bool())
          .build();
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.ok(e.info.message.includes("should be created via"));
      }
    });

    t.test("success", (t) => {
      const T = new TypeCreator();
      const result = T.crud("/post")
        .entity(T.reference("database", "post"))
        .inlineRelations(
          T.crud()
            .fromParent("tags", { name: "tag" })
            .fields({
              readable: {
                $omit: ["bar"],
              },
              writable: {
                $pick: ["foo"],
              },
            }),
        )
        .build();

      t.equal(result.inlineRelations.length, 1);
    });
  });

  t.test("nestedRelation", (t) => {
    t.test("invalid type", (t) => {
      try {
        const T = new TypeCreator();
        T.crud("/post")
          .entity(T.reference("database", "post"))
          .nestedRelations(T.bool())
          .build();
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.ok(e.info.message.includes("should be created via"));
      }
    });

    t.test("success", (t) => {
      const T = new TypeCreator();
      const result = T.crud("/post")
        .entity(T.reference("database", "post"))
        .nestedRelations(
          T.crud("/tag")
            .fromParent("tags", { name: "tag" })
            .fields({
              readable: {
                $omit: ["bar"],
              },
              writable: {
                $pick: ["foo"],
              },
            }),
        )
        .build();

      t.equal(result.nestedRelations.length, 1);
    });
  });
});
