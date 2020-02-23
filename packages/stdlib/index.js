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
const { getSecondsSinceEpoch, gc, mainFn } = require("./src/utils");

module.exports = {
  addToTemplateContext,
  compileTemplate,
  compileTemplateDirectory,
  executeTemplate,

  exec,
  spawn,

  processDirectoryRecursive,
  processDirectoryRecursiveSync,

  isNil,
  isPlainObject,
  merge,

  getSecondsSinceEpoch,
  gc,
  mainFn,
  uuid,
};
