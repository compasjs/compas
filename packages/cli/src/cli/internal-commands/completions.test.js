import { isNil } from "@compas/stdlib";
import { compasGetCli } from "../../compas/cli.js";
import { validateCliCompletion } from "../../generated/cli/validators.js";
import { mainTestFn, newTestEvent, test } from "../../testing/index.js";
import { completionsGetCompletions } from "./completions.js";

mainTestFn(import.meta);

test("cli/internal-commands/completions", async (t) => {
  const { cli } = await compasGetCli(newTestEvent(t), {
    commandDirectories: {
      loadUserConfig: false,
      loadProjectConfig: false,
      loadScripts: false,
    },
  });

  /**
   *
   * @param {Array<string>} input
   * @returns {Promise<{commandCompletions: Array<CliCompletion>, flagCompletions:
   *   Array<CliCompletion>}>}
   */
  const generateCompletions = async (input) => {
    const { commandCompletions, flagCompletions } =
      await completionsGetCompletions(cli, input);

    for (const completion of [...commandCompletions, ...flagCompletions]) {
      const { error } = validateCliCompletion(completion);
      if (error) {
        error.info.value = completion;
        throw error;
      }
    }

    return {
      commandCompletions,
      flagCompletions,
    };
  };

  t.test("validation", async (t) => {
    const { cli } = await compasGetCli(newTestEvent(t), {
      commandDirectories: {
        loadUserConfig: true,
        loadProjectConfig: true,
        loadScripts: true,
      },
    });

    const validateCompletion = (cmd, cmp) => {
      const { error } = validateCliCompletion(cmp);
      if (error) {
        error.info.commandName = cmd.name;
        error.info.value = cmp;
        throw error;
      }
    };

    /** @type {CliResolved} */
    const validateCommand = async (cmd) => {
      if (cmd.name === "help") {
        return;
      }

      if (cmd.dynamicValue?.completions) {
        const { completions } = await cmd.dynamicValue.completions();
        completions.map((it) => validateCompletion(cmd, it));
      }

      for (const flag of cmd.flags) {
        if (flag.value?.completions) {
          const { completions } = await flag.value.completions();
          completions.map((it) => validateCompletion(flag, it));
        }
      }

      for (const subCmd of cmd.subCommands) {
        await validateCommand(subCmd);
      }
    };

    await validateCommand(cli);
    t.pass();
  });

  t.test("commands", (t) => {
    t.test("unknown input", async (t) => {
      const { commandCompletions, flagCompletions } = await generateCompletions(
        ["compas", "foo", ""],
      );

      t.equal(flagCompletions.length, 0);
      t.equal(commandCompletions.length, 0);
    });

    t.test("no input", async (t) => {
      const { commandCompletions, flagCompletions } = await generateCompletions(
        ["compas", ""],
      );

      t.equal(flagCompletions.length, 0);
      t.ok(commandCompletions.find((it) => it.name === "check-env"));
      t.ok(commandCompletions.find((it) => it.name === "test"));
      t.ok(commandCompletions.length > 5);
    });

    t.test("ignore partial command", async (t) => {
      const { commandCompletions, flagCompletions } = await generateCompletions(
        ["compas", "fa"],
      );

      t.equal(flagCompletions.length, 0);
      t.ok(commandCompletions.find((it) => it.name === "check-env"));
      t.ok(commandCompletions.find((it) => it.name === "test"));
      t.ok(commandCompletions.length > 5);
    });

    t.test("sub command, but not complete yet", async (t) => {
      const { commandCompletions, flagCompletions } = await generateCompletions(
        ["compas", "docker"],
      );

      t.equal(flagCompletions.length, 0);
      t.ok(commandCompletions.find((it) => it.name === "check-env"));
      t.ok(commandCompletions.find((it) => it.name === "test"));
      t.ok(commandCompletions.length > 5);
    });

    t.test("sub command, nested subcommands", async (t) => {
      const { commandCompletions, flagCompletions } = await generateCompletions(
        ["compas", "docker", ""],
      );

      t.equal(flagCompletions.length, 0);
      t.ok(commandCompletions.find((it) => it.name === "up"));
      t.ok(commandCompletions.find((it) => it.name === "down"));
      t.equal(commandCompletions.length, 3);
    });

    t.test("nested sub commands, no subCommands left", async (t) => {
      const { commandCompletions } = await generateCompletions([
        "compas",
        "docker",
        "up",
        "",
      ]);

      t.equal(commandCompletions.length, 0);
    });

    t.test("dynamic completions", async (t) => {
      const { commandCompletions } = await generateCompletions([
        "compas",
        "run",
        "",
      ]);

      t.ok(commandCompletions.length > 0);
      t.ok(commandCompletions.find((it) => it.type === "file"));
      t.ok(commandCompletions.find((it) => it.type === "completion"));
    });

    t.test("dynamic completions - with partial input", async (t) => {
      const { commandCompletions } = await generateCompletions([
        "compas",
        "run",
        "./",
      ]);

      t.ok(commandCompletions.length > 0);
      t.ok(commandCompletions.find((it) => it.type === "file"));
      t.ok(commandCompletions.find((it) => it.type === "completion"));
    });

    t.test("completion on help", async (t) => {
      const { commandCompletions } = await generateCompletions([
        "compas",
        "help",
        "",
      ]);

      t.ok(commandCompletions.length > 0);
      t.ok(commandCompletions.find((it) => it.name === "run"));
    });
  });

  t.test("flags", (t) => {
    t.test("are not added on 'isDynamic' commands", async (t) => {
      const { flagCompletions } = await generateCompletions(["compas", ""]);

      t.equal(flagCompletions.length, 0);
    });

    t.test("are not added on nested 'isDynamic' commands", async (t) => {
      const { flagCompletions } = await generateCompletions([
        "compas",
        "docker",
        "",
      ]);

      t.equal(flagCompletions.length, 0);
    });

    t.test("are added on single dash", async (t) => {
      const { flagCompletions } = await generateCompletions(["compas", "-"]);

      t.ok(flagCompletions.length > 0);
    });

    t.test("existing flags are skipped", async (t) => {
      const { flagCompletions } = await generateCompletions([
        "compas",
        "--timings",
        "",
      ]);

      t.ok(flagCompletions.length > 0);
      t.ok(isNil(flagCompletions.find((it) => it.name === "--timings")));
    });

    t.test("existing flags are skipped with = syntax", async (t) => {
      const { flagCompletions } = await generateCompletions([
        "compas",
        "--timings=true",
        "",
      ]);

      t.ok(flagCompletions.length > 0);
      t.ok(isNil(flagCompletions.find((it) => it.name === "--timings")));
    });

    t.test("file completion is returned", async (t) => {
      const { flagCompletions } = await generateCompletions([
        "compas",
        "migrate",
        "--connection-settings",
        "./",
      ]);

      t.equal(flagCompletions.length, 1);
      t.ok(flagCompletions.find((it) => it.type === "file"));
      t.equal(flagCompletions.length, 1);
    });

    t.test("double 'booleanOrString' completion works", async (t) => {
      const { flagCompletions } = await generateCompletions([
        "compas",
        "docker",
        "clean",
        "--project",
        "--pr",
      ]);

      t.ok(flagCompletions.length > 0);
      t.ok(flagCompletions.find((it) => it.name === "--project"));
    });
  });
});
