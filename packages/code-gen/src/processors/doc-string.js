import { structureNamedTypes } from "./structure.js";
import { typeDefinitionTraverse } from "./type-definition-traverse.js";

/**
 * Escape `\` and `*` characters in doc strings. Also removes the indentation if it
 * exists on all lines in the input.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function docStringCleanup(generateContext) {
  for (const namedType of structureNamedTypes(generateContext.structure)) {
    typeDefinitionTraverse(
      namedType,
      (type, callback) => {
        if ("docString" in type && type.docString) {
          const src = (type.docString ?? "").replace(
            /([*\\])/gm,
            (v) => `\\${v}`,
          );

          type.docString = normalizeIndentationAndTrim(src);

          callback(type);
        }
      },
      {
        assignResult: false,
        isInitialType: true,
      },
    );
  }
}

/**
 * Each line is trimmed.
 *
 * If the input is multiline, only the shared amount of space that prepends each line is
 * trimmed.
 *
 * @param {string} input
 * @returns {string}
 */
function normalizeIndentationAndTrim(input) {
  if (!input.includes("\n")) {
    return input.trim();
  }

  const lines = input.split("\n");

  // We expect that the first line with text has the base indentation.
  let indentOfFirstTextLine = "";
  for (const line of lines) {
    if (line.trim().length === 0) {
      continue;
    }

    indentOfFirstTextLine = line.match(/^ +/g)?.[0] ?? "";
    break;
  }

  let linesAreEmptyOrHaveSameIndent = true;
  for (const line of lines) {
    if (!line.startsWith(indentOfFirstTextLine) && line.trim().length !== 0) {
      linesAreEmptyOrHaveSameIndent = false;
      break;
    }
  }

  const re = new RegExp(`^${indentOfFirstTextLine}`, "");

  const cleanedLines = lines.map((it) => {
    if (indentOfFirstTextLine.length === 0 || !linesAreEmptyOrHaveSameIndent) {
      return it.trimEnd();
    }

    return it.replace(re, "").trimEnd();
  });

  if (cleanedLines[0].length === 0) {
    cleanedLines.shift();
  }

  if (cleanedLines.at(-1)?.length === 0) {
    cleanedLines.pop();
  }

  return cleanedLines.join("\n");
}
