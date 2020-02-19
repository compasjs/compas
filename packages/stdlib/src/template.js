const { isNil } = require("./lodash");

/**
 * Global context for template execution
 */
const templateContext = {
  isNil,
};

/**
 * Global store for all templates
 */
const templateStore = new Map();

/**
 * Simple template support
 * Unsafe for not trusted inputs
 * Inspired by:
 * https://johnresig.com/blog/javascript-micro-templating/
 * @param {string} name Name that is exposed in the template it self and to be used with
 *   the executeTemplate function
 * @param {string} str Template string
 * @param {Object} [opts={}]
 * @param {boolean} opts.debug Set to true to print context keys and input object before
 *   executing the template
 */
const compileTemplate = (name, str, opts = {}) => {
  if (isNil(name) || isNil(str)) {
    throw new TypeError("Both name and string are required");
  }

  const compiled = str
    .replace(/[\r\n\t]/g, " ")
    .split("{{")
    .join("\t")
    .replace(/((^|}})[^\t]*)'/g, "$1\r")
    .replace(/\t=(.*?)}}/g, "',$1,'")
    .split("\t")
    .join("');")
    .split("}}")
    .join("p.push('")
    .split("\r")
    .join("\\'");

  const debugString = opts.debug
    ? "console.dir({ contextKeys: Object.keys(_ctx), data: _it }, {colors: true, depth: null});"
    : "";

  templateStore.set(
    name,
    new Function(
      "_ctx",
      "_it",
      `
    const p = [];
    ${debugString}
    with (_ctx) { with (_it) {
    p.push('${compiled}');
    }}
    return p.join('');
  `,
    ),
  );
};

const getExecutionContext = () => {
  const result = {
    ...templateContext,
  };
  for (const [key, item] of templateStore.entries()) {
    result[key] = item.bind(undefined, result);
  }

  return result;
};

/**
 * Execute a template, template should be compiled using compileTemplate
 * @param name
 * @param data
 * @returns {string} The resulting string for executing the template
 */
const executeTemplate = (name, data) => {
  if (!templateStore.has(name)) {
    throw new Error(`Unknown template: ${name}`);
  }

  try {
    return templateStore
      .get(name)(getExecutionContext(), data)
      .trim();
  } catch (e) {
    const err = new Error(`Error while executing ${name} template`);
    err.originalErr = e;
    throw err;
  }
};

/**
 * Simply add an item to the Context dictionary, note name can overwrite or be
 * overwritten by a template or other context value
 * @param name
 * @param value
 */
const addToTemplateContext = (name, value) => {
  templateContext[name] = value;
};

module.exports = {
  addToTemplateContext,
  compileTemplate,
  executeTemplate,
};
