// @ts-nocheck

import { environment, isNil } from "@compas/stdlib";

/**
 * Format an ERD like structure with graphviz.
 * For html formatting or other documentation see
 * https://graphviz.org/doc/info/shapes.html#html
 *
 * @param codeGen
 * @param {CodeGenStructure} structure
 * @returns {string}
 */
export function formatGraphOfSql(codeGen, structure) {
  const entities = codeGen.getQueryEnabledObjects({ structure });

  let src = `
  digraph "${environment.APP_NAME}" {
    label = "label";
    fontsize = 14;
    rankdir = "TB";
    nodesep = 0.7;      
  `;

  for (const entity of entities) {
    src += `
    ${entity.name} [shape=none, margin=0, label=<
     ${formatEntityTable(codeGen, entity)}
    > ];\n`;
  }

  for (const entity of entities) {
    const entityKeys = codeGen.getSortedKeysForType(entity);

    for (const relation of entity.relations) {
      if (["oneToOneReverse", "oneToMany"].indexOf(relation.subType) !== -1) {
        continue;
      }

      const label = relation.subType === "oneToOne" ? "1 - 1" : "N - 1";

      if (relation.reference.reference === entity) {
        src += `${entity.name}:"${entityKeys.indexOf(relation.ownKey)}" -> ${
          entity.name
        }:"${0}" [label="${label}"];\n`;
      } else {
        src += `${entity.name}:"${entityKeys.indexOf(relation.ownKey)}_right" -> ${
          relation.reference.reference.name
        }:"${0}" [label="${label}"];\n`;
      }
    }
  }

  src += "}";

  return src;
}

/**
 * Format entity as table.
 * Add some background coloring for primary key & date fields
 *
 * @param codeGen
 * @param {CodeGenObjectType} entity
 * @returns {string}
 */
function formatEntityTable(codeGen, entity) {
  const keys = codeGen.getSortedKeysForType(entity);
  const colorForKey = (key) =>
    key !== codeGen.getPrimaryKeyWithType(entity).key ?
      ["createdAt", "updatedAt", "deletedAt"].indexOf(key) !== -1 ?
        96
      : 92
    : 70;
  const formatType = (key) => {
    // @ts-ignore
    const type = entity.keys[key].reference ?? entity.keys[key];
    const nullable = type.isOptional && isNil(type.defaultValue);

    return `${nullable ? "?" : ""}${type.type}`;
  };

  return `<table border="0" cellspacing="0" cellborder="1">
<tr><td bgcolor="lightblue2" colspan="2"><font face="Times-bold" point-size="16"> ${
    entity.name
  } </font></td></tr>
${keys
  .map((key, idx) => {
    return `<tr><td bgcolor="grey${colorForKey(
      key,
    )}" align="left" port="${idx}"><font face="Times-bold"> ${key} </font></td><td align="left" port="${idx}_right"><font color="#535353"> ${formatType(
      key,
    )} </font></td></tr>`;
  })
  .join("\n")}
</table>`;
}
