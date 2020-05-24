import { dirnameForModule } from "@lbu/stdlib";
import { readFileSync } from "fs";
import test from "tape";
import { convertOpenAPISpec } from "./open-api-importer.js";

const loadCopy = () =>
  JSON.parse(
    readFileSync(
      dirnameForModule(import.meta) + "/__fixtures__/openapi.json",
      "utf-8",
    ),
  );

test("code-gen/open-api-importer", (t) => {
  t.test("throw on invalid version", (t) => {
    t.throws(() => convertOpenAPISpec("test", {}), Error);
    t.throws(() => convertOpenAPISpec("test", { openapi: "" }));
    t.throws(() => convertOpenAPISpec("test", { openapi: "2." }));
    t.doesNotThrow(() => convertOpenAPISpec("test", { openapi: "3.1.0" }));

    t.end();
  });

  t.test("has default group", (t) => {
    const result = convertOpenAPISpec("Test", loadCopy());
    t.deepEqual(Object.keys(result), ["test"]);
    t.end();
  });
});
