import { formatDocStringsOfTypes } from "../generator/comments.js";
import { addFieldsOfRelations } from "../generator/sql/add-fields.js";
import { preprocessOmit } from "./omit.js";
import { preprocessPick } from "./pick.js";
import { traversePreprocessor } from "./traverser.js";

/**
 * Call all preprocessors, removing internal only types and adding the 'real' types
 * before calling the generators
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function preprocessorsExecute(context) {
  traversePreprocessor(context.structure, (type) => {
    let result = preprocessOmit(context.structure, type);
    result = preprocessPick(context.structure, result);

    return result;
  });

  addFieldsOfRelations(context);
  formatDocStringsOfTypes(context);
}
