import { R } from "./RouteBuilder.js";

export function getInternalRoutes() {
  const group = R.group("lbu", "_lbu/");
  const tags = ["_lbu"];

  return [
    group
      .get("structure.json", "structure")
      .tags(...tags)
      .docs("Return the full generated structure as a json object."),
  ];
}
