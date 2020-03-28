import { promises } from "fs";
import path from "path";
import { isNil } from "./lodash.js";
import { processDirectoryRecursive } from "./node.js";

const { readFile } = promises;

/**
 * Global context for template execution
 */
const templateContext = {
  isNil,
  quote: (it) => `"${it}"`,
  singleQuote: (it) => `'${it}'`,
};

/**
 * Global store for all templates
 */
const templateStore = new Map();

/**
 * Simple template support
 * Unsafe for not trusted inputs
 * Fields need to be explicitly set to undefined or access them via `it.field`
 * Inspired by:
 * https://johnresig.com/blog/javascript-micro-templating/
 * @param {string} name Name that is exposed in the template it self and to be used with
 *   the executeTemplate function
 * @param {string} str Template string
 * @param {Object} [opts={}]
 * @param {boolean} opts.debug Set to true to print context keys and input object before
 *   executing the template
 */
export function compileTemplate(name, str, opts = {}) {
  if (isNil(name) || isNil(str)) {
    throw new TypeError("Both name and string are required");
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
    templateStore.set(
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
    
    let hasEmptyLine = false;
    return p.filter(it => {
      if (typeof it === "string" && it.trim() === "") {
        if (hasEmptyLine) {
          return false;
        } else {
          hasEmptyLine = true;
          return true;
        }
      } else {
        hasEmptyLine = false;
        return true;
      }
    }).join('');
  `,
      ),
    );
  } catch (e) {
    const err = new Error(`Error while compiling ${name} template`);
    err.originalErr = e;
    throw err;
  }
}

export function compileTemplateDirectory(dir, extension, opts) {
  const ext = extension[0] !== "." ? `.${extension}` : extension;
  return processDirectoryRecursive(dir, async (file) => {
    if (!file.endsWith(ext)) {
      return;
    }

    const content = await readFile(file, { encoding: "utf-8" });
    const name = path.parse(file).name;

    compileTemplate(name, content, opts);
  });
}

/**
 * Execute a template, template should be compiled using compileTemplate
 * @param name
 * @param data
 * @returns {string} The resulting string for executing the template
 */
export function executeTemplate(name, data) {
  if (!templateStore.has(name)) {
    throw new Error(`Unknown template: ${name}`);
  }

  try {
    return templateStore.get(name)(getExecutionContext(), data).trim();
  } catch (e) {
    const err = new Error(`Error while executing ${name} template`);
    err.originalErr = e;
    throw err;
  }
}

/**
 * Simply add an item to the Context dictionary, note name can overwrite or be
 * overwritten by a template or other context value
 * @param name
 * @param value
 */
export function addToTemplateContext(name, value) {
  templateContext[name] = value;
}

function getExecutionContext() {
  const result = {
    ...templateContext,
  };
  for (const [key, item] of templateStore.entries()) {
    result[key] = item.bind(undefined, result);
  }

  return result;
}
