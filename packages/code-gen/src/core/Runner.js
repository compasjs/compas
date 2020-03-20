import { addToTemplateContext, isPlainObject } from "@lbu/stdlib";
import { existsSync, promises } from "fs";
import { join } from "path";
import { generateJsDoc } from "./utils.js";

const { writeFile, mkdir } = promises;

class Runner {
  constructor(logger, dataLoader, { plugins, ...opts }) {
    this.logger = logger;
    this.dataLoader = dataLoader;
    this.plugins = plugins;
    this.opts = opts;

    this.outputs = [];
  }

  async run() {
    this.logger.info("Initializing plugins...");
    // TODO: Validate plugins
    await this.pluginsInit();

    this.logger.info("Awaiting data loader...");
    this.data = await this.dataLoader();

    this.logger.info(
      `Generating for ${Object.keys(this.data.models).length} models`,
    );
    // TODO: Validate data

    this.compileTemplateHelpers();
    await this.pluginsGenerate();
    await this.writeOutputs();

    this.logger.info("Done...");
  }

  async pluginsInit() {
    const hasPlugin = name => !!this.plugins.find(it => it.name === name);

    for (const p of this.plugins) {
      if ("init" in p) {
        await p.init({
          hasPlugin,
          opts: this.opts,
        });
      }
    }
  }

  async pluginsGenerate() {
    for (const p of this.plugins) {
      if ("generate" in p) {
        const result = await p.generate(this.data);
        if (!result) {
          continue;
        }
        if (!Array.isArray(result)) {
          if (isPlainObject(result)) {
            this.outputs.push(result);
          } else {
            throw new Error("Expecting plain object or array");
          }
        } else {
          this.outputs = this.outputs.concat(result);
        }
      }
    }
  }

  async writeOutputs() {
    if (!existsSync(this.opts.outputDir)) {
      await mkdir(this.opts.outputDir, { recursive: true });
    }

    for (const output of this.outputs) {
      const path = join(this.opts.outputDir, output.path);
      await writeFile(path, output.content, { encoding: "utf-8" });
    }
  }

  compileTemplateHelpers() {
    addToTemplateContext("generateJsDoc", generateJsDoc);
  }
}

/**
 * Entry point for code generation needs
 * @param {Logger} logger
 * @param dataLoader
 * @returns {{build: Function}}
 */
export const runCodeGen = (logger, dataLoader) => ({
  build: async opts => new Runner(logger, dataLoader, opts).run(),
});
