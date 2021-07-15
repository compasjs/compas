import { AppError, eventStart, eventStop, isNil } from "@compas/stdlib";
import { packages } from "./packages.js";

/**
 * @typedef {Object<DocParserPackage, { blocks: DocParserBlock[], }>}
 *    DocParserBlocksByPackage
 */

/**
 *
 * @param {InsightEvent} event
 * @param {DocParserCollectedFiles} filesByPackage
 * @param {DocParserParsedFileCollection} parsedByFile
 * @returns {DocParserBlocksByPackage}
 */
export function resolveJSDocCommentsByPackage(
  event,
  filesByPackage,
  parsedByFile,
) {
  eventStart(event, "jsdoc.resolveCommentsByPackage");
  const result = {};

  for (const pkg of packages) {
    /** @type {{ blocks: DocParserBlock[] }} */
    const packageResult = {
      blocks: [],
    };

    for (const file of filesByPackage[pkg]) {
      for (const comment of parsedByFile[file].comments) {
        if (!filterDocBlocks(comment)) {
          continue;
        }

        const docBlock = parseDocBlock(comment);

        if (!docBlock) {
          continue;
        }

        packageResult.blocks.push(docBlock);
      }
      result[pkg] = packageResult;
    }
  }

  eventStop(event);

  return result;
}

/**
 * Parse multiline comment
 *
 *
 * @param {DocParserJSComment} comment
 * @returns {DocParserBlock}
 */
export function parseDocBlock(comment) {
  // description runs till the first @
  const { description, descriptionLastIndex } = extractDescription(
    comment.value,
  );
  const rawTags = extractTags(comment.value, descriptionLastIndex ?? 0);

  if (rawTags.length === 0 && isNil(description)) {
    // Block is either empty or default to 'unknown' doc comment
    if (comment.value.replace(/\*/g, "").trim().length === 0) {
      return undefined;
    }
    return {
      type: "unknown",
      raw: comment.value,
      range: comment.range,
    };
  }

  let block;

  if (rawTags.find((it) => it.tag === "callback")) {
    // Needs a higher precendence than function declarations, but don't want to parse it yet.
    block = {
      type: "unknown",
      raw: comment.value,
    };
  } else if (rawTags.find((it) => it.tag === "returns" || it.tag === "param")) {
    block = extractFunctionDeclaration(description, rawTags);
  } else {
    block = {
      type: "unknown",
      raw: comment.value,
    };
  }

  block.range = comment.range;

  return block;
}

/**
 * Extract description out of the JSDoc, returns undefined if none existent.
 *
 * @param value
 * @returns {{
 *   description?: string,
 *   descriptionLastIndex: number
 * }}
 */
function extractDescription(value) {
  const lastIndex = value.indexOf("* @");
  const rawDescription = value.substring(
    0,
    lastIndex === -1 ? value.length : lastIndex,
  );
  const description = cleanupJSDocTagValueOrDescription(rawDescription, true);

  return {
    description: description.length > 0 ? description : undefined,
    descriptionLastIndex: description.length > 0 ? lastIndex : undefined,
  };
}

/**
 * Extract tags freely, supports new line continuation of tags
 *
 * @param {string} value
 * @param {number} index
 * @returns {{ tag: string, value: string }[]}
 */
function extractTags(value, index) {
  const result = [];
  const tagRegex = /@(\w+)\s/;

  while (index < value.length) {
    const startIdx = value.indexOf(" @", index + 1);
    if (startIdx === -1) {
      // No tags left
      break;
    }

    const idxNextTag = value.indexOf(" @", startIdx + 1);
    const fullTagRaw = value.substring(
      startIdx,
      idxNextTag === -1 ? undefined : idxNextTag,
    );

    // Reset regex state
    tagRegex.lastIndex = -1;
    const matchResult = tagRegex.exec(fullTagRaw);
    if (isNil(matchResult)) {
      // Unknown error
      break;
    }

    const rawTagValue = fullTagRaw.substring(matchResult[1].length + 2);
    const tagValue = cleanupJSDocTagValueOrDescription(rawTagValue);

    // Quick filter of tags that we are not handling right at this moment
    if (
      [
        "public",
        "private",
        "protected",
        "template",
        "return",
        "see",
        "class",
        "constructor",
      ].indexOf(matchResult[1]) === -1
    ) {
      result.push({
        tag: matchResult[1],
        value: tagValue,
      });
    }

    index = index + fullTagRaw.length;
  }

  return result;
}

/**
 * Extract all known tags for function declarations
 *
 * @param {string|undefined} description
 * @param {{ tag: string, value: string }[]} rawTags
 * @returns {DocParserFunctionDeclarationBlock}
 */
function extractFunctionDeclaration(description, rawTags) {
  /** @type {DocParserFunctionDeclarationBlock} */
  const result = {
    type: "functionDeclaration",
    name: undefined,
    summary: undefined,
    description,
    availableSince: undefined,
    isVariable: false,
    parsedType: {
      type: "function",
      params: [],
      returnType: {
        type: "literal",
        value: "void",
      },
    },
  };

  for (const tag of rawTags) {
    if (tag.tag === "param") {
      const { name, description, typeLiteral, isOptional, defaultValue } =
        extractTypeTagValue(tag.value);
      result.parsedType.params.push({
        name: name,
        description,
        type: {
          type: "literal",
          value: typeLiteral,
          isOptional,
          defaultValue,
        },
      });
    } else if (tag.tag === "returns") {
      const { typeLiteral } = extractTypeTagValue(tag.value);

      result.parsedType.returnType = {
        type: "literal",
        value: typeLiteral,
      };
    } else if (tag.tag === "function") {
      result.isVariable = true;
    } else if (tag.tag === "since") {
      result.availableSince = tag.value;
    } else if (tag.tag === "summary") {
      result.summary = tag.value;
    } else {
      throw AppError.validationError("functionDeclaration.unknownTag", {
        description,
        tag,
        rawTags,
      });
    }
  }

  return result;
}

/**
 * Handle multi line JSDoc values, cleans it up, removes unnecessary new lines and return
 * the string value
 *
 * @param {string} rawValue
 * @returns {string}
 */
function cleanupJSDocTagValueOrDescription(rawValue) {
  rawValue = rawValue.replace(/( \*|\* )/g, "").trim();
  if (rawValue.startsWith("*")) {
    rawValue = rawValue.substring(1).trim();
  }
  if (rawValue.endsWith("*")) {
    rawValue = rawValue.substring(0, rawValue.length - 1).trim();
  }

  const parts = rawValue.split("\n");

  let lastItemWasEmpty = false;
  let isInCodeBlock = false;
  let description = "";

  // Concatenate parts again, however we only use multiple new lines (ie multiple empty
  // parts) when concatenating
  for (const part of parts) {
    if (lastItemWasEmpty && part.trim() === "") {
      description += "\n\n";
    } else if (part.trim() === "") {
      lastItemWasEmpty = true;
    } else if (isInCodeBlock) {
      description += `\n${part}`;
    } else if (part.trim().startsWith("```")) {
      description += `\n${part}`;
      if (isInCodeBlock) {
        description += "\n";
      }
      isInCodeBlock = !isInCodeBlock;
    } else {
      description += ` ${part}`;
    }
  }

  return description.trim();
}

/**
 * Quick filter on doc blocks
 *
 * @param {DocParserJSComment} block
 * @returns {boolean}
 */
function filterDocBlocks(block) {
  return (
    block.type === "MultiLine" && block.value.indexOf("eslint-disable") === -1
  );
}

/**
 * Tries to extract type, name and comments from tags like @param
 *
 * @param {string} value
 * @returns {{
 *   name?: string,
 *   typeLiteral?: string,
 *   description?: string,
 *   defaultValue?: string,
 *   isOptional?: boolean,
 * }}
 */
function extractTypeTagValue(value) {
  const re = /^\s*({([\w\s<>,.{}?:|*]*)})?\s*(\[?([\w.]+)=?(.*?])?)?\s*(.*)$/gm;

  const result = re.exec(value);
  if (!result) {
    return {};
  }

  const defaultValue = (result[5] ?? "]")
    .substring(0, (result[5] ?? "]").length - 1)
    .trim();

  return {
    name: result[4] ?? value.trim(),
    typeLiteral: result[2] ?? value.trim(),
    description: cleanupJSDocTagValueOrDescription(result[6] ?? ""),
    isOptional: result[3] !== result[4],
    defaultValue: defaultValue.length > 0 ? defaultValue : undefined,
  };
}
