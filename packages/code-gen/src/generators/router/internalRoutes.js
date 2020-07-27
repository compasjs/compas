import { TypeCreator } from "../../types/index.js";

/**
 * @param {GenerateOpts} options
 */
export function getInternalRoutes(options) {
  const T = new TypeCreator("lbu");
  const G = T.router("_lbu/");
  const tags = ["_lbu"];

  const result = [];

  if (options.dumpStructure) {
    result.push(
      G.get("structure.json", "structure")
        .response(T.any())
        .tags(...tags)
        .docs("Return the full generated structure as a json object."),
    );
  }

  return result;
}
