import { isNil } from "@lbu/stdlib";

/**
 * Setup and print imports
 * @param {CodeGenTemplateState} [parentState]
 * @returns {StateFn}
 */
export function setupImports(parentState) {
  /**
   * @type { CodeGenTemplateState}
   */
  return (state) => {
    switch (state.phase) {
      case "init":
        if (!isNil(parentState)) {
          state.imports = parentState.imports;
        } else {
          state.imports = {
            destructureImport: {},
            starImport: new Map(),
            commonjsImport: new Map(),
          };
        }
        break;
      case "finish":
        if (!isNil(parentState)) {
          return "";
        }
        return printImports(state.imports);
    }
  };
}

/**
 * Requires `setupImports`
 * @param {string} value - The destructured item
 * @param {string} pkg - Package specified
 */
export function addDestructuredImport(value, pkg) {
  return (state) => {
    if (!isNil(state.imports)) {
      if (isNil(state.imports.destructureImport[pkg])) {
        state.imports.destructureImport[pkg] = new Set();
      }
      state.imports.destructureImport[pkg].add(value);

      // Did add the import, so we are finished
      return "";
    }
  };
}

/**
 * Requires `setupImports`
 * @param {string} alias - The aliased name
 * @param {string} pkg - Package specified
 */
export function addStarImport(alias, pkg) {
  return (state) => {
    if (!isNil(state.imports)) {
      state.imports.starImport.set(pkg, alias);

      // Did add the import, so we are finished
      return "";
    }
  };
}

/**
 * Requires `setupImports`
 * @param {string} alias - The aliased name
 * @param {string} pkg - Package specified
 */
export function addCommonjsImport(alias, pkg) {
  return (state) => {
    if (!isNil(state.imports)) {
      state.imports.commonjsImport.set(pkg, alias);

      // Did add the import, so we are finished
      return "";
    }
  };
}

/**
 * @param {CodeGenTemplateImports} imports
 * @returns {string}
 */
function printImports(imports) {
  const result = [];

  for (const [key, value] of imports.commonjsImport.entries()) {
    result.push(`import ${value} from "${key}";`);
  }

  for (const [key, value] of imports.starImport.entries()) {
    result.push(`import * as ${value} from "${key}";`);
  }

  for (const key of Object.keys(imports.destructureImport)) {
    result.push(
      `import { ${[...imports.destructureImport[key].values()].join(
        ", ",
      )} } from "${key}";`,
    );
  }

  return result.join("\n");
}
