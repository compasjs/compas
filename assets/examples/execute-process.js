import { exec, mainFn, spawn } from "@lbu/stdlib";

mainFn(import.meta, main);

async function main(logger) {
  // Use scopes so we can reuse variables
  {
    /// [howto-exec]
    const { stdout, stderr, exitCode } = await exec("echo 'foo'");
    // stdout => "foo\n"
    // stderr => ""
    // exitCode => 0
    /// [howto-exec]

    logger.info({
      stdout,
      stderr,
      exitCode,
    });
  }

  {
    /// [howto-spawn]
    const { exitCode } = await spawn("echo", ["bar"]);
    // Outputs "bar\n" on stdout
    // exitCode => 0
    /// [howto-spawn]

    logger.info({
      exitCode,
    });
  }
}
