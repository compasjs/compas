const base = require("@lbu/lint-config");

base.root = true;

base.ignorePatterns = base.ignorePatterns || [];
base.ignorePatterns.push("*.ts");

module.exports = base;
