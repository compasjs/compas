import { isNil, isPlainObject } from "@compas/stdlib";
import { collectScripts } from "./utils.js";
import { mainTestFn, test } from "@compas/cli";

mainTestFn(import.meta);

test("cli/utils", (t) => {
  t.test("collectScripts builds an object", (t) => {
    const result = collectScripts();

    t.ok(isPlainObject(result));
  });

  t.test("collectScripts contains scripts", (t) => {
    const result = collectScripts();

    t.ok(!isNil(result["changelog"]));
    t.equal(result["changelog"].type, "user");
  });

  t.test("collectScripts contains package.json scripts", (t) => {
    const result = collectScripts();

    t.ok(!isNil(result["docs:dev"]));
    t.equal(result["docs:dev"].type, "package");
  });
});
