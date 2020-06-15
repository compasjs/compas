import { promises, readFileSync } from "fs";
import path from "path";
import { isNil } from "./lodash.js";
import {
  processDirectoryRecursive,
  processDirectoryRecursiveSync,
} from "./node.js";

const { readFile } = promises;

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
 * @param {TemplateContext} tc
 * @param {string} name
 * @param {string} str
 * @param {object} [opts={}]
 * @param {boolean} [opts.debug]
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
    err.templateName = name;
    err.compiled = compiled;
    throw err;
  }
}

/**
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

      const content = await readFile(file, "utf-8");
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

      const content = readFileSync(file, "utf-8");
      const name = path.parse(file).name;

      compileTemplate(tc, name, content);
    },
    opts,
  );
}

/**
 * @param {TemplateContext} tc
 * @param {string} name
 * @param {*} data
 * @returns {string}
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
