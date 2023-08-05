/**
 * Set process metadata.
 *
 * @param {{
 *   appName: string,
 *   compasVersion: string,
 * }} metadata
 */
export function tuiStateSetMetadata(metadata: {
  appName: string;
  compasVersion: string;
}): void;
/**
 * Add an information line to the TUI output.
 *
 * Contents added to this information buffer should clarify when and why Compas does
 * certain things.
 *
 * @param {string} information
 */
export function tuiPrintInformation(information: string): void;
/**
 * Consumes the stream printing it to the screen.
 *
 * Internally, it puts the stdout in buffered mode to prevent screen flickering caused by
 * rapid updates.
 *
 * @param {NodeJS.ReadableStream} stream
 * @returns {Promise<void>}
 */
export function tuiAttachStream(stream: NodeJS.ReadableStream): Promise<void>;
/**
 * Set up callbacks for various actions to manage and redraw the TUI.
 */
export function tuiEnable(): void;
//# sourceMappingURL=tui.d.ts.map
