const base = require("@compas/lint-config");

base.root = true;

base.ignorePatterns = base.ignorePatterns || [];
base.ignorePatterns.push("*.ts");

module.exports = base;
