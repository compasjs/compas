import { existsSync, mkdirSync } from "fs";
import { AppSchema } from "./types";

export function generateForAppSchema(outputDir: string, schema: AppSchema) {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
}
