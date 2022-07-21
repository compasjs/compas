import { formatDocStringsOfTypes } from "../generator/comments.js";
import { addFieldsOfRelations } from "../generator/sql/add-fields.js";
import { structureLinkReferences } from "../structure/structureLinkReferences.js";
import { structureTraverserAssign } from "../structure/structureTraverseAssign.js";
import { structureTraverseDepthFirst } from "../structure/structureTraverseDepthFirst.js";
import { preprocessExtend } from "./extend.js";
import { preprocessOmit } from "./omit.js";
import { preprocessPick } from "./pick.js";

/**
 * Call all preprocessors, removing internal only types and adding the 'real' types
 * before calling the generators
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function preprocessorsExecute(context) {
  structureLinkReferences(context.structure);

  structureTraverseDepthFirst(context.structure, (type) => {
    preprocessExtend(context.structure, type);
  });

  structureTraverserAssign(context.structure, (type) => {
    let result = preprocessOmit(context.structure, type);
    result = preprocessPick(context.structure, result);

    return result;
  });

  addFieldsOfRelations(context);
  formatDocStringsOfTypes(context);
}
