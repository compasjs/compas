import { promises, readFileSync } from "fs";
import path from "path";
import { isNil } from "./lodash.js";
import {
  processDirectoryRecursive,
  processDirectoryRecursiveSync,
} from "./node.js";

const { readFile } = promises;

/**
 * @name TemplateContext
 *
 * @typedef {object}
 * @property {object<string, Function>} globals
 * @property {Map<string, Function>} templates
 * @property {boolean} strict
 */

/**
 * @returns {TemplateContext}
 */
export function newTemplateContext() {
  return {
    globals: {
      isNil,
    },
    templates: new Map(),
    strict: true,
  };
}

/**
 * Compile templates add to TemplateContext
 * Unsafe for untrusted inputs
 * Fields need to be explicitly set to undefined or access them via `it.field`
 * Other known templates and globals will be available when executing
 * Inspired by: https://johnresig.com/blog/javascript-micro-templating/
 *
 * @param {TemplateContext} tc
 * @param {string} name Name that is exposed in the template it self and to be used with
 *   the executeTemplate function
 * @param {string} str Template string
 * @param {object} [opts={}]
 * @param {boolean} [opts.debug] Set to true to print context keys and input object before
 *   executing the template
 */
export function compileTemplate(tc, name, str, opts = {}) {
  if (isNil(tc)) {
    throw new TypeError(
      "TemplateContext is required, please create a new one with `newTemplateContext()`",
    );
  }

  if (isNil(name) || isNil(str)) {
    throw new TypeError("Both name and string are required");
  }

  if (tc.strict && tc.templates.has(name)) {
    throw new TypeError(`Template with name ${name} already registered`);
  }

  const compiled = str
    .split("\n")
    .map((it) => {
      const cleaned = it.replace(/[\r\n\t]/g, " ");
      const markStarts = cleaned.split("{{").join("\t");
      const evaluate = markStarts
        .replace(/((^|}})[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)}}/g, "',$1,'");

      // Syntax fixes, e.g start new push when necessary
      return evaluate
        .split("\t")
        .join("');")
        .split("}}")
        .join("p.push('")
        .split("\r")
        .join("\\'");
    })
    .join("\\n");

  const debugString = opts.debug
    ? "console.dir({ contextKeys: Object.keys(_ctx), data: it }, {colors: true, depth: null});"
    : "";

  try {
    tc.templates.set(
      name,
      new Function(
        "_ctx",
        "it",
        `
    const p = [];
    ${debugString}
    with (_ctx) { with (it) {
    p.push('${compiled}');
    }}
    
    return p.join('')
      .replace(/[ \\t\\r]+/g, ' ') // Replace all multiple spaces, with a single
      .replace(/^[ \\t\\r]+/gm, '') // Replace spaces at start of sentence with nothing
      .replace(/^(\\s*\\r?\\n){1,}/gm, '\\n') // Replace multiple new lines
      .replace(/^\\s*\\*\\s*([^\\n\\/\\*]+)\\s*\\n+/gm, ' * $1\\n ') // replace empty lines in JSDoc
      .replace(/\\n\\n/gm, '\\n') // Remove empty lines
      .replace(/\\(\\(newline\\)\\)/g, '\\n\\n'); // Controlled newlines 
  `,
      ),
    );
  } catch (e) {
    const err = new Error(`Error while compiling ${name} template`);
    err.originalErr = e;
    throw err;
  }
}

/**
 * Compile all templates found in the provided directory with the provided extension
 *
 * @param {TemplateContext} tc
 * @param {string} dir
 * @param {string} extension
 * @param {ProcessDirectoryOptions} [opts]
 * @returns {Promise<void>}
 */
export function compileTemplateDirectory(tc, dir, extension, opts) {
  if (isNil(tc)) {
    throw new TypeError(
      "TemplateContext is required, please create a new one with `newTemplateContext()`",
    );
  }

  const ext = extension[0] !== "." ? `.${extension}` : extension;
  return processDirectoryRecursive(
    dir,
    async (file) => {
      if (!file.endsWith(ext)) {
        return;
      }

      const content = await readFile(file, { encoding: "utf-8" });
      const name = path.parse(file).name;

      compileTemplate(tc, name, content);
    },
    opts,
  );
}

/**
 * Sync version of compileTemplateDirectory
 *
 * @param {TemplateContext} tc
 * @param {string} dir
 * @param {string} extension
 * @param {ProcessDirectoryOptions} [opts]
 * @returns {void}
 */
export function compileTemplateDirectorySync(tc, dir, extension, opts) {
  if (isNil(tc)) {
    throw new TypeError(
      "TemplateContext is required, please create a new one with `newTemplateContext()`",
    );
  }

  const ext = extension[0] !== "." ? `.${extension}` : extension;
  return processDirectoryRecursiveSync(
    dir,
    async (file) => {
      if (!file.endsWith(ext)) {
        return;
      }

      const content = readFileSync(file, { encoding: "utf-8" });
      const name = path.parse(file).name;

      compileTemplate(tc, name, content);
    },
    opts,
  );
}

/**
 * Execute a template, template should be compiled using compileTemplate
 *
 * @param {TemplateContext} tc
 * @param {string} name
 * @param {*} data
 * @returns {string} The resulting string for executing the template
 */
export function executeTemplate(tc, name, data) {
  if (isNil(tc)) {
    throw new TypeError(
      "TemplateContext is required, please create a new one with `newTemplateContext()`",
    );
  }

  if (!tc.templates.has(name)) {
    throw new Error(`Unknown template: ${name}`);
  }

  try {
    return tc.templates.get(name)(getExecutionContext(tc), data).trim();
  } catch (e) {
    const err = new Error(`Error while executing ${name} template`);
    err.originalErr = e;
    throw err;
  }
}

/**
 * Combine globals and registered templates into a single object
 *
 * @param {TemplateContext} tc
 */
function getExecutionContext(tc) {
  const result = {
    ...tc.globals,
  };
  for (const [key, item] of tc.templates.entries()) {
    result[key] = item.bind(undefined, result);
  }

  return result;
}
