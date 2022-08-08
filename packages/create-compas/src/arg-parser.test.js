import { mainTestFn, test } from "@compas/cli";
import {
  argParserParse,
  argParserValidate,
  createCompasFlags,
} from "./arg-parser.js";

mainTestFn(import.meta);

test("create-compas/arg-parser", (t) => {
  t.test("argParserParse", (t) => {
    t.test("Unknown flag", (t) => {
      const result = argParserParse(createCompasFlags, ["--foo", "bar"]);

      t.ok(result.error.message.includes("Unknown flag"));
      t.ok(result.error.message.includes("--foo"));
      t.ok(result.error.message.includes("npx create-compas@latest --help"));
    });

    t.test("repeatable flags", (t) => {
      const result = argParserParse(createCompasFlags, [
        "--template",
        "foo",
        "--template",
        "bar",
      ]);

      t.ok(
        result.error.message.includes("Flag '--template' is not repeatable"),
      );
    });

    t.test("--help value", (t) => {
      const result = argParserParse(createCompasFlags, ["--help", "foo"]);

      t.ok(
        result.error.message.includes("does not require a value. Found 'foo'"),
      );
    });

    t.test("require string", (t) => {
      const result = argParserParse(createCompasFlags, ["--template"]);

      t.ok(result.error.message.includes("'--template' requires a value"));
    });

    t.test("success - empty", (t) => {
      const result = argParserParse(createCompasFlags, []);

      t.deepEqual(result.value, {});
    });

    t.test("success - --help", (t) => {
      const result = argParserParse(createCompasFlags, ["--help"]);

      t.deepEqual(result.value, {
        help: true,
      });
    });

    t.test("success - --help true", (t) => {
      const result = argParserParse(createCompasFlags, ["--help", "true"]);

      t.deepEqual(result.value, {
        help: true,
      });
    });

    t.test("success - --help", (t) => {
      const result = argParserParse(createCompasFlags, ["--help", "1"]);

      t.deepEqual(result.value, {
        help: true,
      });
    });

    t.test("success - --template", (t) => {
      const result = argParserParse(createCompasFlags, ["--template", "auth"]);

      t.deepEqual(result.value, {
        template: "auth",
      });
    });

    t.test("sucess - multiple flags", (t) => {
      const result = argParserParse(createCompasFlags, [
        "--template",
        "foo",
        "--template-ref",
        "main",
      ]);

      t.deepEqual(result.value, {
        template: "foo",
        templateRef: "main",
      });
    });
  });

  t.test("argParserValidate", (t) => {
    t.test("short circuit --help", (t) => {
      const result = argParserValidate(
        {
          help: true,
          templatePath: "foo",
        },
        "",
      );

      t.deepEqual(result, { help: true });
    });

    t.test("default", (t) => {
      const result = argParserValidate({}, "main");

      t.deepEqual(result, {
        help: false,
        template: {
          provider: "github",
          repository: "compasjs/compas",
          ref: "main",
          path: "./examples/default",
        },
      });
    });

    t.test("bare --template-path error", (t) => {
      const result = argParserValidate(
        {
          templatePath: "foo",
        },
        "main",
      );

      t.ok(result.help);
      t.ok(result.message.includes("'--template' is required"));
    });

    t.test("bare --template-path with compas example erro", (t) => {
      const result = argParserValidate(
        {
          templatePath: "foo",
          template: "default",
        },
        "main",
      );

      t.ok(result.help);
      t.ok(result.message.includes("'--template' is required"));
    });

    t.test("template - missing prefix", (t) => {
      const result = argParserValidate(
        {
          template: "compasjs/template",
        },
        "main",
      );

      t.ok(result.help);
      t.ok(result.message.includes("prefixed with 'github:'"));
    });

    t.test("template - github", (t) => {
      const result = argParserValidate(
        {
          template: "github:compasjs/template",
        },
        "main",
      );

      t.equal(result.template.repository, "compasjs/template");
    });

    t.test("template - example", (t) => {
      const result = argParserValidate(
        {
          template: "with-cli",
        },
        "main",
      );

      t.equal(result.template.repository, "compasjs/compas");
      t.equal(result.template.path, "./examples/with-cli");
    });

    t.test("template - with path", (t) => {
      const result = argParserValidate(
        {
          template: "github:compasjs/template",
          templatePath: "./foo",
        },
        "main",
      );

      t.equal(result.template.repository, "compasjs/template");
      t.equal(result.template.path, "./foo");
    });

    t.test("custom ref", (t) => {
      const result = argParserValidate(
        {
          templateRef: "v1.0",
          template: "github:compasjs/template",
        },
        "main",
      );

      t.equal(result.template.ref, "v1.0");
      t.equal(result.template.repository, "compasjs/template");
    });

    t.test("custom output directory", (t) => {
      const result = argParserValidate(
        {
          outputDirectory: "./foo",
          template: "github:compasjs/template",
        },
        "main",
      );

      t.equal(result.outputDirectory, "./foo");
      t.equal(result.template.repository, "compasjs/template");
    });

    t.test("strip template path - trailing slash", (t) => {
      const result = argParserValidate(
        {
          template: "github:compasjs/template",
          templatePath: "./foo/bar/",
        },
        "main",
      );

      t.equal(result.template.path, "./foo/bar");
    });
  });
});
