import { AppError } from "@compas/stdlib";
import { structureTraverseDepthFirst } from "../structure/structureTraverseDepthFirst.js";

/**
 * Escape special chars and normalize indentation.
 *
 * @param {import("../generated/common/types.js").CodeGenContext} context
 */
export function formatDocStringsOfTypes(context) {
  structureTraverseDepthFirst(context.structure, (type) => {
    if ("docString" in type && type.docString) {
      const src = (type.docString ?? "").replace(/([*\\])/gm, (v) => `\\${v}`);

      type.docString = normalizeIndentationAndTrim(src);
    }
  });
}

/**
 * Trim single line strings;
 * For multiline strings, all ends are trimmed, and if the first line with characters
 * starts with whitespace, all matching whitespace from the following lines is trimmed as
 * well.
 *
 * @param {string} input
 * @returns {string}
 */
export function normalizeIndentationAndTrim(input) {
  if (!input.includes("\n")) {
    return input.trim();
  }

  const lines = input.split("\n");
  const indentOfFirstLine =
    (lines[0].trim().length === 0 ? lines[1] : lines[0]).match(/^ +/g)?.[0] ??
    "";

  const re = new RegExp(`^${indentOfFirstLine}`, "gm");

  let linesAreEmptyOrHaveSameIndent = true;
  for (const line of lines) {
    if (!line.startsWith(indentOfFirstLine) && line.trim().length !== 0) {
      linesAreEmptyOrHaveSameIndent = false;
      break;
    }
  }

  return lines
    .map((it) => {
      if (indentOfFirstLine.length === 0 || !linesAreEmptyOrHaveSameIndent) {
        return it.trimEnd();
      }

      return it.replace(re, "").trimEnd();
    })
    .join("\n")
    .trim();
}

/**
 * Format doc string using one of the supported comment formats
 *
 * @param {string} str
 * @param {{
 *   format: "jsdoc"|"endOfLine"|"partialLine",
 *   indentSize?: number,
 * }} options
 */
export function formatDocString(str, { format, indentSize }) {
  const indent = " ".repeat(indentSize ?? 0);

  if (format === "jsdoc") {
    const lines = str.split("\n");

    return lines.map((it) => `${indent} * ${it}`).join("\n");
  } else if (format === "endOfLine") {
    const lines = str.split("\n");

    return lines.map((it) => `${indent}// ${it}`).join("\n");
  } else if (format === "partialLine") {
    if (str.includes("\n")) {
      const lines = str.split("\n");

      return `${indent}/*\n${lines
        .map((it) => indent + it)
        .join("\n")}\n${indent} */`;
    }
    return `${indent}/* ${str} */`;
  }

  throw AppError.serverError({
    message: "Unknown 'formatDocString' format",
    format,
  });
}
