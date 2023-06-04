import { fileBlockEnd, fileBlockStart } from "../file/block.js";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextRemoveLinePrefix,
} from "../file/context.js";
import { fileWrite, fileWriteInline } from "../file/write.js";
import { JavascriptImportCollector } from "../target/javascript.js";

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../processors/route-trie.js").RouteTrie} trie
 */
export function javascriptRouteMatcher(generateContext, trie) {
  const file = fileContextCreateGeneric(
    generateContext,
    "common/route-matcher.js",
    {
      importCollector: new JavascriptImportCollector(),
    },
  );

  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, " *");

  fileWrite(
    file,
    " Match the route and params, based on the provided method and path.\n",
  );

  fileWrite(file, ` @param {string} method`);
  fileWrite(file, ` @param {string} path`);

  fileWrite(
    file,
    ` @returns {{ route: { group: string, name: string }, params: Record<string, string> }}`,
  );

  fileWrite(file, "/");
  fileContextRemoveLinePrefix(file, 2);

  // Function body
  fileBlockStart(file, `export function routeMatcher(method, path)`);

  // Input normalization
  fileBlockStart(file, `if (!path.startsWith("/"))`);
  fileWrite(file, `path = "/" + path;`);
  fileBlockEnd(file);

  fileBlockStart(file, `if (path.endsWith("/"))`);
  fileWrite(file, `path = path.slice(0, -1);`);
  fileBlockEnd(file);

  // Variable declaration
  fileWrite(file, `const params = Object.create(null);`);
  fileWrite(
    file,
    `const matchPath = \`$\{method.toUpperCase()}$\{path}\`.split("/");`,
  );

  routeMatcherChildren(file, trie, {
    matchPathIndex: 0,
    paramsOnMatch: {},
  });

  fileWrite(file, `return undefined;`);

  fileBlockEnd(file);
}

/**
 * Create matchers for the children of this trie
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../processors/route-trie.js").RouteTrie} trie
 * @param {{
 *   matchPathIndex: number,
 *   paramsOnMatch: Record<string, number>,
 * }} options
 */
function routeMatcherChildren(file, trie, { matchPathIndex, paramsOnMatch }) {
  const firstIdx = 0;

  for (let i = 0; i < trie.children.length; i++) {
    const child = trie.children[i];

    if (child.prio === "STATIC") {
      if (i === firstIdx) {
        fileWriteInline(file, `if`);
      } else {
        fileWriteInline(file, `else if`);
      }

      const segments = child.path.split("/");
      const condition = segments
        .map((it, index) => `matchPath[${matchPathIndex + index}] === "${it}"`)
        .join(" && ");

      fileBlockStart(file, `(${condition})`);

      if (child.route) {
        fileBlockStart(
          file,
          `if (matchPath.length === ${matchPathIndex + segments.length})`,
        );

        for (const key of Object.keys(paramsOnMatch)) {
          fileWrite(file, `params.${key} = matchPath[${paramsOnMatch[key]}];`);
        }
        fileWrite(
          file,
          `return { params, route: { group: "${child.route.group}", name: "${child.route.name}" } };`,
        );
        fileBlockEnd(file);
      }

      routeMatcherChildren(file, child, {
        matchPathIndex: matchPathIndex + segments.length,
        paramsOnMatch,
      });

      fileBlockEnd(file);
    } else if (child.prio === "PARAM") {
      paramsOnMatch[child.paramName ?? ""] = matchPathIndex;

      if (child.route) {
        if (i === firstIdx) {
          fileWriteInline(file, `if`);
        } else {
          fileWriteInline(file, `else if`);
        }

        fileBlockStart(file, `(matchPath.length === ${matchPathIndex + 1})`);

        for (const key of Object.keys(paramsOnMatch)) {
          fileWrite(file, `params.${key} = matchPath[${paramsOnMatch[key]}];`);
        }
        fileWrite(
          file,
          `return { params, route: { group: "${child.route.group}", name: "${child.route.name}" } };`,
        );
        fileBlockEnd(file);
      }

      routeMatcherChildren(file, child, {
        matchPathIndex: matchPathIndex + 1,
        paramsOnMatch,
      });

      delete paramsOnMatch[child.paramName ?? ""];
    } else if (child.prio === "WILDCARD") {
      for (const key of Object.keys(paramsOnMatch)) {
        fileWrite(file, `params.${key} = matchPath[${paramsOnMatch[key]}];`);
      }
      fileWrite(
        file,
        `return { params, route: { group: "${child.route?.group}", name: "${child.route?.name}" } };`,
      );
    }
  }
}
