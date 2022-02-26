import { App } from "@compas/code-gen";
import { mainFn } from "@compas/stdlib";
import { extendWithTodo } from "../gen/todo.js";

mainFn(import.meta, main);

async function main() {
  const app = new App();

  extendWithTodo(app);

  await app.generate({
    isNodeServer: true,
    enabledGenerators: ["type", "validator", "router"],
    outputDirectory: "./src/generated",
  });
}
