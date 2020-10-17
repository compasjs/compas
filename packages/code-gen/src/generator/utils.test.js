import { mainTestFn, test } from "@lbu/cli";
import { cleanTemplateOutput } from "./utils.js";

mainTestFn(import.meta);

test("code-gen/generate/utils", (t) => {
  t.test("cleanTemplateOutput - removes multiple empty lines", (t) => {
    const result = cleanTemplateOutput(`f\n\n\nf\n`);

    t.equal(result, "f\nf");
  });

  t.test("cleanTemplateOutput - remove end of line whitespace", (t) => {
    const result = cleanTemplateOutput(`f  \n  `);

    t.equal(result, `f`);
  });

  t.test("cleanTempalteOutput - replace empty lines in JSDoc", (t) => {
    const result = cleanTemplateOutput(`/*\n * Foo\n \n * Bar\n */`);

    t.equal(result, `/*\n* Foo\n* Bar\n*/`);
  });
});
