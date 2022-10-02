import { mainTestFn, test } from "@compas/cli";
import { AppError, isNil } from "@compas/stdlib";
import {
  structureAddType,
  structureCopyAndSort,
  structureExtractGroups,
  structureExtractReferences,
  structureIncludeReferences,
  structureNamedTypes,
  structureResolveReference,
  structureValidateReferenceForType,
  structureValidateReferences,
} from "./structure.js";

mainTestFn(import.meta);

test("code-gen/experimental/processors/structure", (t) => {
  t.test("structureAddType", (t) => {
    t.test("only accepts named type definitions", (t) => {
      try {
        structureAddType({}, {}, {});
      } catch (e) {
        t.ok(AppError.instanceOf(e));
      }
    });

    t.test("add with existing group", (t) => {
      const structure = {
        foo: {
          baz: {},
        },
      };

      structureAddType(
        structure,
        {
          type: "boolean",
          group: "foo",
          name: "bar",
        },
        { skipReferenceExtraction: true },
      );

      t.ok(structure.foo.baz);
      t.ok(structure.foo.bar);
    });

    t.test("add with empty structure", (t) => {
      const structure = {};

      structureAddType(
        structure,
        {
          type: "boolean",
          group: "foo",
          name: "bar",
        },
        { skipReferenceExtraction: true },
      );

      t.ok(structure.foo.bar);
    });

    t.test("calls exstract references", (t) => {
      const structure = {};

      structureAddType(
        structure,
        {
          type: "reference",
          group: "foo",
          name: "bar",
          reference: {
            type: "boolean",
            group: "bar",
            name: "foo",
          },
        },
        { skipReferenceExtraction: false },
      );

      t.ok(structure.foo.bar);
      t.ok(structure.bar.foo);
      t.ok(isNil(structure.foo.bar.reference.type));
    });
  });

  t.test("structureNamedTypes", (t) => {
    t.test("empty structure", (t) => {
      const result = structureNamedTypes({});

      t.equal(result.length, 0);
    });

    t.test("multiple groups, doesn't create copies", (t) => {
      const structure = {
        foo: {
          bar: {},
        },
        bar: {
          baz: {},
        },
      };
      const result = structureNamedTypes(structure);

      t.equal(result.length, 2);
      t.equal(result[0], structure.foo.bar);
      t.equal(result[1], structure.bar.baz);
    });
  });

  t.test("structureExtractGroups", (t) => {
    t.test("returns a new structure", (t) => {
      const structure = {};

      const result = structureExtractGroups({}, []);

      t.notEqual(result, structure);
    });

    t.test("requires named types", (t) => {
      try {
        structureExtractGroups({ foo: { bar: {} } }, ["foo"]);
      } catch (e) {
        t.ok(AppError.instanceOf(e));
      }
    });

    t.test("picks the correct groups", (t) => {
      const result = structureExtractGroups(
        {
          foo: {
            bar: {
              type: "boolean",
              group: "foo",
              name: "bar",
            },
          },
        },
        ["foo"],
      );

      t.ok(result.foo.bar);
    });

    t.test("resolves references to other groups", (t) => {
      const result = structureExtractGroups(
        {
          foo: {
            bar: {
              type: "boolean",
              group: "foo",
              name: "bar",
            },
          },
          bar: {
            baz: {
              type: "reference",
              group: "bar",
              name: "baz",
              reference: {
                group: "foo",
                name: "bar",
              },
            },
          },
        },
        ["bar"],
      );

      t.ok(result.foo.bar);
      t.ok(result.bar.baz);
    });
  });

  t.test("structureValidateReferences", (t) => {
    t.test("doesn't throw if no errors are reported", (t) => {
      structureValidateReferences({
        foo: {
          bar: {
            type: "boolean",
            group: "foo",
            name: "bar",
          },
        },
      });

      t.pass();
    });

    t.test("throws if an error is detected", (t) => {
      try {
        structureValidateReferences({
          foo: {
            bar: {
              type: "reference",
              group: "foo",
              name: "bar",
              reference: {
                group: "foo",
                name: "baz",
              },
            },
          },
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.deepEqual(e.info, {
          messages: [
            "Could not resolve reference to ('foo', 'baz') via ('foo', 'bar')",
          ],
        });
      }
    });
  });

  t.test("structureResolveReference", (t) => {
    t.test("throws when an invalid type is passed", (t) => {
      try {
        structureResolveReference({}, { type: "boolean", isOptional: true });
      } catch (e) {
        t.equal(e.info.message, "Expected 'reference', found (boolean)");
      }
    });

    t.test("throws if reference can not be resolved", (t) => {
      try {
        structureResolveReference(
          {},
          {
            type: "reference",
            reference: { group: "foo", name: "bar" },
          },
        );
      } catch (e) {
        t.equal(
          e.info.message,
          "Could not resolve reference to ('foo', 'bar')",
        );
      }
    });

    t.test("returns the referenced type", (t) => {
      const structure = {
        foo: {
          bar: {
            type: "boolean",
            group: "foo",
            name: "bar",
          },
        },
      };

      const result = structureResolveReference(structure, {
        type: "reference",
        reference: {
          group: "foo",
          name: "bar",
        },
      });

      t.deepEqual(result, structure.foo.bar);
    });
  });

  t.test("structureCopyAndSort", (t) => {
    t.test("new structure is returned", (t) => {
      const structure = {
        foo: {},
        bar: {},
      };
      const result = structureCopyAndSort(structure);

      t.notEqual(result, structure);
    });

    t.test("structures are deepEqual - no side effects", (t) => {
      const structure = {
        foo: {
          bar: {
            type: "boolean",
            group: "foo",
            name: "bar",
          },
        },
        bar: {},
      };
      const result = structureCopyAndSort(structure);

      t.deepEqual(result, structure);
    });

    t.test("groups are returned in a sorted order by iterators", (t) => {
      const result = structureCopyAndSort({
        foo: {},
        bar: {},
      });

      t.deepEqual(Object.keys(result), ["bar", "foo"]);
    });

    t.test(
      "type definitions in a group are returned in a sorted order by iterators",
      (t) => {
        const result = structureCopyAndSort({
          foo: {
            quix: {
              type: "boolean",
              group: "foo",
              name: "quix",
            },
            baz: {
              type: "boolean",
              group: "foo",
              name: "baz",
            },
          },
          bar: {},
        });

        t.deepEqual(Object.keys(result), ["bar", "foo"]);
        t.deepEqual(Object.keys(result.foo), ["baz", "quix"]);
      },
    );
  });

  t.test("anyOf", (t) => {
    t.test("structureExtractReferences", (t) => {
      t.test("noop when not an anyOf", (t) => {
        const structure = {};
        const anyOf = {
          type: "boolean",
        };

        structureExtractReferences(structure, anyOf);

        t.deepEqual(structure, {});
      });

      t.test("named values type is added to the structure", (t) => {
        const structure = {};
        const anyOf = {
          type: "anyOf",
          values: [
            {
              type: "reference",
              reference: {
                type: "boolean",
                group: "foo",
                name: "bar",
              },
            },
          ],
        };

        structureExtractReferences(structure, anyOf);

        t.equal(structure.foo.bar.type, "boolean");
        t.deepEqual(anyOf.values[0].reference, {
          group: "foo",
          name: "bar",
        });
      });
    });

    t.test("structureIncludeReferences", (t) => {
      t.test("noop when not an anyOf", (t) => {
        const fullStructure = {};
        const newStructure = {};
        const anyOf = {
          type: "boolean",
        };

        structureIncludeReferences(fullStructure, newStructure, anyOf);

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
        const anyOf = {
          type: "anyOf",
          values: [
            {
              type: "reference",
              reference: {
                group: "foo",
                name: "bar",
              },
            },
          ],
        };

        structureIncludeReferences(fullStructure, newStructure, anyOf);

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
        const anyOf = {
          type: "anyOf",
          values: [
            {
              type: "reference",
              reference: {
                group: "foo",
                name: "bar",
              },
            },
          ],
        };

        structureValidateReferenceForType(structure, anyOf, []);

        t.pass();
      });

      t.test("throws on invalid reference", (t) => {
        const structure = {};
        const anyOf = {
          type: "anyOf",
          values: [
            {
              type: "reference",
              reference: {
                group: "foo",
                name: "bar",
              },
            },
          ],
        };

        try {
          structureValidateReferenceForType(structure, anyOf, []);
        } catch (e) {
          t.equal(
            e.info.message,
            "Could not resolve reference to ('foo', 'bar') via (anyOf)",
          );
        }
      });
    });
  });

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
