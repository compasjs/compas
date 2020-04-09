import { logger } from "@lbu/cli/src/logger.js";
import { isPlainObject, newTemplateContext } from "@lbu/stdlib";
import { existsSync, promises as fs } from "fs";
import { join } from "path";

const { writeFile, mkdir } = fs;

/**
 * Entry point for code generation needs
 * @param {Logger} logger
 * @param dataLoader
 * @returns {{build: Function}}
 */
export function runCodeGen(logger, dataLoader) {
  return new Runner(logger, dataLoader);
}

class Runner {
  constructor(logger, dataLoader) {
    this.logger = logger;
    this.dataLoader = dataLoader;

    this.templateContext = newTemplateContext();
    this.templateContext.globals.quote = (x) => `"${x}"`;

    this.outputs = [];
  }

  /**
   * @public
   */
  build({ plugins, ...opts }) {
    this.plugins = plugins;
    this.opts = opts;

    return this.run();
  }

  /**
   * @private
   */
  async run() {
    this.logger.info("Initializing plugins...");
    await this.pluginsInit();

    this.logger.info("Awaiting data loader...");
    this.data = await this.dataLoader();

    this.logger.info(
      `Generating for ${Object.keys(this.data.models).length} models`,
    );

    await this.pluginsGenerate();
    await this.writeOutputs();

    this.logger.info("Done...");
  }

  /**
   * @private
   */
  async pluginsInit() {
    const hasPlugin = (name) => !!this.plugins.find((it) => it.name === name);

    for (const p of this.plugins) {
      if (this.opts.verbose) {
        logger.info(`generator: Calling ${p.name}#init`);
      }

      if ("init" in p) {
        await p.init(this, {
          hasPlugin,
        });
      }
    }
  }

  /**
   * @private
   */
  async pluginsGenerate() {
    for (const p of this.plugins) {
      if (this.opts.verbose) {
        logger.info(`generator: Calling ${p.name}#generate`);
      }

      if ("generate" in p) {
        const result = await p.generate(this, this.data);
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

  /**
   * @private
   */
  async writeOutputs() {
    if (!existsSync(this.opts.outputDir)) {
      await mkdir(this.opts.outputDir, { recursive: true });
    }

    for (const output of this.outputs) {
      const path = join(this.opts.outputDir, output.path);
      await writeFile(path, output.content, { encoding: "utf-8" });
    }
  }
}
