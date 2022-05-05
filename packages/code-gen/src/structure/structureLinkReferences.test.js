import { mainTestFn, test } from "@compas/cli";
import { structureLinkReferences } from "./structureLinkReferences.js";

mainTestFn(import.meta);

test("code-gen/structure/structureLinkReferences", (t) => {
  t.test(
    "structureLinkReferences - does nothing on an empty structure",
    (t) => {
      const input = {};
      structureLinkReferences(input);

      t.deepEqual(input, {});
    },
  );

  t.test("structureLinkReferences - does nothing for basic types", (t) => {
    for (const type of [
      "any",
      "boolean",
      "date",
      "file",
      "number",
      "string",
      "uuid",
    ]) {
      const input = {
        group: {
          name: {
            type,
            group: "group",
            name: "name",
          },
        },
      };
      structureLinkReferences(input);

      t.deepEqual(input, {
        group: { name: { type, group: "group", name: "name" } },
      });
    }
  });

  t.test("structureLinkReferences - loops through anyOf", (t) => {
    const input = {
      group: {
        name: {
          type: "anyOf",
          group: "group",
          name: "name",
          values: [
            {
              type: "reference",
              reference: { group: "group", name: "reference" },
            },
          ],
        },
        reference: {
          type: "boolean",
          group: "group",
          name: "reference",
        },
      },
    };
    structureLinkReferences(input);
    t.deepEqual(input, {
      group: {
        name: {
          type: "anyOf",
          group: "group",
          name: "name",
          values: [
            {
              type: "reference",
              reference: {
                type: "boolean",
                group: "group",
                name: "reference",
              },
            },
          ],
        },
        reference: {
          type: "boolean",
          group: "group",
          name: "reference",
        },
      },
    });
  });

  t.test("structureLinkReferences - handles array", (t) => {
    const input = {
      group: {
        name: {
          type: "array",
          group: "group",
          name: "name",
          values: {
            type: "reference",
            reference: { group: "group", name: "reference" },
          },
        },
        reference: {
          type: "boolean",
          group: "group",
          name: "reference",
        },
      },
    };
    structureLinkReferences(input);
    t.deepEqual(input, {
      group: {
        name: {
          type: "array",
          group: "group",
          name: "name",
          values: {
            type: "reference",
            reference: {
              type: "boolean",
              group: "group",
              name: "reference",
            },
          },
        },
        reference: {
          type: "boolean",
          group: "group",
          name: "reference",
        },
      },
    });
  });

  t.test("structureLinkReferences - handles generic keys and values", (t) => {
    const input = {
      group: {
        name: {
          type: "generic",
          group: "group",
          name: "name",
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
          group: "group",
          name: "reference",
        },
      },
    };
    structureLinkReferences(input);
    t.deepEqual(input, {
      group: {
        name: {
          type: "generic",
          group: "group",
          name: "name",
          keys: {
            type: "reference",
            reference: {
              type: "boolean",
              group: "group",
              name: "reference",
            },
          },
          values: {
            type: "reference",
            reference: {
              type: "boolean",
              group: "group",
              name: "reference",
            },
          },
        },
        reference: {
          type: "boolean",
          group: "group",
          name: "reference",
        },
      },
    });
  });

  t.test("structureLinkReferences - handles object keys and relations", (t) => {
    const input = {
      group: {
        name: {
          type: "object",
          group: "group",
          name: "name",
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
          group: "group",
          name: "reference",
        },
      },
    };
    structureLinkReferences(input);
    t.deepEqual(input, {
      group: {
        name: {
          type: "object",
          group: "group",
          name: "name",
          keys: {
            key: {
              type: "reference",
              reference: {
                type: "boolean",
                group: "group",
                name: "reference",
              },
            },
          },
          relations: [],
        },
        reference: {
          type: "boolean",
          group: "group",
          name: "reference",
        },
      },
    });
  });
});
