// import { existsSync, rmdirSync, readFileSync, writeFileSync } from "fs";
// import { exec, pathJoin } from "@lbu/stdlib";
// import { mainTestFn, test } from "../index.js";
//
// mainTestFn(import.meta);
//
// test("cli/template", async (t) => {
//   const templateDir = pathJoin(process.cwd(), "packages/cli/template");
//   const packageJsonPath = pathJoin(templateDir, "package.json");
//   const packageJsonSource = readFileSync(packageJsonPath, "utf-8");
//   const baseCommand = `node ../src/cli.js`;
//
//   t.test("reset package.json", () => {
//     writeFileSync(
//       packageJsonPath,
//       `{"name": "test", "type": "module"}`,
//       "utf-8",
//     );
//   });
//
//   t.test("generate command", async (t) => {
//     const { exitCode, stdout, stderr } = await exec(`${baseCommand} generate`, {
//       cwd: templateDir,
//     });
//
//     if (exitCode !== 0) {
//       t.fail("lbu generate failed");
//       t.log.error({
//         stdout,
//         stderr,
//       });
//     }
//   });
//
//   t.test("src/generated directory exists", (t) => {
//     t.ok(existsSync(pathJoin(templateDir, "src/generated")));
//     t.ok(existsSync(pathJoin(templateDir, "src/generated/router.js")));
//   });
//
//   t.test("tests", async (t) => {
//     const { exitCode, stdout, stderr } = await exec(`${baseCommand} test`, {
//       cwd: templateDir,
//     });
//
//     if (exitCode !== 0) {
//       t.fail("lbu test failed");
//
//       t.log.error({
//         stdout,
//         stderr,
//       });
//     }
//   });
//
//   t.test("cleanup", () => {
//     writeFileSync(packageJsonPath, packageJsonSource, "utf-8");
//     rmdirSync(pathJoin(templateDir, "src/generated"), { recursive: true });
//   });
// });
