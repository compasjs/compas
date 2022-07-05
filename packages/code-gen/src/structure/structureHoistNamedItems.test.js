import { mainTestFn, test } from "@compas/cli";
import { structureHoistNamedItems } from "./structureHoistNamedItems.js";

mainTestFn(import.meta);

test("code-gen/structure/structureHoistNamedItems", (t) => {
  t.test("should not overwritten named items", (t) => {
    const structure = {
      group2: {
        bar: {
          type: "object",
          name: "bar",
          group: "group2",
          isOptional: false,
          keys: {},
          relations: [],
        },
      },
      group1: {
        baz: {
          type: "object",
          name: "baz",
          group: "group1",
          keys: {
            ref: {
              type: "object",
              keys: {},
              relations: [],
            },
          },
          relations: [],
        },
      },
    };

    structure.group1.baz.keys.ref = {
      ...structure.group2.bar,
      isOptional: true,
    };

    structureHoistNamedItems(structure);

    t.equal(structure.group2.bar.isOptional, false);
  });
});
