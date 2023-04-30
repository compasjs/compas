// @ts-nocheck

import { existsSync, readFileSync, writeFileSync } from "fs";
import { exec, processDirectoryRecursiveSync } from "@compas/stdlib";

/**
 * @param {Logger} logger
 * @returns {Promise<void>}
 */
export async function executeApiClientToExperimentalCodeGen(logger) {
  const structureInformation = readStructureInformation();
  const loadedStructures = await loadStructures(structureInformation);
  logger.info(`Loaded ${loadedStructures.length} structures...`);

  writeGenerateFile(structureInformation);
  logger.info(`Written scripts/generate.mjs. Executing...`);
  await exec(`node ./scripts/generate.mjs`, {});

  const nameMap = loadNameMap(loadedStructures);
  const fileList = loadFileList(structureInformation);
  logger.info(
    `Rewriting ${Object.keys(nameMap).length} type names in ${
      fileList.length
    } files...`,
  );

  rewriteInFiles(fileList, nameMap);
  logger.info(`Done rewriting type names.`);
  logger.info(`Manual cleanup:
    - Remove structures.txt
    - Copy-edit & cleanup 'scripts/generate.mjs'
      - Use environment variables where appropriate
      - Cleanup imports
      - Correct 'targetRuntime' when using React-native.
    - Go through 'mutation' hooks usage & flatten arguments
    - Update imports from 'generated/common/reactQuery' to 'generated/common/api-client(-wrapper).tsx'
    - ...
`);
}

function readStructureInformation() {
  const fileContents = readFileSync("./structures.txt", "utf-8");
  const lines = fileContents.split("\n").filter((it) => !!it.trim());

  return lines.map((it) => {
    const [structurePath, outputDirectory, defaultGroup] = it.split(" -- ");

    return {
      defaultGroup,
      structurePath,
      outputDirectory,
    };
  });
}

async function loadStructures(structureInformation) {
  const { loadApiStructureFromOpenAPI, loadApiStructureFromRemote } =
    await import("@compas/code-gen");
  const { default: Axios } = await import("axios");

  const result = [];

  for (const si of structureInformation) {
    if (existsSync(si.structurePath)) {
      result.push(
        loadApiStructureFromOpenAPI(
          si.defaultGroup,
          JSON.parse(readFileSync(si.structurePath, "utf-8")),
        ),
      );
    } else {
      result.push(await loadApiStructureFromRemote(Axios, si.structurePath));
    }
  }

  return result;
}

function writeGenerateFile(structureInformation) {
  writeFileSync(
    "./scripts/generate.mjs",
    `
import { Generator } from "@compas/code-gen/experimental";
import { loadApiStructureFromOpenAPI, loadApiStructureFromRemote } from "@compas/code-gen";
import Axios from "axios";
import { readFileSync } from "node:fs";
import { mainFn } from "@compas/stdlib";

process.env.NODE_ENV = "development";
mainFn(import.meta, main);

async function main() {
${structureInformation
  .map((si) => {
    if (existsSync(si.structurePath)) {
      return `{
    const generator = new Generator();
    
    generator.addStructure(loadApiStructureFromOpenAPI("${si.defaultGroup}", JSON.parse(readFileSync("${si.structurePath}", "utf-8"))));
    
    generator.generate({
      targetLanguage: "ts",
      outputDirectory: "${si.outputDirectory}",
      generators: {
        apiClient: {
          target: {
            library: "axios",
            targetRuntime: "browser",
            // globalClients: true,
            includeWrapper: "react-query",
          },
        },
      },
    });
  }`;
    }

    return `{
    const generator = new Generator();
    
    generator.addStructure(await loadApiStructureFromRemote(Axios, "${si.structurePath}"));
    
    generator.generate({
      targetLanguage: "ts",
      outputDirectory: "${si.outputDirectory}",
      generators: {
        apiClient: {
          target: {
            library: "axios",
            targetRuntime: "browser",
            // globalClients: true,
            includeWrapper: "react-query",
          },
        },
      },
    });
  }`;
  })
  .join("\n\n")}
}
`,
  );
}

function loadNameMap(structures) {
  const result = {};

  for (const s of structures) {
    for (const group of Object.keys(s)) {
      for (const name of Object.keys(s[group])) {
        result[`${upperCaseFirst(group)}${upperCaseFirst(name)}Input`] =
          upperCaseFirst(group) + upperCaseFirst(name);
        result[`${upperCaseFirst(group)}${upperCaseFirst(name)}Api`] =
          upperCaseFirst(group) + upperCaseFirst(name);
      }
    }
  }

  return result;
}

function loadFileList(structureInformation) {
  const fileList = [];

  processDirectoryRecursiveSync(process.cwd(), (f) => {
    if (structureInformation.find((it) => f.includes(it.outputDirectory))) {
      return;
    }

    if (f.includes("vendor/")) {
      return;
    }

    if (
      f.endsWith(".ts") ||
      f.endsWith(".js") ||
      f.endsWith(".tsx") ||
      f.endsWith(".jsx") ||
      f.endsWith(".mjs")
    ) {
      fileList.push(f);
    }
  });

  return fileList;
}

function rewriteInFiles(fileList, nameMap) {
  for (const file of fileList) {
    let contents = readFileSync(file, "utf-8");
    let didReplace = false;

    for (const [name, replacement] of Object.entries(nameMap)) {
      if (contents.includes(name)) {
        contents = contents.replaceAll(name, replacement);
        didReplace = true;
      }
    }

    if (didReplace) {
      writeFileSync(file, contents);
    }
  }
}

/**
 * Uppercase first character of the input string
 *
 * @param {string|undefined} [str] input string
 * @returns {string}
 */
export function upperCaseFirst(str = "") {
  return str.length > 0 ? str[0].toUpperCase() + str.substring(1) : "";
}
