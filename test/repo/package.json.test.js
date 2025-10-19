import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { mainTestFn, test } from "@compas/cli";

const require = createRequire(import.meta.url);

mainTestFn(import.meta);

test("repo/package.json - imports", (t) => {
  for (let pkg of readdirSync("./packages", {
    encoding: "utf-8",
  })) {
    if (pkg !== "compas") {
      pkg = `@compas/${pkg}`;
    }

    const result = require(`${pkg}/package.json`);
    t.equal(result.name, pkg, pkg);
    t.equal(result.exports?.["./package.json"], "./package.json", pkg);
  }

  t.pass();
});
