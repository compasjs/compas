import { environment } from "@compas/stdlib";
import { fileBlockEnd, fileBlockStart } from "../file/block.js";
import {
  fileContextCreateGeneric,
  fileContextSetIndent,
} from "../file/context.js";
import { fileWrite, fileWriteInline } from "../file/write.js";
import { modelKeyGetPrimary } from "../processors/model-keys.js";
import {
  modelRelationGetInformation,
  modelRelationGetOwn,
} from "../processors/model-relation.js";
import { structureModels } from "../processors/models.js";
import { structureResolveReference } from "../processors/structure.js";

/**
 * Write an ERD diagram in a Mermaid codeblock in a Markdown file.
 * This is supported on GitHub and in quite some IDE's.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function databaseERDCreate(generateContext) {
  const file = fileContextCreateGeneric(generateContext, "common/erd.md", {
    addGeneratedByComment: false,
    indentationValue: "    ",
  });

  if (environment.APP_NAME) {
    fileWrite(file, `# ERD for ${environment.APP_NAME}\n`);
  } else {
    fileWrite(file, `# ERD\n`);
  }

  fileWrite(file, `\`\`\`mermaid`);
  fileWrite(file, `erDiagram`);
  fileContextSetIndent(file, 1);

  for (const model of structureModels(generateContext)) {
    databaseERDWriteModel(generateContext, file, model);
  }

  fileContextSetIndent(file, -1);
  fileWrite(file, `\`\`\``);
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>} model
 */
function databaseERDWriteModel(generateContext, file, model) {
  fileBlockStart(file, `${model.name}`);

  const { primaryKeyName } = modelKeyGetPrimary(model);
  const relations = modelRelationGetOwn(model);
  const relationKeys = relations.map((it) => it.ownKey);

  for (const key of Object.keys(model.keys)) {
    const field = model.keys[key];
    const type =
      field.type === "reference"
        ? structureResolveReference(generateContext.structure, field).type
        : field.type;

    fileWriteInline(file, `${type} ${key}`);

    if (key === primaryKeyName) {
      fileWriteInline(file, ` PK`);
    } else if (relationKeys.includes(key)) {
      fileWrite(file, ` FK`);
    }

    fileWrite(file, "");
  }

  fileBlockEnd(file);

  for (const relation of relations) {
    const relationInfo = modelRelationGetInformation(relation);

    fileWriteInline(file, `${model.name} `);

    if (relation.subType === "manyToOne" && relation.isOptional) {
      fileWriteInline(file, `}|--o|`);
    } else if (relation.subType === "manyToOne") {
      fileWriteInline(file, `}|--||`);
    } else if (relation.subType === "oneToOne" && relation.isOptional) {
      fileWriteInline(file, `|o--||`);
    } else if (relation.subType === "oneToOne") {
      fileWriteInline(file, `||--||`);
    }

    fileWriteInline(file, ` ${relationInfo.modelInverse.name}`);

    if (relation.subType === "manyToOne") {
      fileWrite(file, ` : "M-1"`);
    } else {
      fileWrite(file, ` : "1-1"`);
    }
  }
}
