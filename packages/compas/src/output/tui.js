import { emitKeypressEvents } from "node:readline";
import * as readline from "node:readline";
import { AppError } from "@compas/stdlib";
import ansi from "ansi";
import { debugPrint } from "./debug.js";

/**
 * @type {import("ansi").Cursor}
 */
let cursor;

const MAX_NUMBER_OF_INFO_LINES = 10;

// TODO: Use a virtual buffer in combination with node-pty.
//  This allows us to keep information at the bottom of the screen like in earlier
//  screenshots. To do this, we need some way to translate ansi escape sequences with an
//  offset and have a stable API for where the cursor will be.

/**
 * @type {{
 *   isEnabled: boolean,
 *   metadata: {
 *     compasVersion: string,
 *     appName: string,
 *   },
 *   informationBuffer: string[],
 *   ghostOutputLineCount: number,
 *   dynamicActions: ({
 *     title: string,
 *     actions: {
 *       name: string,
 *       shortcut: string,
 *       callback: () => (void|Promise<void>),
 *     }[],
 *   })[],
 *   dynamicActionsComputed: {
 *     longestShortcut: number,
 *     longestName: number,
 *   },
 * }}
 */
const tuiState = {
  isEnabled: false,
  metadata: {
    appName: "unknown",
    compasVersion: "Compas (unknown)",
  },
  informationBuffer: [],
  ghostOutputLineCount: 0,

  dynamicActions: [],
  dynamicActionsComputed: {
    longestName: 0,
    longestShortcut: 0,
  },
};

/**
 * Set process metadata and repaint.
 *
 * @param {{
 *   appName: string,
 *   compasVersion: string,
 * }} metadata
 */
export function tuiStateSetMetadata(metadata) {
  tuiState.metadata = {
    ...tuiState.metadata,
    ...metadata,
  };

  if (tuiState.isEnabled) {
    tuiPaintLayout();
  }
}

/**
 * Set the available actions.
 *
 * @param {(typeof tuiState)["dynamicActions"]} actions
 */
export function tuiStateSetAvailableActions(actions) {
  tuiState.dynamicActions = actions;

  let longestName = 0;
  let longestShortcut = 0;

  for (const group of actions) {
    for (const action of group.actions) {
      longestName = Math.max(longestName, action.name.length);
      longestShortcut = Math.max(longestShortcut, action.shortcut.length);
    }
  }

  tuiState.dynamicActionsComputed = {
    longestName: longestName + 4,
    longestShortcut,
  };
  debugPrint(tuiState.dynamicActionsComputed);
}

/**
 * Add an information line to the TUI output.
 *
 * Contents added to this information buffer should clarify when and why Compas does
 * certain things. We only keep the last 10 messages, regardless if they are multi-line
 * or not.
 *
 * We automatically repaint when the system is enabled.
 *
 * @param {string} information
 */
export function tuiPrintInformation(information) {
  tuiState.informationBuffer.push(information.trim());
  debugPrint(`[tui] ${information}`);

  // Let go of old information, that we for sure will never print again
  while (tuiState.informationBuffer.length > 10) {
    tuiState.informationBuffer.shift();
  }

  if (tuiState.isEnabled) {
    tuiPaintLayout();
  }
}

/**
 * Executes callback with the ANSI cursor. Make sure to call `tuiClearLayout` before
 * attempting to call this function.
 *
 * In contrast to {@link tuiPrintInformation} these lines persist in the output. So
 * should be used around useful context when executing actions.
 *
 * @param {(cursor: import("ansi").Cursor) => *} callback
 */
export function tuiWritePersistent(callback) {
  if (tuiState.ghostOutputLineCount !== 0 || !tuiState.isEnabled) {
    throw AppError.serverError({
      message:
        "Can only write persistent if the tui is enabled and the information is cleared.",
    });
  }

  cursor.reset().buffer();
  callback(cursor);
  cursor.reset().flush();
}

/**
 * Set up callbacks for various actions to manage and redraw the TUI.
 */
export function tuiEnable() {
  cursor = ansi(process.stdout);
  tuiState.isEnabled = true;

  // General setup
  cursor.reset();
  cursor.hide();

  // Do the initial render
  tuiPaintLayout();

  // Exit listeners
  process.on("SIGABRT", () => {
    tuiExit();
  });
  process.on("SIGINT", () => {
    tuiExit();
  });
  process.on("beforeExit", () => {
    tuiExit();
  });

  // Resize listener
  // process.stdout.on("resize", () => tuiPaintLayout());

  // Input setup + listener
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", (char, raw) => {
    if (raw.name === "c" && raw.ctrl) {
      // Ctrl + C
      tuiExit();
    }

    tuiOnKeyPress(raw);
  });
}

/**
 * Go through all actions in order and match the keypress name with the configured
 * actions.
 *
 * @param {*} keypress
 */
export function tuiOnKeyPress(keypress) {
  if (!keypress.name) {
    return;
  }

  // Rename a few keypress for easier matching, we may want to expand this setup later.
  if (keypress.name === "escape") {
    keypress.name = "esc";
  }

  for (const actionGroup of tuiState.dynamicActions) {
    for (const action of actionGroup.actions) {
      if (action.shortcut.toLowerCase() === keypress.name.toLowerCase()) {
        action.callback();
        return;
      }
    }
  }
}

/**
 * Cleanup the screen and exit.
 */
export function tuiExit() {
  cursor.buffer();

  // show the cursor position, it's pretty strange when that gets lost on ya.
  cursor.show();

  tuiEraseLayout();

  cursor.reset();
  cursor.flush();

  process.stdin.setRawMode(false);
  process.exit(1);
}

/**
 * Write out information and actions + the known metadata.
 */
export function tuiPaintLayout() {
  tuiEraseLayout();

  cursor.reset();
  cursor.buffer();

  // Keep track of the line count, so we can easily clear the screen when necessary.
  // For this to work correctly, we shouldn't use any custom cursor movements in this
  // function, so `ansi` can keep track of `\n` and return an accurate value.
  const newlineCountStart = cursor.newlines;

  cursor
    .blue()
    .write(tuiState.metadata.appName)
    .reset()
    .write(" running with ")
    .green()
    .write(tuiState.metadata.compasVersion)
    .reset()
    .write("\n");

  // Split up the lines to be nicely printed on screen.
  // We handle new lines and split on spaces when necessary.
  const linesToWrite = [];
  const maxLineWidth = process.stdout.columns;

  // Loop through the buffer in reverse, so we always handle the latest messages first
  for (let i = tuiState.informationBuffer.length - 1; i >= 0; i--) {
    let infoLine = tuiState.informationBuffer[i];
    const lineParts = [];

    while (infoLine.length) {
      const newLineIndex = infoLine.indexOf("\n");
      const spaceIndex = infoLine.lastIndexOf(
        " ",
        newLineIndex === -1
          ? maxLineWidth
          : Math.min(newLineIndex, newLineIndex),
      );
      const part = infoLine.slice(
        0,
        newLineIndex === -1
          ? infoLine.length > maxLineWidth
            ? spaceIndex
            : maxLineWidth
          : Math.min(newLineIndex, process.stdout.columns),
      );

      infoLine = infoLine.slice(part.length).trimStart();
      lineParts.push(part);
    }

    // This automatically reverses the array.
    linesToWrite.unshift(...lineParts);

    if (linesToWrite.length >= MAX_NUMBER_OF_INFO_LINES) {
      break;
    }
  }

  // We always add all parts, so we may need to truncate the last added message (the
  // oldest).
  while (linesToWrite.length > MAX_NUMBER_OF_INFO_LINES) {
    linesToWrite.shift();
  }

  for (const line of linesToWrite) {
    cursor.write(line).write("\n");
  }

  if (tuiState.dynamicActions.length) {
    cursor.write("\n");
  }

  for (const actionGroup of tuiState.dynamicActions) {
    cursor.write(`${actionGroup.title}\n`);

    const shallowCopy = [...actionGroup.actions];

    // Write all actions in 2 column mode.
    // The widths are based on the longest available shortcut and name.
    while (shallowCopy.length) {
      const pop1 = shallowCopy.shift();
      const pop2 = shallowCopy.shift();

      if (!pop1) {
        break;
      }

      cursor
        .reset()
        .write("    ")
        .green()
        .write(
          " ".repeat(
            tuiState.dynamicActionsComputed.longestShortcut -
              pop1.shortcut.length,
          ) + pop1.shortcut,
        )
        .reset()
        .write(
          ` ${pop1.name}${" ".repeat(
            tuiState.dynamicActionsComputed.longestName - pop1.name.length,
          )}`,
        );

      if (!pop2) {
        // May be undefined with an odd number of actions.
        cursor.write("\n");
        break;
      }

      cursor
        .reset()
        .green()
        .write(
          " ".repeat(
            tuiState.dynamicActionsComputed.longestShortcut -
              pop2.shortcut.length,
          ) + pop2.shortcut,
        )
        .reset()
        .write(
          ` ${pop2.name}${" ".repeat(
            tuiState.dynamicActionsComputed.longestName - pop2.name.length,
          )}\n`,
        );
    }
  }

  cursor.flush();

  // @ts-expect-error
  tuiState.ghostOutputLineCount = cursor.newlines - newlineCountStart;
}

/**
 * Clean up intermediate tui output. This should be done before spawning a process.
 */
export function tuiEraseLayout() {
  cursor.reset();

  if (tuiState.ghostOutputLineCount) {
    readline.moveCursor(process.stdout, 0, -tuiState.ghostOutputLineCount);
    cursor.eraseData().eraseLine();
  }

  tuiState.ghostOutputLineCount = 0;
}
