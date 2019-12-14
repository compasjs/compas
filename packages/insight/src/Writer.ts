import WriteStream = NodeJS.WriteStream;
import { isNil } from "@lightbase/stdlib";
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
  private static withColor = (level: LogLevel, message: string) =>
    level === LogLevel.Info
      ? `\x1b[34m${message}\x1b[39m`
      : `\x1b[31m${message}\x1b[39m`;

  /**
   * Pretty printer
   * Special case support for:
   *  - timestamp
   *  - level
   *  - type
   *  - message
   */
  public write(data: any) {
    const { level, timestamp, message, type, ...rest } = data || {};

    this.stream.write(DevWriter.formatTime(timestamp));

    if (!isNil(type)) {
      this.stream.write(
        DevWriter.withColor(level as LogLevel, ` ${level}[${type}]`),
      );
    } else {
      this.stream.write(DevWriter.withColor(level as LogLevel, ` ${level}`));
    }

    if (!isNil(message)) {
      this.stream.write(" " + message);
    }

    if (Object.keys(rest).length > 0) {
      this.stream.write(
        " " +
          inspect(rest, {
            colors: true,
            depth: null,
          }),
      );
    }

    this.stream.write("\n");
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
