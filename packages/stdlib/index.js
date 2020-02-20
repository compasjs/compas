const { uuid } = require("./src/datatypes");
const { isNil, isPlainObject, merge } = require("./src/lodash");
const {
  exec,
  processDirectoryRecursive,
  processDirectoryRecursiveSync,
  spawn,
} = require("./src/node");
const {
  addToTemplateContext,
  compileTemplate,
  compileTemplateDirectory,
  executeTemplate,
} = require("./src/template");
const { getSecondsSinceEpoch, gc } = require("./src/utils");

module.exports = {
  addToTemplateContext,
  compileTemplate,
  compileTemplateDirectory,
  exec,
  executeTemplate,
  getSecondsSinceEpoch,
  gc,
  isNil,
  isPlainObject,
  merge,
  processDirectoryRecursive,
  processDirectoryRecursiveSync,
  spawn,
  uuid,
};
