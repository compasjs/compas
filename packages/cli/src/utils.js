const { existsSync, readdirSync } = require("fs");
const { join } = require("path");

const getKnownScripts = () => {
  const result = {};

  const userDir = join(process.cwd(), "scripts");
  if (existsSync(userDir)) {
    for (const item of readdirSync(userDir)) {
      const name = item.split(".")[0];

      result[name] = {
        type: "USER",
        path: join(userDir, item),
      };
    }
  }

  const pkgJsonPath = join(process.cwd(), "package.json");
  if (existsSync(pkgJsonPath)) {
    const pkgJson = require(pkgJsonPath);
    for (const item of Object.keys(pkgJson.scripts || {})) {
      result[item] = { type: "YARN", script: pkgJson.scripts[item] };
    }
  }

  const cliDir = join(__dirname, "../scripts");
  for (const item of readdirSync(cliDir)) {
    const name = item.split(".")[0];

    result[name] = {
      type: "CLI",
      path: join(cliDir, item),
    };
  }

  return result;
};

module.exports = {
  getKnownScripts,
};
