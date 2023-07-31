import { readFileSync } from "node:fs";
import { mainTestFn, test } from "@compas/cli";
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
});
