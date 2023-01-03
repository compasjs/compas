/**
 * Generates the sql structure, this can be used to create migration files from
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function generateSqlStructure(
  context: import("../../generated/common/types").CodeGenContext,
): void;
export namespace typeTable {
  const any: string;
  const anyOf: string;
  const array: string;
  const boolean: string;
  function date(type: any): "date" | "time" | "timestamptz";
  const generic: string;
  function number(type: CodeGenNumberType, skipPrimary: boolean): string;
  const object: string;
  function string(
    type: any,
    skipPrimary: any,
  ): "varchar" | "varchar PRIMARY KEY";
  function uuid(type: any, skipPrimary: any): "uuid" | "uuid PRIMARY KEY";
}
//# sourceMappingURL=structure.d.ts.map
