/* eslint-disable import/no-commonjs */

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Enforce that 'eventStop' is called in async functions that define 'event' as its first parameter.`,
    },
    hasSuggestions: true,

    messages: {
      missingEventStop: `Expected a call to 'eventStop' before this return.`,
      addEventStop: "Add 'eventStop(event)' before the return statement.",
    },
  },

  create(context) {
    let currentFunction;

    function processFunctionStart(node) {
      currentFunction = {
        parent: currentFunction,
        node,
        isAsyncEventFunction: node.async && node.params[0]?.name === "event",
        blocks: [],
      };
    }

    function processFunctionEnd() {
      currentFunction = currentFunction.parent;
    }

    function blockEnter(node) {
      const currentBlock = currentFunction.blocks.at(-1);

      currentFunction.blocks.push({
        node,
        hasEventStop: currentBlock?.hasEventStop ?? false,
        returnStatement: undefined,
      });
    }

    function blockExit(node) {
      const lastBlock = currentFunction.blocks.pop();
      if (!currentFunction.isAsyncEventFunction) {
        return;
      }

      if (
        !lastBlock.returnStatement &&
        (!node.parent?.type.includes("Function") ||
          !currentFunction.isAsyncEventFunction)
      ) {
        return;
      }

      const hasEventStop =
        lastBlock.hasEventStop ||
        (currentFunction.blocks.find((it) => it.hasEventStop)?.hasEventStop ??
          false);

      if (hasEventStop) {
        return;
      }

      context.report({
        node: lastBlock.returnStatement ?? node,
        messageId: "missingEventStop",
        suggest: [
          {
            messageId: "addEventStop",
            fix: (fixer) =>
              fixer.insertTextBefore(
                lastBlock.returnStatement ?? node,
                "eventStop(event);\n",
              ),
          },
        ],
      });
    }

    return {
      // Manage function scopes
      ":function": processFunctionStart,
      ":function:exit": processFunctionEnd,

      // Manage block scopes
      BlockStatement: blockEnter,
      "BlockStatement:exit": blockExit,

      // Check if eventStop is called
      "CallExpression[callee.name='eventStop']"() {
        if (currentFunction.blocks.at(-1)) {
          currentFunction.blocks.at(-1).hasEventStop = true;
        }
      },
      // Check if block has return statement
      ReturnStatement(node) {
        if (currentFunction.blocks.at(-1)) {
          currentFunction.blocks.at(-1).returnStatement = node;
        }
      },

      // Edge cases for inline blocks
      "WhileStatement[body.type='ReturnStatement']"(node) {
        if (!currentFunction.isAsyncEventFunction) {
          return;
        }

        if (currentFunction.blocks.find((it) => it.hasEventStop)) {
          return;
        }

        context.report({
          node: node.body,
          messageId: "missingEventStop",
          suggest: [
            {
              messageId: "addEventStop",
              fix: (fixer) =>
                fixer.insertTextBefore(node.body, "eventStop(event);\n"),
            },
          ],
        });
      },
      "IfStatement[consequent.type='ReturnStatement']"(node) {
        if (!currentFunction.isAsyncEventFunction) {
          return;
        }

        if (currentFunction.blocks.find((it) => it.hasEventStop)) {
          return;
        }

        context.report({
          node: node.consequent,
          messageId: "missingEventStop",
          suggest: [
            {
              messageId: "addEventStop",
              fix: (fixer) =>
                fixer.insertTextBefore(node.consequent, "eventStop(event);\n"),
            },
          ],
        });
      },
      "IfStatement[alternate.type='ReturnStatement']"(node) {
        if (!currentFunction.isAsyncEventFunction) {
          return;
        }

        if (currentFunction.blocks.find((it) => it.hasEventStop)) {
          return;
        }

        context.report({
          node: node.alternate,
          messageId: "missingEventStop",
          suggest: [
            {
              messageId: "addEventStop",
              fix: (fixer) =>
                fixer.insertTextBefore(node.alternate, "eventStop(event);\n"),
            },
          ],
        });
      },
    };
  },
};
