const { executeTemplate } = require("@lbu/stdlib");
const { addToTemplateContext } = require("@lbu/stdlib");
const { compileTemplate } = require("@lbu/stdlib");

const init = () => {
  compileTemplates({
    debug: false,
  });
};

const run = ({ outputDir, data: { validators } }) => {
  const result = [
    executeTemplate("validatorImports", {}),
    executeTemplate("ValidationErrorClass", {}),
    executeTemplate("validatorHooks", {}),
  ];

  for (const v of validators) {
    result.push(executeTemplate("namedValidatorFn", v));
  }

  result.push(executeTemplate("validatorExports", { validators }));

  console.log(result.join("\n"));

  console.log("Skipping writing", { outputDir });
};

const getPlugin = () => ({
  name: "validators",
  run,
  init,
});

module.exports = {
  getPlugin,
};

function compileTemplates(opts) {
  addToTemplateContext("quote", it => `"${it}"`);
  addToTemplateContext("singleQuote", it => `'${it}'`);

  compileErrorTemplates(opts);

  compileTemplate(
    "validatorHooks",
    `
const validatorHooks = {};
`,
    opts,
  );

  compileTemplate(
    "validatorImports",
    `
const { isNil } = require("@lbu/stdlib");
`,
    opts,
  );

  compileTemplate(
    "validatorExports",
    `
module.exports = {
  ValidationError,
  validatorHooks,
  {{ for (const v of validators) { }}
  {{= v.validatorName }},
  {{ } }}
};
`,
    opts,
  );

  compileTemplate(
    "namedValidatorFn",
    `
{{= anonValidatorFn(validator) }}
    
/**
 * {{= validatorName }}
 * @param {*} value
 */
const {{= validatorName }} = value => {
 let result = value;
 
 {{ const preValidate = quote(preValidateHook); }}
 {{ const postValidate = quote(postValidateHook); }}
 if ({{= preValidate }} in validatorHooks) {
    result = validatorHooks[{{= preValidate }}](result);
 }
 
 result = {{= validator.functionName }}(result, "$");
 
 if ({{= postValidate }} in validatorHooks) {
    return validatorHooks[{{= postValidate }}](result);
 } else {
   return result;
 }
};
`,
    opts,
  );

  compileTemplate(
    "anonValidatorFn",
    `
{{ if (type === "boolean") { }}
{{= booleanValidatorFn(it) }}
{{ } else if (type === "number") { }}
{{= numberValidatorFn(it) }}
{{ } else if (type === "string") { }}
{{= stringValidatorFn(it) }}
{{ } else if (type === "object") { }}
{{= objectValidatorFn(it) }}
{{ } else if (type === "array") { }}
{{= arrayValidatorFn(it) }}
{{ } else if (type === "anyOf") { }}
{{= anyOfValidatorFn(it) }}
{{ } else if (type === "reference") { }}
{{= referenceValidatorFn(it) }}
{{ } }}
`,
    opts,
  );

  // Note oneOf in boolean is either undefined, true or false and not an array
  compileTemplate(
    "booleanValidatorFn",
    `
const {{= functionName }} = (value, propertyPath) => {
  if (isNil(value)) {
    {{ if (it.optional) { }}
      return undefined;
    {{ } else { }}
      {{= buildError("boolean.undefined") }}
    {{ } }}
  }
  
  {{ if (it.convert) { }}
  if (typeof value !== "boolean") {
    if (value === "true" || value === 1) {
      value = true;
    } else if (value === "false" || value === 0) {
      value = false;
    }
  }
  {{ } }}
  
  if (typeof value !== "boolean") {
    {{= buildError("boolean.type") }}
  }
  
  {{ if (it.oneOf !== undefined) { }}
  if (value !== {{= oneOf }}) {
    const oneOf = {{= oneOf }};
    {{= buildError("boolean.oneOf") }}
  }
  {{ } }}
  
  return value;
};
`,
    opts,
  );

  compileTemplate(
    "numberValidatorFn",
    `
const {{= functionName }} = (value, propertyPath) => {
  if (isNil(value)) {
    {{ if (it.optional) { }}
      return undefined;
    {{ } else { }}
      {{= buildError("number.undefined") }}
    {{ } }}
  }
  
  {{ if (it.convert) { }}
  if (typeof value !== "number") {
    value = Number(value)
  }
  {{ } }}
  
  if (typeof value !== "number" || isNaN(value) || !isFinite(value)) {
    {{= buildError("number.type") }}
  }
  
  {{ if (it.integer) { }}
  if (!Number.isInteger(value)) {
    {{= buildError("number.integer") }}
  }
  {{ } }}
  
  {{ if (it.min !== undefined) { }}
  if (value < {{= min }}) {
    const min = {{= min }};
    {{= buildError("number.min") }}
  }
  {{ } }}

  {{ if (it.max !== undefined) { }}
  if (value > {{= max }}) {
    const max = {{= max }};
    {{= buildError("number.max") }}
  }
  {{ } }}
  
  {{ if (it.oneOf !== undefined) { }}
  if ({{= oneOf.map(it => "value !== " + it).join(" && ") }}) {
    const oneOf = {{= quote(oneOf.join(", ")) }};
    {{= buildError("number.oneOf") }}
  }
  {{ } }}
  
  return value;
};
`,
    opts,
  );

  compileTemplate(
    "stringValidatorFn",
    `
const {{= functionName }} = (value, propertyPath) => {
  if (isNil(value)) {
    {{ if (it.optional) { }}
      return undefined;
    {{ } else { }}
      {{= buildError("string.undefined") }}
    {{ } }}
  }
  
  {{ if (it.convert) { }}
  if (typeof value !== "string") {
    value = String(value)
  }
  {{ } }}
  
  if (typeof value !== "string") {
    {{= buildError("string.type") }}
  }
  
  {{ if (it.trim) { }}
  value = value.trim();
  {{ } }}
  
  {{ if (it.min !== undefined) { }}
  if (value.length < {{= min }}) {
    const min = {{= min }};
    {{= buildError("string.min") }}
  }
  {{ } }}

  {{ if (it.max !== undefined) { }}
  if (value.length > {{= max }}) {
    const max = {{= max }};
    {{= buildError("string.max") }}
  }
  {{ } }}
  
  {{ if (it.upperCase) { }}
  value = value.toUpperCase();
  {{ } }}
  
  {{ if (it.lowerCase) { }}
  value = value.toLowerCase();
  {{ } }}
  
  {{ if (it.oneOf !== undefined) { }}
  if ({{= oneOf.map(it => "value !== \\"" + it + "\\"").join(" && ") }}) {
    const oneOf = {{= quote(oneOf.join(", ")) }};
    {{= buildError("string.oneOf") }}
  }
  {{ } }}
  
  {{ if (it.pattern !== undefined) { }}
  {{ const patternSrc = "/" + pattern.source + "/" + pattern.flags; }}
  if (!{{= patternSrc }}.test(value)) {
    {{= buildError("string.pattern") }}
  }
  {{ } }}
  
  return value;
};
`,
    opts,
  );

  compileTemplate(
    "objectValidatorFn",
    `
{{ for (const key of Object.keys(keys)) { }}
{{= anonValidatorFn(keys[key]) }}
{{ } }}

const {{= functionName }} = (value, propertyPath) => {
  if (isNil(value)) {
    {{ if (it.optional) { }}
      return undefined;
    {{ } else { }}
      {{= buildError("object.undefined") }}
    {{ } }}
  }
  
  if (typeof value !== "object") {
    {{= buildError("object.type") }}
  }
  const result = {};
  
  {{ if (it.strict) { }}
  const keySet = new Set(Object.keys(value));
  {{ } }}
  
  {{ for (const key of Object.keys(keys)) { }}
    result[{{= quote(key) }}] = {{= keys[key].functionName }}(value[{{= quote(key) }}], propertyPath + "." + {{= quote(key) }});
    
    {{ if (it.strict) { }}
    keySet.delete({{= quote(key) }});
    {{ } }}
  {{ } }}
  
  {{ if (it.strict) { }}
  if (keySet.size !== 0) {
    let extraKeys = "";
    for (const k of keySet.keys()) { extraKeys += k + ","; }
    {{= buildError("object.strict") }}
  }
  {{ } }}
  
  return result;
};
`,
    opts,
  );

  compileTemplate(
    "arrayValidatorFn",
    `
{{= anonValidatorFn(values) }}

const {{= functionName }} = (value, propertyPath) => {
  if (isNil(value)) {
    {{ if (it.optional) { }}
      return undefined;
    {{ } else { }}
      {{= buildError("array.undefined") }}
    {{ } }}
  }
  
  {{ if (it.convert) { }}
  if (!Array.isArray(value) {
    value = [value];
  }
  {{ } }}
  
  if (!Array.isArray(value)) {
    {{= buildError("array.type") }}
  }
  
  {{ if (it.min !== undefined) { }}
  if (value.length < min) {
    const min = {{= quote(min) }};
    {{= buildError("array.min") }}
  }
  {{ } }}
  
  {{ if (it.max !== undefined) { }}
  if (value.length > max) {
    const max = {{= quote(max) }};
    {{= buildError("array.max") }}
  }
  {{ } }}
  
  const result = [];
  
  for (let i = 0; i < value.length; ++i) {
    result.push({{= values.functionName }}(value[i], propertyPath + "[" + i + "]"));
  }
  
  return result;
};
`,
    opts,
  );

  compileTemplate(
    "anyOfValidatorFn",
    `
{{ for (const v of it.values) { }}
{{= anonValidatorFn(v) }}
{{ } }}

const {{= functionName }} = (value, propertyPath) => {
  if (isNil(value)) {
    {{ if (it.optional) { }}
      return undefined;
    {{ } else { }}
      {{= buildError("anyOf.undefined") }}
    {{ } }}
  }
  
  const errors = [];
  {{ for (const v of values) { }}
  try {
    return {{= v.functionName }}(value, propertyPath);
  } catch (e) {
    errors.push(e);
  }
  {{ } }}
  
  const stringErrors = errors.map(it => it.message);
  {{= buildError("anyOf.type") }}
};
`,
    opts,
  );

  compileTemplate(
    "referenceValidatorFn",
    `

const {{= functionName }} = (value, propertyPath) => {
  if (isNil(value)) {
    {{ if (it.optional) { }}
      return undefined;
    {{ } else { }}
      {{= buildError("reference.undefined") }}
    {{ } }}
  }
  
  return {{= reference }}(value, propertyPath);
};
`,
    opts,
  );
}

function compileErrorTemplates(opts) {
  compileTemplate(
    "ValidationErrorClass",
    `
class ValidationError extends Error {
  static isValidationError(err) {
    return err.name === "ValidationError";
  }

  constructor(key: string, message: string) {
    super(message);

    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = this.constructor.name;
    this.key = key;
  }
}
`,
    opts,
  );

  // Note when using variables, you have to bring them in scope your self
  const errors = {
    /**
     * BOOLEAN
     */
    "boolean.undefined": "Expected '${propertyPath}' to be a boolean",
    "boolean.type": "Expected '${propertyPath}' to be a boolean",
    "boolean.oneOf": "Expected '${propertyPath}' to be '${oneOf}'",
    /**
     * NUMBER
     */
    "number.undefined": "Expected '${propertyPath}' to be a number",
    "number.type": "Expected '${propertyPath}' to be a number",
    "number.integer": "Expected '${propertyPath}' to be an integer",
    "number.min": "Expected '${propertyPath}' to be greater than '${min}'",
    "number.max": "Expected '${propertyPath}' to be smaller than '${max}'",
    "number.oneOf": "Expected '${propertyPath}' to be one of: '${oneOf}'",
    /**
     * STRING
     */
    "string.undefined": "Expected '${propertyPath}' to be a string",
    "string.type": "Expected '${propertyPath}' to be a string",
    "string.oneOf": "Expected '${propertyPath}' to be one of: '${oneOf}'",
    "string.min":
      "Expected '${propertyPath}' length to be greater than '${min}'",
    "string.max":
      "Expected '${propertyPath}' length to be smaller than '${max}'",
    "string.pattern": "Expected '${propertyPath}' to match pattern",
    /**
     * OBJECT
     */
    "object.undefined": "Expected '${propertyPath}' to be an object",
    "object.type": "Expected '${propertyPath}' to be an object",
    "object.strict":
      "Object at '${propertyPath}' has too many keys: [${extraKeys}]",
    /**
     * ARRAY
     */
    "array.undefined": "Expected '${propertyPath}' to be an array",
    "array.type": "Expected '${propertyPath}' to be an array",
    "array.min": "Expected '${propertyPath}' to be longer than '${min}'",
    "array.max": "Expected '${propertyPath}' to be shorter than '${max}'",
    /**
     * ANY OF
     */
    "anyOf.undefined": "Expected '${propertyPath}' to have a value",
    "anyOf.type": "'${stringErrors.join(\"' OR '\")}'",
    /**
     * REFERENCE
     */
    "reference.undefined": "Expected '${propertyPath}' to be defined",
  };

  addToTemplateContext("buildError", errorName => {
    if (!errors[errorName]) {
      throw new Error(`Missing ${errorName} in defined errors.`);
    }

    return (
      "throw new ValidationError(`" +
      errorName +
      "`, `" +
      errors[errorName] +
      "`);"
    );
  });
}
