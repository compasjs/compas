const base = require("@compas/lint-config");

base.root = true;

base.globals.Blob = "readonly";
base.ignorePatterns = base.ignorePatterns || [];
base.ignorePatterns.push("*.ts");

module.exports = base;
