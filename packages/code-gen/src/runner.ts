import { isNil } from "@lbu/stdlib";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { wrapAbstractTree } from "./abstractTree";
import { FluentApi } from "./fluent";
import { logger } from "./logger";
import {
  getCommentPlugin,
  getLintPlugin,
  getOpenApiPlugin,
  getTsNodePlugin,
  getTypescriptPlugin,
} from "./plugins";
import {
  PluginBuildResult,
  PluginHooks,
  PluginMetaData,
  WrappedAbstractTree,
} from "./types";

type ParametersOrEmpty<
  T extends ((...args: any[]) => any) | undefined
> = T extends (...args: infer P) => any ? P : [];

export class Runner {
  private static knownPlugins = [
    getTsNodePlugin,
    getTypescriptPlugin,
    getOpenApiPlugin,
    getCommentPlugin,
    getLintPlugin,
  ];

  public app: FluentApi | undefined = undefined;
  private abstractTree: WrappedAbstractTree | undefined = undefined;
  private plugins: PluginMetaData[] = [];
  private inputFile = "";
  private buildResult: PluginBuildResult[] = [];

  run(inputFile: string) {
    this.inputFile = inputFile;
    this.instantiateFluentApp();

    this.initPlugins();
    this.runHook("beforeRequire", []);
    this.loadUserFile();
    this.runHook("useFluentApi", [this.app!]);
    this.schemaToAst();
    this.runHook("validateAbstractTree", [this.abstractTree!]);
    this.runBuildHookAndCollect();
    this.runHook("inspectBuildResult", [this.buildResult]);
    this.writeResult();
    this.runHook("postRunner", []);
  }

  private instantiateFluentApp() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { name } = require(join(process.cwd(), "package.json"));
    this.app = new FluentApi(name);
  }

  private initPlugins() {
    logger.info("Starting plugins");
    for (const plugin of Runner.knownPlugins) {
      const meta = plugin();
      this.plugins.push(meta);
      logger.info("Plugin loaded", {
        name: meta.name,
        description: meta.description,
      });
    }
  }

  /**
   * Note: for now this is only used for simple function invocations with looking at the
   * returned value at all, so some hooks will be called from other methods
   */
  private runHook<HookName extends keyof PluginHooks>(
    key: HookName,
    args: ParametersOrEmpty<PluginHooks[HookName]>,
  ) {
    logger.info("Running hook:", key);

    for (const plugin of this.plugins) {
      const hook = plugin.hooks[key] as PluginHooks[HookName];
      if (!isNil(hook)) {
        // @ts-ignore
        hook(...args);
      }
    }
  }

  private loadUserFile() {
    if (this.inputFile === "") {
      throw new Error("input file could not be loaded correctly.");
    }

    require(this.inputFile);
  }

  private schemaToAst() {
    this.abstractTree = wrapAbstractTree(this.app!.getTree());
  }

  private runBuildHookAndCollect() {
    logger.info("Running hook: buildOutput");

    for (const plugin of this.plugins) {
      const hook = plugin.hooks["buildOutput"];
      if (!isNil(hook)) {
        this.buildResult.push({
          name: plugin.name,
          files: hook(this.abstractTree!),
        });
      }
    }
  }

  private writeResult() {
    for (const result of this.buildResult) {
      for (const file of result.files) {
        if (process.env.DRY_RUN !== "true") {
          this.internalWriteFile(file.path, file.source);
        } else {
          logger.info({
            ...file,
            plugin: result.name,
          });
        }
      }
    }
  }

  private internalWriteFile(path: string, src: string) {
    const subPath = path.substring(0, path.lastIndexOf("/"));
    if (!existsSync(subPath)) {
      mkdirSync(subPath, { recursive: true });
    }
    writeFileSync(path, src, { encoding: "utf8" });
  }
}

export const runner = new Runner();

/**
 * Get the FluentApi of this process
 */
export const createApp = () => runner.app!;
