import { eventStart, eventStop } from "@compas/stdlib";
import { packages, symbols } from "./packages.js";

/**
 *
 * @param {InsightEvent} event
 * @param {DocParserCombinedBlocks} declarationsByPackage
 * @returns {Map<DocParserPackage, string>}
 */
export function convertDeclarationsToMarkdown(event, declarationsByPackage) {
  eventStart(event, "converter.declarationsToMarkdown");

  const result = new Map();

  for (const pkg of packages) {
    let pkgResult = `---
editLink: false
---


# @compas\\/${pkg}

::: v-pre

`;

    for (const symbol of symbols[pkg]) {
      const declaration = declarationsByPackage[pkg][symbol];
      if (!declaration) {
        continue;
      }

      switch (declaration.type) {
        case "functionDeclaration":
          pkgResult += formatFunctionDeclaration(declaration);
          break;
      }
    }

    pkgResult += "\n:::\n";
    pkgResult = pkgResult.replace(/(<)/g, "\\$1");

    result.set(pkg, pkgResult);
  }

  eventStop(event);

  return result;
}

/**
 * Format a function declaration block
 *
 * @param {DocParserFunctionDeclarationBlock} block
 * @returns {string}
 */
function formatFunctionDeclaration(block) {
  const [, subPath] = block.range.file.split(block.range.pkg);

  return `
## ${block.name}

_Available since ${block.availableSince}_

_function ${block.name}(${block.parsedType.params
    .map((it) => it.name + (it.type.isOptional ? "?" : ""))
    .join(", ")}): ${block.parsedType.returnType.value}_

${block.summary && block.summary.length > 0 ? `${block.summary}\n` : ""}

${block.description}

${block.parsedType.params.length > 0 ? `**Parameters**:` : ""}

${block.parsedType.params
  .map((it) => {
    return `- ${it.name} \`${it.type.value}${
      it.type.defaultValue
        ? `=${it.type.defaultValue}`
        : it.type.isOptional
        ? "?"
        : ""
    }\`${
      it.description && it.description.length > 0 ? `: ${it.description}` : ""
    }`;
  })
  .join("\n")}


_[source](https://github.com/compasjs/compas/blob/main/packages/${
    block.range.pkg
  }${subPath}#L${block.range.line})_


`;
}
