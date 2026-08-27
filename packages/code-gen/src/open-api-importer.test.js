import { readFileSync } from "node:fs";
import { mainTestFn, test } from "@compas/cli";
import { isNil, pathJoin, uuid } from "@compas/stdlib";
import { testTemporaryDirectory } from "../../../src/testing.js";
import { Generator } from "./generator.js";
import { convertOpenAPISpec } from "./open-api-importer.js";

mainTestFn(import.meta);

const loadCopy = () =>
  JSON.parse(readFileSync(`./__fixtures__/code-gen/openapi.json`, "utf-8"));

test("code-gen/open-api-importer", (t) => {
  t.test("throw on invalid version", (t) => {
    try {
      convertOpenAPISpec("test", {});
      t.fail("Should throw for invalid version");
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      convertOpenAPISpec("test", { openapi: "" });
      t.fail("Should throw for invalid version");
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      convertOpenAPISpec("test", { openapi: "2." });
      t.fail("Should throw for invalid version");
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      convertOpenAPISpec("test", { openapi: "3.1.0" });
      t.pass("Should not throw");
    } catch (e) {
      t.fail("Should not throw");
      t.log.error(e);
    }
  });

  t.test("has default group", (t) => {
    const result = convertOpenAPISpec("Test", loadCopy());
    t.deepEqual(Object.keys(result), ["test"]);
  });

  t.test(
    "escapes spec-provided values in the generated validators",
    async (t) => {
      const marker = "__compasOpenApiImporterMarker";
      const inject = `"]; globalThis.${marker} = true; //`;
      const enumValue = `safe${inject}`;

      const spec = {
        openapi: "3.0.0",
        info: { title: "test", version: "1.0.0" },
        paths: {
          "/items": {
            get: {
              operationId: "listItems",
              responses: {
                200: {
                  description: "ok",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/Item" },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            Item: {
              type: "object",
              description: `*/ globalThis.${marker} = true; /**`,
              required: ["status"],
              properties: {
                [`key${inject}`]: { type: "string" },
                status: {
                  type: "string",
                  enum: [enumValue, 5, null],
                },
              },
            },
          },
        },
      };

      const outputDirectory = `${testTemporaryDirectory}/${uuid()}`;
      const generator = new Generator(t.log);
      generator.addStructure(convertOpenAPISpec("test", spec));
      generator.generate({
        targetLanguage: "js",
        outputDirectory,
        generators: {
          validators: { includeBaseTypes: true },
        },
      });

      const { validateTestItem } = await import(
        pathJoin(process.cwd(), outputDirectory, "test/validators.js")
      );

      t.equal(globalThis[marker], undefined);

      const valid = validateTestItem({ status: enumValue });
      t.ok(isNil(valid.error));
      t.equal(valid.value.status, enumValue);

      const invalid = validateTestItem({ status: "other" });
      t.equal(invalid.error?.["$.status"]?.key, "validator.oneOf");
      t.deepEqual(invalid.error?.["$.status"]?.allowedValues, [enumValue]);
    },
  );
});
