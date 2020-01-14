import { writeFileSync } from "fs";
import { generateFromSchemas } from "./generate";
import { logger } from "./logger";
import { Schema } from "./types";

/**
 * Uses a map internally to notify and overwrite schemas
 */
const registry = new Map<string, Schema>();

export function resetSchemas() {
  registry.clear();
}

export function createSchema(name: string, schema: Schema): void;
export function createSchema(schema: Schema): void;

export function createSchema(nameOrSchema: string | Schema, schema?: Schema) {
  if (typeof nameOrSchema === "string" && schema !== undefined) {
    schema.name = nameOrSchema;

    if (registry.has(schema.name)) {
      logger.info(`Overwriting ${schema.name} in registry.`);
    }

    registry.set(nameOrSchema, schema);
  } else if (typeof nameOrSchema !== "string") {
    if (nameOrSchema.name === undefined) {
      throw new TypeError("if only a schema is provided, it should have name.");
    }

    if (registry.has(nameOrSchema.name)) {
      logger.info(`Overwriting ${nameOrSchema.name} in registry.`);
    }

    registry.set(nameOrSchema.name, nameOrSchema);
  } else {
    throw new TypeError(
      "Either a schema with name should be provided, or a name and schema should be provided separately",
    );
  }
}

export function runGenerators(outputFile: string) {
  const arr = [];
  for (const it of registry.values()) {
    arr.push(it);
  }
  const output = generateFromSchemas(arr);

  writeFileSync(outputFile, output, { encoding: "utf-8" });
}
