import { mainTestFn, test } from "@lbu/cli";
import { linkupReferencesInStructure } from "./linkup-references.js";

mainTestFn(import.meta);

test("code-gen/generator/linkup-references", (t) => {
  t.test(
    "linkupReferencesInStructure - does nothing on an empty structure",
    (t) => {
      const input = {};
      linkupReferencesInStructure({
        structure: input,
      });

      t.deepEqual(input, {});
    },
  );

  t.test("linkupReferencesInStructure - does nothing for baisc types", (t) => {
    for (const type of [
      "any",
      "boolean",
      "date",
      "file",
      "number",
      "string",
      "uuid",
    ]) {
      const input = { group: { name: { type } } };
      linkupReferencesInStructure({
        structure: input,
      });

      t.deepEqual(input, { group: { name: { type } } });
    }
  });

  t.test("linkupReferencesInStructure - loops through anyOf", (t) => {
    const input = {
      group: {
        name: {
          type: "anyOf",
          values: [
            {
              type: "reference",
              reference: { group: "group", name: "reference" },
            },
          ],
        },
        reference: {
          type: "boolean",
        },
      },
    };
    linkupReferencesInStructure({ structure: input });
    t.deepEqual(input, {
      group: {
        name: {
          type: "anyOf",
          values: [{ type: "reference", reference: { type: "boolean" } }],
        },
        reference: {
          type: "boolean",
        },
      },
    });
  });

  t.test("linkupReferencesInStructure - handles array", (t) => {
    const input = {
      group: {
        name: {
          type: "array",
          values: {
            type: "reference",
            reference: { group: "group", name: "reference" },
          },
        },
        reference: {
          type: "boolean",
        },
      },
    };
    linkupReferencesInStructure({ structure: input });
    t.deepEqual(input, {
      group: {
        name: {
          type: "array",
          values: { type: "reference", reference: { type: "boolean" } },
        },
        reference: {
          type: "boolean",
        },
      },
    });
  });

  t.test(
    "linkupReferencesInStructure - handles generic keys and values",
    (t) => {
      const input = {
        group: {
          name: {
            type: "generic",
            keys: {
              type: "reference",
              reference: { group: "group", name: "reference" },
            },
            values: {
              type: "reference",
              reference: { group: "group", name: "reference" },
            },
          },
          reference: {
            type: "boolean",
          },
        },
      };
      linkupReferencesInStructure({ structure: input });
      t.deepEqual(input, {
        group: {
          name: {
            type: "generic",
            keys: { type: "reference", reference: { type: "boolean" } },
            values: { type: "reference", reference: { type: "boolean" } },
          },
          reference: {
            type: "boolean",
          },
        },
      });
    },
  );

  t.test(
    "linkupReferencesInStructure - handles object keys and relations",
    (t) => {
      const input = {
        group: {
          name: {
            type: "object",
            keys: {
              key: {
                type: "reference",
                reference: { group: "group", name: "reference" },
              },
            },
            relations: [],
          },
          reference: {
            type: "boolean",
          },
        },
      };
      linkupReferencesInStructure({ structure: input });
      t.deepEqual(input, {
        group: {
          name: {
            type: "object",
            keys: {
              key: { type: "reference", reference: { type: "boolean" } },
            },
            relations: [],
          },
          reference: {
            type: "boolean",
          },
        },
      });
    },
  );
});
