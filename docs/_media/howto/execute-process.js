import { exec, mainFn, spawn } from "@lbu/stdlib";

mainFn(import.meta, main);

async function main(logger) {
  // Use scopes so we can reuse variables
  {
    /// [exec]
    const { stdout, stderr, exitCode } = await exec("echo 'foo'");
    // stdout => "foo\n"
    // stderr => ""
    // exitCode => 0
    /// [exec]

    logger.info({
      stdout,
      stderr,
      exitCode,
    });
  }

  {
    /// [spawn]
    const { exitCode } = await spawn("echo", ["bar"]);
    // Outputs "bar\n" on stdout
    // exitCode => 0
    /// [spawn]

    logger.info({
      exitCode,
    });
  }
}
