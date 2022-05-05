import { upperCaseFirst } from "../utils.js";

/**
 * Add item to correct group and add uniqueName
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} dataStructure
 * @param {import("../generated/common/types.js").CodeGenType|
 * import("../generated/common/types.js").CodeGenRelationType|
 * import("../generated/common/types.js").CodeGenRouteInvalidationType} item
 */
export function structureAddType(dataStructure, item) {
  if (
    !("group" in item) ||
    !("name" in item) ||
    !item.group ||
    !item.name ||
    !item.type
  ) {
    throw new Error(
      `Can't process item. Missing either group, name or type. Found: ${JSON.stringify(
        item,
      )}`,
    );
  }

  if (!dataStructure[item.group]) {
    dataStructure[item.group] = {};
  }
  dataStructure[item.group][item.name] = item;

  item.uniqueName = upperCaseFirst(item.group) + upperCaseFirst(item.name);
}
