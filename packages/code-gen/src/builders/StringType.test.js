import { mainTestFn, test } from "@compas/cli";
import { testGeneratorType } from "../../test/testing.js";
import { StringType } from "./StringType.js";

mainTestFn(import.meta);

test("code-gen/builders/StringType", (t) => {
  t.test("disallowCharacters", (t) => {
    /**
     * @param {import("@compas/cli").TestRunner} t
     * @param {string} entry
     */
    const assertRejects = (t, entry) => {
      try {
        new StringType().disallowCharacters([entry]);
        t.fail(`should reject ${JSON.stringify(entry)}`);
      } catch (e) {
        t.ok(e instanceof TypeError);
        t.ok(
          e.message.includes(JSON.stringify(entry)),
          "names the offending entry",
        );
      }
    };

    t.test("rejects two ascii characters", (t) => {
      assertRejects(t, "ab");
    });

    t.test("rejects two backslashes", (t) => {
      assertRejects(t, "\\\\");
    });

    t.test("rejects an empty string", (t) => {
      assertRejects(t, "");
    });

    t.test("accepts a single backslash", (t) => {
      const type = new StringType().disallowCharacters(["\\"]).max(10).build();

      t.deepEqual(type.validator.disallowedCharacters, ["\\"]);
    });

    t.test("accepts a single emoji", (t) => {
      const type = new StringType().disallowCharacters(["😀"]).max(10).build();

      t.deepEqual(type.validator.disallowedCharacters, ["😀"]);
    });

    t.test("generated validator rejects a single backslash", async (t) => {
      const { error } = await testGeneratorType(
        t,
        {
          group: "app",
          validatorName: "validateAppNoBackslash",
          validatorInput: "foo\\bar",
        },
        (T) => [T.string("noBackslash").disallowCharacters(["\\"]).max(20)],
      );

      t.equal(error.$.key, "validator.disallowedCharacters");
    });

    t.test(
      "generated validator passes a value without backslash",
      async (t) => {
        const { value } = await testGeneratorType(
          t,
          {
            group: "app",
            validatorName: "validateAppNoBackslash",
            validatorInput: "foo/bar",
          },
          (T) => [T.string("noBackslash").disallowCharacters(["\\"]).max(20)],
        );

        t.equal(value, "foo/bar");
      },
    );
  });
});
