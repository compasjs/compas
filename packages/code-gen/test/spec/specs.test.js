import { rm } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { environment, exec } from "@compas/stdlib";
import { codeGenSpecification } from "./specification.js";
import { codeGenSpecificationCreate } from "./structure.js";

mainTestFn(import.meta);

test("code-gen/specification", (t) => {
  // Generate the input structure. This way all implementations can use the same input.
  codeGenSpecificationCreate(t.log);

  // The list of implementations that can run the specification tests
  const implementations = [
    "./packages/code-gen/test/spec-implementations/js.js",
    "./packages/code-gen/test/spec-implementations/ts.js",
  ];

  // Count the number of checks in the provided specification.
  const recursiveCountSpecificationItems = (spec) => {
    if (spec.type === "suite") {
      return spec.components.reduce(
        (total, it) => recursiveCountSpecificationItems(it) + total,
        0,
      );
    }

    return 1;
  };

  const totalSpecificationItems =
    recursiveCountSpecificationItems(codeGenSpecification);

  t.timeout = 10000;

  t.test("tests", async (t) => {
    // Run all implementations out of process in parallel
    const results = await Promise.all(
      implementations.map(async (it) => {
        const result = await exec(`node ${it}`, {
          env: {
            ...environment,
            COMPAS_SPEC_TEST: "true",
          },
        });

        return {
          implementation: it,
          ...result,
        };
      }),
    );

    for (const result of results) {
      // For each implementation:
      // - Check the exit code
      // - Check if the number of checks add up to the total amount of checks.
      t.test(result.implementation, (t) => {
        t.equal(result.exitCode, 0, "Implementation check failed");

        if (result.exitCode === 0) {
          const passedResult = /Compas-Passed: (\d+);/g.exec(result.stdout);
          const skippedResult = /Compas-Skipped: (\d+);/g.exec(result.stdout);

          if (!passedResult?.[1] || !skippedResult?.[1]) {
            t.log.error({
              passedResult,
              skippedResult,
            });
            t.fail(
              "Could not determine the number of passed / skipped checks.",
            );
          }

          t.equal(
            totalSpecificationItems,
            Number(passedResult[1]) + Number(skippedResult[1]),
            `Implementation did not pass or skip all the checks. This could either be caused by failed checks or the number of (passed + skipped) not adding up to the full number of checks. Run 'node ${result.implementation}', it should pass / skip a total of ${totalSpecificationItems} checks.`,
          );
        }
      });
    }
  });

  t.test("teardown", async (t) => {
    await rm("./.cache/specification", { force: true, recursive: true });

    t.pass();
  });
});
