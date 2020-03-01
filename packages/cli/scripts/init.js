import { dirnameForModule, mainFn, spawn } from "@lbu/stdlib";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { cliLogger } from "../index.js";

const { version } = JSON.parse(
  readFileSync(join(dirnameForModule(import.meta), "../package.json"), "utf-8"),
);

const copyDirRecursive = (source, target, contentHandler) => {
  const stat = lstatSync(source);
  if (stat.isDirectory()) {
    if (!existsSync(target)) {
      mkdirSync(target, { recursive: true });
    }

    const files = readdirSync(source);
    for (const file of files) {
      copyDirRecursive(join(source, file), join(target, file), contentHandler);
    }
  } else if (stat.isFile()) {
    const src = readFileSync(source, "utf-8");
    writeFileSync(target, contentHandler(src), {
      encoding: "utf-8",
    });
  }
};

mainFn(import.meta, cliLogger, async () => {
  const outDir = process.cwd();
  const projectName = outDir.substring(outDir.lastIndexOf("/") + 1);

  copyDirRecursive(
    join(dirnameForModule(import.meta), "../template"),
    outDir,
    input =>
      input.replace(/{{name}}/g, projectName).replace(/{{version}}/g, version),
  );

  await spawn(`yarn`, []);
  await spawn(`yarn`, [`lbu`, `lint`]);
});
