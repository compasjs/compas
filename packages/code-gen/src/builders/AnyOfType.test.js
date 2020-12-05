import { mainTestFn, test } from "@compas/cli";
import { AnyOfType } from "./AnyOfType.js";
import { BooleanType } from "./BooleanType.js";
import { StringType } from "./StringType.js";

mainTestFn(import.meta);

test("code-gen/builds/AnyOfType", (t) => {
  t.test("removes duplicates on build", (t) => {
    const type = new AnyOfType()
      .values(new BooleanType(), new StringType(), new BooleanType())
      .build();

    t.equal(type.values.length, 2);
  });
});
