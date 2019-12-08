import WriteStream = NodeJS.WriteStream;
import { inspect } from "util";
import { LogLevel } from "./types";

/**
 * Writes the log to the provided output stream
 */
export class Writer {
  /**
   * @param stream Writeable stream, by default stdout
   * @param shouldCloseOnExit If the logger should close this stream. Note depending on the
   *   order of exit handlers another exit handler could try to log something, which may
   *   result in a WRITE_AFTER_END error
   */
  public constructor(
    protected stream: WriteStream = process.stdout,
    shouldCloseOnExit = false,
  ) {
    if (shouldCloseOnExit) {
      process.on("exit", () => {
        stream.end();
      });
    }
  }

  public write(data: any) {
    this.stream.write(JSON.stringify(data) + "\n");
  }
}

/**
 * Pretty print writter, with special handling for logLevel, timestamp and message
 */
export class DevWriter extends Writer {
  private static COLORED_LEVEL = {
    [LogLevel.Info]: `\x1b[34m${LogLevel.Info}\x1b[39m`,
    [LogLevel.Error]: `\x1b[31m${LogLevel.Error}\x1b[39m`,
  };

  public write(data: any) {
    const { level, timestamp, message, ...rest } = data || {};

    const hasRestObject = Object.keys(rest).length > 0;

    this.stream.write(
      `${DevWriter.formatTime(timestamp)} ${
        DevWriter.COLORED_LEVEL[level as LogLevel]
      }${message ? " " + message : ""}${
        !hasRestObject ? "" : " " + inspect(rest, { colors: true, depth: null })
      }\n`,
    );
  }

  private static formatTime(input: number): string {
    const time = new Date(input);

    const h = time
      .getHours()
      .toString(10)
      .padStart(2, "0");
    const m = time
      .getMinutes()
      .toString(10)
      .padStart(2, "0");
    const s = time
      .getSeconds()
      .toString(10)
      .padStart(2, "0");
    const ms = time
      .getMilliseconds()
      .toString(10)
      .padStart(3, "0");

    return `${h}:${m}:${s}.${ms}`;
  }
}
