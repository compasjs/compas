import { mainTestFn, test } from "@compas/cli";
import { pathJoin } from "@compas/stdlib";
import { convertOpenAPISpec } from "../../open-api-importer.js";
import { generateOpenApiFile } from "./generator.js";

mainTestFn(import.meta);

test("code-gen/generator/openAPI", async (t) => {
  // load structure
  const { structure } = await import(
    pathJoin(process.cwd(), "./generated/testing/server/common/structure.js")
  );

  t.test("generateOpenApiFile, ensure build and assert version", (t) => {
    const spec = generateOpenApiFile(structure, {
      enabledGroups: ["server"],
      openApiOptions: {
        version: "1.0.0",
        title: "Lorem",
        description: "Ipsum",
      },
    });

    t.equal(spec?.openapi, "3.0.3");
  });

  t.test("generateOpenApiFile, ensure paths/routes are correct", (t) => {
    const { paths } = generateOpenApiFile(structure, {
      enabledGroups: ["server"],
      openApiOptions: {
        version: "1.0.0",
        title: "Lorem",
        description: "Ipsum",
      },
    });

    for (const path of Object.keys(paths)) {
      t.ok(!path.includes(":"), "path contains compas path identifier");
    }
  });

  t.test(
    "generateOpenApiFile, ensure created structure can be imported",
    (t) => {
      const openapiSpec = generateOpenApiFile(structure, {
        enabledGroups: ["server"],
      });

      if (!openapiSpec) {
        t.fail("api spec not generated");
      }

      try {
        convertOpenAPISpec("server", openapiSpec);
        t.pass("Should not throw");
      } catch (e) {
        t.fail("Should not throw");
        t.log.error(e);
      }
    },
  );
});
