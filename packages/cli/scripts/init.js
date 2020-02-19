const { spawn } = require("@lbu/stdlib");
const {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} = require("fs");
const { join } = require("path");
const { logger } = require("../src/logger");
const { mainFn } = require("../src/utils");

const { version } = require("../package");

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

mainFn(module, require, logger, async () => {
  const outDir = process.cwd();
  const projectName = outDir.substring(outDir.lastIndexOf("/") + 1);

  copyDirRecursive(join(__dirname, "../template"), outDir, input =>
    input.replace(/{{name}}/g, projectName).replace(/{{version}}/g, version),
  );

  await spawn(`yarn`, []);
  await spawn(`yarn`, [`lbu`, `lint`]);
});
