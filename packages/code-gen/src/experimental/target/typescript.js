import { JavascriptImportCollector } from "./javascript.js";

export class TypescriptImportCollector extends JavascriptImportCollector {
  // Behaviour is the same as the JS collector. The callers should format the import
  // paths correctly for the supported TS configuration.
  //
  // TODO: check multiple TS options if we force that api clients always validate the
  // results.
}
