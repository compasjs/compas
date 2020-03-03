import { M } from "../model/index.js";

const validatorDefaults = {
  boolean: {
    convert: false,
  },
  number: {
    convert: false,
    integer: false,
    min: undefined,
    max: undefined,
  },
  string: {
    convert: false,
    trim: false,
    lowerCase: false,
    upperCase: false,
    min: undefined,
    max: undefined,
    pattern: undefined,
  },
  object: {
    strict: false,
  },
  array: {
    convert: false,
    min: undefined,
    max: undefined,
  },
  anyOf: {},
  reference: {},
};

/**
 * Add the default validator object for the appropriate Lbu Type
 */
const checkHasValidatorObject = instance => {
  if (!instance.item.validator) {
    instance.item.validator = validatorDefaults[instance.item.type];
  }
};

/**
 * @name LbuBool#convert
 * @function
 * @return {LbuBool}
 */
M.types.LbuBool.prototype.convert = function() {
  checkHasValidatorObject(this);
  this.item.validator.convert = true;

  return this;
};

/**
 * @name LbuNumber#convert
 * @function
 * @return {LbuNumber}
 */
M.types.LbuNumber.prototype.convert = function() {
  checkHasValidatorObject(this);
  this.item.validator.convert = true;

  return this;
};

/**
 * @name LbuNumber#integer
 * @function
 * @return {LbuNumber}
 */
M.types.LbuNumber.prototype.integer = function() {
  checkHasValidatorObject(this);
  this.item.validator.integer = true;

  return this;
};

/**
 * @name LbuNumber#min
 * @function
 * @param {number} min
 * @return {LbuNumber}
 */
M.types.LbuNumber.prototype.min = function(min) {
  checkHasValidatorObject(this);
  this.item.validator.min = min;

  return this;
};

/**
 * @name LbuNumber#max
 * @function
 * @param {number} max
 * @return {LbuNumber}
 */
M.types.LbuNumber.prototype.max = function(max) {
  checkHasValidatorObject(this);
  this.item.validator.max = max;

  return this;
};

/**
 * @name LbuString#convert
 * @function
 * @return {LbuString}
 */
M.types.LbuString.prototype.convert = function() {
  checkHasValidatorObject(this);
  this.item.validator.convert = true;

  return this;
};

/**
 * @name LbuString#trim
 * @function
 * @return {LbuString}
 */
M.types.LbuString.prototype.trim = function() {
  checkHasValidatorObject(this);
  this.item.validator.trim = true;

  return this;
};

/**
 * @name LbuString#upperCase
 * @function
 * @return {LbuString}
 */
M.types.LbuString.prototype.upperCase = function() {
  checkHasValidatorObject(this);
  this.item.validator.upperCase = true;

  return this;
};

/**
 * @name LbuString#lowerCase
 * @function
 * @return {LbuString}
 */
M.types.LbuString.prototype.lowerCase = function() {
  checkHasValidatorObject(this);
  this.item.validator.lowerCase = true;

  return this;
};

/**
 * @name LbuString#min
 * @function
 * @param {number} min
 * @return {LbuString}
 */
M.types.LbuString.prototype.min = function(min) {
  checkHasValidatorObject(this);
  this.item.validator.min = min;

  return this;
};

/**
 * @name LbuString#max
 * @function
 * @param {number} max
 * @return {LbuString}
 */
M.types.LbuString.prototype.max = function(max) {
  checkHasValidatorObject(this);
  this.item.validator.max = max;

  return this;
};

/**
 * @name LbuString#pattern
 * @function
 * @param {RegExp} pattern
 * @return {LbuString}
 */
M.types.LbuString.prototype.pattern = function(pattern) {
  checkHasValidatorObject(this);
  this.item.validator.pattern = pattern;

  return this;
};

/**
 * @name LbuObject#strict
 * @function
 * @return {LbuObject}
 */
M.types.LbuObject.prototype.strict = function() {
  checkHasValidatorObject(this);
  this.item.validator.strict = true;

  return this;
};

/**
 * @name LbuArray#convert
 * @function
 * @return {LbuArray}
 */
M.types.LbuArray.prototype.convert = function() {
  checkHasValidatorObject(this);
  this.item.validator.convert = true;

  return this;
};

/**
 * @name LbuArray#min
 * @function
 * @param {number} min
 * @return {LbuArray}
 */
M.types.LbuArray.prototype.min = function(min) {
  checkHasValidatorObject(this);
  this.item.validator.min = min;

  return this;
};

/**
 * @name LbuArray#max
 * @function
 * @param {number} max
 * @return {LbuArray}
 */
M.types.LbuArray.prototype.max = function(max) {
  checkHasValidatorObject(this);
  this.item.validator.max = max;

  return this;
};
