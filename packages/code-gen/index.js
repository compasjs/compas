/*
 THE BATTLEPLAN:

 - Write plugins in the following order: validator, router, models, reactHooks
 - By each, think about a decent to use AST for code generation, so no data processing is needed in code-gen plugins themselves

 Final api, should run from a mainFn()
 ```
 runCodeGen(
 fromBuilder(builderFn),
 fromUrl("http://localhost:3000/_docs.json"),
 ).build({
 plugins: [],
 outputDir: "./src/generated",
 });
 ```
 Plugin interface ( order of plugins running ):
 ```
 {
 name: "pluginName",
 async init(initData)
 async run(options)
 }
 ```
 Interface from core to plugins for preInit stage:
 ```
 {
   hasPlugin(name: string): boolean;
   options: All general options except the plugin array
 }
 ```
 */
