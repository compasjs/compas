import { writeFileSync } from "fs";
import { generateFromSchemas } from "./generate";
import { logger } from "./logger";
import { Schema, SchemaLike } from "./types";
import { toSchema } from "./util";

/**
 * Uses a map internally to notify and overwrite schemas
 */
const registry = new Map<string, Schema>();

export function resetSchemas() {
  registry.clear();
}

export function createSchema(name: string, schema: SchemaLike): void;
export function createSchema(schema: SchemaLike): void;

export function createSchema(
  nameOrSchema: string | SchemaLike,
  schema?: SchemaLike,
) {
  let s: Schema | undefined = undefined;
  if (typeof nameOrSchema === "string" && schema !== undefined) {
    s = toSchema(schema);
  } else {
    s = toSchema(nameOrSchema as Schema);
  }

  if (s === undefined) {
    throw new Error("Unknown. Report bug.");
  }

  if (typeof nameOrSchema === "string") {
    s.name = nameOrSchema;
  }

  if (registry.has(s.name!)) {
    logger.info(`Overwriting ${s.name} in registry.`);
  }

  registry.set(s.name!, s);
}

export function runGenerators(outputFile: string) {
  const arr = [];
  for (const it of registry.values()) {
    arr.push(it);
  }
  const output = generateFromSchemas(arr);

  writeFileSync(outputFile, output, { encoding: "utf-8" });
}
