const { uuid } = require("./src/datatypes");
const { isNil, isPlainObject, merge } = require("./src/lodash");
const { exec, spawn } = require("./src/node");
const {
  addToTemplateContext,
  compileTemplate,
  executeTemplate,
} = require("./src/template");
const { getSecondsSinceEpoch, gc } = require("./src/utils");

module.exports = {
  addToTemplateContext,
  compileTemplate,
  exec,
  executeTemplate,
  getSecondsSinceEpoch,
  gc,
  isNil,
  isPlainObject,
  merge,
  spawn,
  uuid,
};
