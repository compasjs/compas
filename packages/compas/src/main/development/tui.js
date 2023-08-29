import * as readline from "node:readline";
import { emitKeypressEvents } from "node:readline";

/**
 * Setup cursor, stdin and stdout
 *
 * @param {import("./state.js").State} state
 */
export function tuiInit(state) {
  // General setup
  state.cursor.reset();
  state.cursor.hide();

  // Exit listeners
  process.on("SIGABRT", () => {
    state.exit();
  });
  process.on("SIGINT", () => {
    state.exit();
  });
  process.on("beforeExit", () => {
    state.exit();
  });

  process.stdout.on("resize", () => state.resizeScreen());

  // Input setup + listener
  process.stdin.setRawMode(true);
  emitKeypressEvents(process.stdin);

  process.stdin.on("keypress", (char, raw) => {
    if (raw.name === "c" && raw.ctrl) {
      // Ctrl + C
      state.exit();
      return;
    }

    state.emitKeypress(raw);
  });
}

/**
 * Reset cursor, stdin and stdout
 *
 * @param {import("./state.js").State} state
 */
export function tuiExit(state) {
  state.cursor.buffer();
  state.cursor.show();

  state.clearScreen();

  state.cursor.reset();
  state.cursor.flush();
  process.stdin.setRawMode(false);
}

/**
 * Clear the number of ghost output lines.
 *
 * @param {import("./state.js").State} state
 * @param {number} ghostOutputLineCount
 */
export function tuiClearScreen(state, ghostOutputLineCount) {
  state.cursor.reset();

  if (ghostOutputLineCount) {
    readline.moveCursor(process.stdout, 0, -ghostOutputLineCount);
    state.cursor.eraseData().eraseLine();
  }
}

/**
 *
 * @param {import("./state.js").State} state
 * @param {{
 *   appName: string,
 *   compasVersion: string,
 *   information: string[],
 *   actionGroups: {
 *     title: string,
 *     actions: { shortcut: string, name: string }[]
 *   }[],
 * }} data
 * @returns {number} ghostOutputLineCount
 */
export function tuiPaint(state, data) {
  let longestName = 0;
  let longestShortcut = 0;

  for (const group of data.actionGroups) {
    for (const action of group.actions) {
      longestName = Math.max(longestName, action.name.length);
      longestShortcut = Math.max(longestShortcut, action.shortcut.length);
    }
  }

  state.cursor.reset();
  state.cursor.buffer();

  // Keep track of the line count, so we can easily clear the screen when necessary.
  // For this to work correctly, we shouldn't use any custom cursor movements in this
  // function, so `ansi` can keep track of `\n` and return an accurate value.
  const newlineCountStart = state.cursor.newlines;

  state.cursor
    .blue()
    .write(data.appName)
    .reset()
    .write(" running with ")
    .green()
    .write(data.compasVersion)
    .reset()
    .write("\n");

  // Split up the lines to be nicely printed on screen.
  // We handle new lines and split on spaces when necessary.
  const linesToWrite = [];
  const maxLineWidth = process.stdout.columns;

  // Loop through the buffer in reverse, so we always handle the latest messages first
  for (let i = data.information.length - 1; i >= 0; i--) {
    let infoLine = data.information[i];
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
  }

  for (const line of linesToWrite) {
    state.cursor.write(line).write("\n");
  }

  if (data.actionGroups.length) {
    state.cursor.write("\n");
  }

  for (const actionGroup of data.actionGroups) {
    state.cursor.write(`${actionGroup.title}\n`);

    const shallowCopy = [...actionGroup.actions];

    // Write all actions in 2 column mode.
    // The widths are based on the longest available shortcut and name.
    while (shallowCopy.length) {
      const pop1 = shallowCopy.shift();
      const pop2 = shallowCopy.shift();

      if (!pop1) {
        break;
      }

      state.cursor
        .reset()
        .write("    ")
        .green()
        .write(
          " ".repeat(longestShortcut - pop1.shortcut.length) + pop1.shortcut,
        )
        .reset()
        .write(` ${pop1.name}${" ".repeat(longestName - pop1.name.length)}`);

      if (!pop2) {
        // May be undefined with an odd number of actions.
        state.cursor.write("\n");
        break;
      }

      state.cursor
        .reset()
        .green()
        .write(
          " ".repeat(longestShortcut - pop2.shortcut.length) + pop2.shortcut,
        )
        .reset()
        .write(` ${pop2.name}${" ".repeat(longestName - pop2.name.length)}\n`);
    }
  }

  state.cursor.flush();

  // @ts-expect-error
  return state.cursor.newlines - newlineCountStart;
}
