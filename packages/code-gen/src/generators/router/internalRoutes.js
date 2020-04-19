import { TypeCreator } from "../../types/index.js";

export function getInternalRoutes() {
  const T = new TypeCreator("lbu");
  const G = T.router("_lbu/");
  const tags = ["_lbu"];

  return [
    G.get("structure.json", "structure")
      .tags(...tags)
      .docs("Return the full generated structure as a json object."),
  ];
}
