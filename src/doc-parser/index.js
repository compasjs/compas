import { writeFile } from "fs/promises";
import {
  eventStart,
  eventStop,
  newEvent,
  newEventFromEvent,
  pathJoin,
} from "@compas/stdlib";
import { combineCommentsWithDeclarations } from "./combiner.js";
import { convertDeclarationsToMarkdown } from "./converter.js";
import { resolveJSDocCommentsByPackage } from "./jsdoc.js";
import { packageListFiles, packageParseFiles, packages } from "./packages.js";

/**
 * JSDoc extractor
 *
 * Enforced rules:
 * - Description first
 *
 * - @returns over @return
 *
 * - Everything between a tag and the next tag, belongs to the first tag, no matter
 * indentation.
 *
 * - To get a white line, use double 'enter'
 *
 * - Use @callback for a callback type, @function to mark variable as function
 *
 * - Filter unused tags for now in the JSDoc parser
 *
 * @param {Logger} logger
 * @returns {Promise<void>}
 */
export async function syncJSDocToDocs(logger) {
  const event = newEvent(logger);
  eventStart(event, "docs.syncJSDoc");

  const files = await packageListFiles(newEventFromEvent(event));
  const parseResult = await packageParseFiles(newEventFromEvent(event), files);

  const commentsByPackage = resolveJSDocCommentsByPackage(
    newEventFromEvent(event),
    files,
    parseResult,
  );

  const combinedDeclarations = combineCommentsWithDeclarations(
    newEventFromEvent(event),
    files,
    parseResult,
    commentsByPackage,
  );

  const markdown = convertDeclarationsToMarkdown(
    newEventFromEvent(event),
    combinedDeclarations,
  );

  for (const pkg of packages) {
    await writeFile(
      pathJoin(process.cwd(), `docs/api/${pkg}.md`),
      markdown.get(pkg),
    );
  }

  // Automagically logs timings since this is a root event
  eventStop(event);
}
