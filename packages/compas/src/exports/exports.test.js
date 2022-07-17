/* eslint-disable import/no-unresolved */
import { test, mainTestFn } from "compas/cli";

mainTestFn(import.meta);

test("compas/exports", async (t) => {
  await import("compas/code-gen");
  await import("compas/server");
  await import("compas/stdlib");
  await import("compas/store");
  t.pass();
});
