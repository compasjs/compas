import { mainFn } from "@compas/stdlib";
import {
  generateCli,
  generateCodeGen,
  generateStore,
  generateTypes,
} from "../src/generate.js";

mainFn(import.meta, main);

async function main() {
  await generateCli();
  await generateCodeGen();
  await generateStore();
  await generateTypes();
}
