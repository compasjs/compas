import { readFile } from "fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { pathJoin } from "@compas/stdlib";
import { codeGenToTemporaryDirectory } from "../../test/legacy/utils.test.js";
import { TypeCreator } from "../builders/index.js";
import { formatDocString, normalizeIndentationAndTrim } from "./comments.js";

mainTestFn(import.meta);

test("code-gen/comments", (t) => {
  t.test("normalizeIndentationAndTrim", (t) => {
    const pairs = [
      {
        input: "Single line",
        expected: "Single line",
      },
      {
        input: "   trim single line   \t",
        expected: "trim single line",
      },
      {
        input: "   trim \nmultiline   ",
        expected: "trim\nmultiline",
      },
      {
        input: "  trim\n   indent ",
        expected: "trim\n indent",
      },
      {
        input: "  ignore\n shorter indent except for start indent  ",
        expected: "ignore\n shorter indent except for start indent",
      },
      {
        input: "\n  ignore\n  indent\n if line indent shorter",
        expected: "ignore\n  indent\n if line indent shorter",
      },
    ];

    for (const p of pairs) {
      t.equal(normalizeIndentationAndTrim(p.input), p.expected);
    }
  });

  t.test("formatDocString", (t) => {
    t.test("single line", (t) => {
      t.equal(
        formatDocString("single line", { format: "jsdoc" }),
        " * single line",
      );
      t.equal(
        formatDocString("single line", { format: "endOfLine" }),
        "// single line",
      );
      t.equal(
        formatDocString("single line", { format: "partialLine" }),
        "/* single line */",
      );
    });

    t.test("multi line", (t) => {
      t.equal(
        formatDocString("multi\nline", { format: "jsdoc" }),
        " * multi\n * line",
      );
      t.equal(
        formatDocString("multi\nline", { format: "endOfLine" }),
        "// multi\n// line",
      );
      t.equal(
        formatDocString("multi\nline", { format: "partialLine" }),
        "/*\nmulti\nline\n */",
      );
    });

    t.test("multi line + indent", (t) => {
      t.equal(
        formatDocString("multi\nline", { format: "jsdoc", indentSize: 3 }),
        "    * multi\n    * line",
      );
      t.equal(
        formatDocString("multi\nline", { format: "endOfLine", indentSize: 3 }),
        "   // multi\n   // line",
      );
      t.equal(
        formatDocString("multi\nline", {
          format: "partialLine",
          indentSize: 3,
        }),
        "   /*\n   multi\n   line\n    */",
      );
    });
  });

  t.test("apiClient", async (t) => {
    const T = new TypeCreator();
    const R = T.router("/");
    const { exitCode, generatedDirectory, stdout, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          R.get("/route-without-docs", "routeWithoutDocs").response({}),
          R.get("/route-with-docs", "routeWithDocs")
            .docs("docs\nmultiline")
            .response({}),
          R.get("/route-with-docs-and-tags", "routeWithDocsAndTags")
            .docs("docs")
            .tags("tag1", "tag2")
            .response({}),
        ],
        {
          isBrowser: true,
          enabledGenerators: ["type", "apiClient"],
        },
      );

    t.equal(exitCode, 0, stdout);

    const source = await readFile(
      pathJoin(generatedDirectory, "app/apiClient.ts"),
      "utf-8",
    );

    // Note that the below assertions are not the best, since we strip a bunch of
    // whitespace in the templating system.

    t.test("routeWithoutDocs", (t) => {
      t.ok(
        source.includes(`/**
 *  
*
*/
export async function apiAppRouteWithoutDocs(`),
      );
    });

    t.test("routeWithDocs", (t) => {
      t.ok(
        source.includes(`/**
 * docs
 * multiline
*
*/
export async function apiAppRouteWithDocs(`),
      );
    });

    t.test("routeWithDocsAndTags", (t) => {
      t.ok(
        source.includes(`/**
 * docs
 *  
 * Tags: tag1, tag2
*
*/
export async function apiAppRouteWithDocsAndTags(`),
      );
    });

    t.test("teardown", async (t) => {
      await cleanupGeneratedDirectory();

      t.pass();
    });
  });

  t.test("reactQuery", async (t) => {
    const T = new TypeCreator();
    const R = T.router("/");
    const { exitCode, generatedDirectory, stdout, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          R.get("/route-without-docs", "routeWithoutDocs").response({}),
          R.get("/route-with-docs", "routeWithDocs")
            .docs("docs\nmultiline")
            .response({}),
          R.get("/route-with-docs-and-tags", "routeWithDocsAndTags")
            .docs("docs")
            .tags("tag1", "tag2")
            .response({}),
        ],
        {
          isBrowser: true,
          enabledGenerators: ["type", "apiClient", "reactQuery"],
        },
      );

    t.equal(exitCode, 0, stdout);

    const source = await readFile(
      pathJoin(generatedDirectory, "app/reactQueries.tsx"),
      "utf-8",
    );

    // Note that the below assertions are not the best, since we strip a bunch of
    // whitespace in the templating system.

    t.test("routeWithoutDocs", (t) => {
      t.ok(
        source.includes(`/**
 *  
*/
export function useAppRouteWithoutDocs`),
      );
    });

    t.test("routeWithDocs", (t) => {
      t.ok(
        source.includes(`/**
 * docs
 * multiline
*/
export function useAppRouteWithDocs`),
      );
    });

    t.test("routeWithDocsAndTags", (t) => {
      t.ok(
        source.includes(`/**
 * docs
 *  
 * Tags: tag1, tag2
*/
export function useAppRouteWithDocsAndTags`),
      );
    });

    t.test("teardown", async (t) => {
      await cleanupGeneratedDirectory();

      t.pass();
    });
  });
});
