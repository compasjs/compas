import { AppError, eventStart, eventStop, isNil } from "@compas/stdlib";
import { packages, symbols } from "./packages.js";

/**
 * @typedef {Object<
 *   DocParserPackage,
 *   Object<string, DocParserBlock>
 * >} DocParserCombinedBlocks
 */

/**
 *
 * @param {InsightEvent} event
 * @param {DocParserCollectedFiles} filesByPackage
 * @param {DocParserParsedFileCollection} parsedByFile
 * @param {DocParserBlocksByPackage} comments
 * @returns {DocParserCombinedBlocks}
 */
export function combineCommentsWithDeclarations(
  event,
  filesByPackage,
  parsedByFile,
  comments,
) {
  eventStart(event, "combiner.commentsWithDeclarations");

  const result = {};

  for (const pkg of packages) {
    result[pkg] = {};

    for (const file of filesByPackage[pkg]) {
      const fileBody = parsedByFile[file].source;
      const declarations = fileBody.filter(
        (it) => it.type === "ExportNamedDeclaration",
      );

      for (const declaration of declarations) {
        if (isNil(declaration)) {
          continue;
        }

        let symbol;
        if (declaration.declaration?.type === "FunctionDeclaration") {
          const isExportedSymbol =
            symbols[pkg].indexOf(declaration.declaration.id.name) !== -1;

          if (!isExportedSymbol) {
            continue;
          }

          symbol = declaration.declaration.id.name;
        } else if (declaration.declaration?.type === "VariableDeclaration") {
          const isExportedSymbol =
            symbols[pkg].indexOf(
              declaration.declaration?.declarations?.[0]?.id?.name,
            ) !== -1;

          if (!isExportedSymbol) {
            continue;
          }

          symbol = declaration.declaration?.declarations?.[0]?.id?.name;
        } else if (declaration.declaration?.type === "ClassDeclaration") {
          // TODO: implement
        } else if (declaration.declaration === null) {
          continue;
        } else {
          console.dir(declaration, {
            colors: true,
            depth: 6,
          });
          throw AppError.serverError({
            type: "unknown_declaration",
            pkg,
            file,
          });
        }

        let previousComment;
        for (const comment of comments[pkg].blocks) {
          if (
            !comment.range ||
            comment.range.pkg !== pkg ||
            comment.range.file !== file
          ) {
            continue;
          }

          // TODO: Logic if declaration corresponds to the type of doc block
          // ie if FunctionDeclarationBlock === declaration.type ===
          // "FunctionDeclaration"

          if (comment.range.end > declaration.start) {
            break;
          } else {
            previousComment = comment;
          }
        }

        if (!previousComment || !symbol) {
          continue;
        }

        // Set name, we most likely don't have a name yet
        previousComment.name = symbol;
        // Try to correct the line number that we have
        previousComment.range.line =
          declaration?.loc?.start?.line ?? previousComment.range.line;
        result[pkg][symbol] = previousComment;
      }
    }
  }

  eventStop(event);

  return result;
}
