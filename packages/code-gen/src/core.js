const { spawn } = require("@lbu/stdlib");
const { isPlainObject } = require("@lbu/stdlib");
const {
  existsSync,
  promises: { writeFile, mkdir },
} = require("fs");
const { join } = require("path");

class Runner {
  constructor(logger, dataLoader, { plugins, ...opts }) {
    this.logger = logger;
    this.dataLoader = dataLoader;
    this.plugins = plugins;
    this.opts = opts;

    this.outputs = [];
  }

  async run() {
    // TODO: Validate plugins
    this.data = await this.dataLoader();
    // TODO: Validate data

    await this.pluginsInit();
    await this.pluginsGenerate();
    await this.pluginsFinalize();
    await this.writeOutputs();

    await spawn(`yarn`, ["lbu", "lint"]);
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
        const result = await p.generate({ opts: this.opts, data: this.data });
        if (!result) {
          continue;
        }
        if (!Array.isArray(result)) {
          if (isPlainObject(result)) {
            this.outputs.push(result);
          } else {
            throw new Error("Expecting plain object or array");
          }
        }
        this.outputs = this.outputs.concat(result);
      }
    }
  }

  async pluginsFinalize() {
    for (const p of this.plugins) {
      if ("finalize" in p) {
        await p.finalize({
          output: this.outputs,
          opts: this.opts,
          data: this.data,
        });
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
}

/**
 * @param {Logger} logger
 * @param dataLoader
 * @returns {{build: (function(Logger, *): Promise<void>)}}
 */
const runCodeGen = (logger, dataLoader) => ({
  build: async opts => new Runner(logger, dataLoader, opts).run(),
});

module.exports = {
  runCodeGen,
};
