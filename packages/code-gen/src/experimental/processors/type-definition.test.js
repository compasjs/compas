import { mainTestFn, test } from "@compas/cli";
import { isNil } from "@compas/stdlib";
import {
  structureExtractReferences,
  structureIncludeReferences,
  structureValidateReferenceForType,
} from "./structure.js";

mainTestFn(import.meta);

test("code-gen/experimental/processors/type-definition", (t) => {
  t.test("array", (t) => {
    t.test("structureExtractReferences", (t) => {
      t.test("noop when not an array", (t) => {
        const structure = {};
        const array = {
          type: "boolean",
        };

        structureExtractReferences(structure, array);

        t.deepEqual(structure, {});
      });

      t.test("named values type is added to the structure", (t) => {
        const structure = {};
        const array = {
          type: "array",
          values: {
            type: "reference",
            reference: {
              type: "boolean",
              group: "foo",
              name: "bar",
            },
          },
        };

        structureExtractReferences(structure, array);

        t.equal(structure.foo.bar.type, "boolean");
        t.deepEqual(array.values.reference, {
          group: "foo",
          name: "bar",
        });
      });
    });

    t.test("structureIncludeReferences", (t) => {
      t.test("noop when not an array", (t) => {
        const fullStructure = {};
        const newStructure = {};
        const array = {
          type: "boolean",
        };

        structureIncludeReferences(fullStructure, newStructure, array);

        t.deepEqual(fullStructure, {});
        t.deepEqual(newStructure, {});
      });

      t.test("reference on values is included", (t) => {
        const fullStructure = {
          foo: {
            bar: {
              type: "boolean",
              group: "foo",
              name: "bar",
            },
          },
        };
        const newStructure = {};
        const array = {
          type: "array",
          values: {
            type: "reference",
            reference: {
              group: "foo",
              name: "bar",
            },
          },
        };

        structureIncludeReferences(fullStructure, newStructure, array);

        t.deepEqual(fullStructure, newStructure);
        t.equal(fullStructure.foo.bar, newStructure.foo.bar);
      });
    });

    t.test("structureValidateReferenceForType", (t) => {
      t.test("correct reference is ignored", (t) => {
        const structure = {
          foo: {
            bar: {
              type: "boolean",
            },
          },
        };
        const array = {
          type: "array",
          values: {
            type: "reference",
            reference: {
              group: "foo",
              name: "bar",
            },
          },
        };

        structureValidateReferenceForType(structure, array, []);

        t.pass();
      });

      t.test("throws on invalid reference", (t) => {
        const structure = {};
        const array = {
          type: "array",
          values: {
            type: "reference",
            reference: {
              group: "foo",
              name: "bar",
            },
          },
        };

        try {
          structureValidateReferenceForType(structure, array, []);
        } catch (e) {
          t.equal(
            e.info.message,
            "Could not resolve reference to ('foo', 'bar') via (array)",
          );
        }
      });
    });
  });

  t.test("object", (t) => {
    t.test("structureExtractReferences", (t) => {
      t.test("noop when not an object", (t) => {
        const structure = {};
        const object = {
          type: "boolean",
        };

        structureExtractReferences(structure, object);

        t.deepEqual(structure, {});
      });

      t.test("named key type is added to the structure", (t) => {
        const structure = {};
        const object = {
          type: "object",
          keys: {
            foo: {
              type: "reference",
              reference: {
                type: "boolean",
                group: "foo",
                name: "bar",
              },
            },
          },
        };

        structureExtractReferences(structure, object);

        t.equal(structure.foo.bar.type, "boolean");
        t.deepEqual(object.keys.foo.reference, {
          group: "foo",
          name: "bar",
        });
      });
    });

    t.test("structureIncludeReferences", (t) => {
      t.test("noop when not an object", (t) => {
        const fullStructure = {};
        const newStructure = {};
        const object = {
          type: "boolean",
        };

        structureIncludeReferences(fullStructure, newStructure, object);

        t.deepEqual(fullStructure, {});
        t.deepEqual(newStructure, {});
      });

      t.test("references on keys are included", (t) => {
        const fullStructure = {
          foo: {
            bar: {
              type: "boolean",
              group: "foo",
              name: "bar",
            },
          },
        };
        const newStructure = {};
        const object = {
          type: "object",
          keys: {
            bool: {
              type: "reference",
              reference: {
                group: "foo",
                name: "bar",
              },
            },
          },
        };

        structureIncludeReferences(fullStructure, newStructure, object);

        t.deepEqual(fullStructure, newStructure);
        t.equal(fullStructure.foo.bar, newStructure.foo.bar);
      });
    });

    t.test("structureValidateReferenceForType", (t) => {
      t.test("correct reference is ignored", (t) => {
        const structure = {
          foo: {
            bar: {
              type: "boolean",
            },
          },
        };
        const object = {
          type: "object",
          keys: {
            foo: {
              type: "reference",
              reference: {
                group: "foo",
                name: "bar",
              },
            },
          },
        };

        structureValidateReferenceForType(structure, object, []);

        t.pass();
      });

      t.test("throws on invalid reference", (t) => {
        const structure = {};
        const object = {
          type: "object",
          keys: {
            foo: {
              type: "reference",
              reference: {
                group: "foo",
                name: "bar",
              },
            },
          },
        };

        try {
          structureValidateReferenceForType(structure, object, []);
        } catch (e) {
          t.equal(
            e.info.message,
            "Could not resolve reference to ('foo', 'bar') via (object)",
          );
        }
      });
    });
  });

  t.test("reference", (t) => {
    t.test("structureExtractReferences", (t) => {
      t.test("noop when not a reference", (t) => {
        const structure = {};
        const reference = {
          type: "boolean",
        };

        structureExtractReferences(structure, reference);

        t.deepEqual(structure, {});
      });

      t.test("type is added to the structure", (t) => {
        const structure = {};
        const reference = {
          type: "reference",
          reference: {
            type: "boolean",
            group: "foo",
            name: "bar",
          },
        };

        structureExtractReferences(structure, reference);

        // We can't check for equal object here, since we modify the reference
        t.equal(structure.foo.bar.type, "boolean");
      });

      t.test("reference is simplified", (t) => {
        const structure = {};
        const reference = {
          type: "reference",
          reference: {
            type: "boolean",
            group: "foo",
            name: "bar",
          },
        };

        structureExtractReferences(structure, reference);

        t.deepEqual(reference.reference, {
          group: "foo",
          name: "bar",
        });
      });

      t.test("ignored if the reference is already 'extracted' ", (t) => {
        const structure = {};
        const reference = {
          type: "reference",
          reference: {
            group: "foo",
            name: "bar",
          },
        };

        structureExtractReferences(structure, reference);

        t.ok(isNil(structure.foo?.bar));
        t.deepEqual(reference.reference, {
          group: "foo",
          name: "bar",
        });
      });
    });

    t.test("structureIncludeReferences", (t) => {
      t.test("noop when not a reference", (t) => {
        const fullStructure = {};
        const newStructure = {};
        const reference = {
          type: "boolean",
        };

        structureIncludeReferences(fullStructure, newStructure, reference);

        t.deepEqual(fullStructure, {});
        t.deepEqual(newStructure, {});
      });

      t.test("unknown references are ignored", (t) => {
        const fullStructure = {};
        const newStructure = {};
        const reference = {
          type: "reference",
          reference: {
            group: "foo",
            name: "bar",
          },
        };

        structureIncludeReferences(fullStructure, newStructure, reference);

        t.deepEqual(fullStructure, {});
        t.deepEqual(newStructure, {});
      });

      t.test("object that is referenced is on the new structure", (t) => {
        const fullStructure = {
          foo: {
            bar: {
              type: "boo",
              group: "foo",
              name: "bar",
            },
          },
        };
        const newStructure = {};
        const reference = {
          type: "reference",
          reference: {
            group: "foo",
            name: "bar",
          },
        };

        structureIncludeReferences(fullStructure, newStructure, reference);

        t.deepEqual(fullStructure, newStructure);
        t.equal(fullStructure.foo.bar, newStructure.foo.bar);
      });
    });

    t.test("structureValidateReferenceForType", (t) => {
      t.test("correct reference is ignored", (t) => {
        const structure = {
          foo: { bar: { type: "boolean" } },
        };
        const reference = {
          type: "reference",
          reference: {
            group: "foo",
            name: "bar",
          },
        };

        structureValidateReferenceForType(structure, reference, []);

        t.pass();
      });

      t.test("throws on invalid reference", (t) => {
        try {
          const structure = {};
          const reference = {
            type: "reference",
            reference: {
              group: "foo",
              name: "bar",
            },
          };

          structureValidateReferenceForType(structure, reference, [
            "('foo', 'quix')",
            "(object)",
          ]);
        } catch (e) {
          t.equal(
            e.info.message,
            "Could not resolve reference to ('foo', 'bar') via ('foo', 'quix') -> (object)",
          );
        }
      });
    });
  });
});
