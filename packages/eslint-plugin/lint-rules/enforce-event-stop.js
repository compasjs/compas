/* eslint-disable import/no-commonjs */

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Suggest that 'eventStop' is called in async functions that define 'event' as its first parameter.`,
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
        block: undefined,
      };
    }

    function processFunctionEnd() {
      currentFunction = currentFunction.parent;
    }

    function blockEnter(node) {
      currentFunction.block = {
        node,
        parent: currentFunction.block,
        hasEventStop: currentFunction.block?.hasEventStop ?? false,
        returnStatement: undefined,
        children: [],
      };
      if (currentFunction.block.parent) {
        currentFunction.block.parent.children.push(currentFunction.block);
      }
    }

    function blockExit(node) {
      const block = currentFunction.block;
      currentFunction.block = currentFunction.block?.parent;

      if (!currentFunction.isAsyncEventFunction) {
        return;
      }

      const blocksFound = !(
        block.children.length === 0 &&
        block.node.parent.type.includes("Function")
      );

      const noBareIfStatementFound = !(
        block.node.parent.type.includes("Function") &&
        block.children.length === 1 &&
        block.children[0].node === block.children[0].node.parent?.consequent &&
        block.children[0].returnStatement
      );

      // If there is no return statement, we are not sure if this code path is reachable
      if (!block.returnStatement && blocksFound && noBareIfStatementFound) {
        return;
      }

      const hasEventStop = block.hasEventStop;

      if (hasEventStop) {
        return;
      }

      context.report({
        node: block.returnStatement ?? node,
        messageId: "missingEventStop",
        suggest: block.returnStatement
          ? [
              {
                messageId: "addEventStop",
                fix: (fixer) =>
                  fixer.insertTextBefore(
                    block.returnStatement,
                    "eventStop(event);\n",
                  ),
              },
            ]
          : [],
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
        if (currentFunction.block) {
          currentFunction.block.hasEventStop = true;
        }
      }, // Check if block has return statement
      ReturnStatement(node) {
        if (currentFunction.block) {
          currentFunction.block.returnStatement = node;
        }
      },

      // Edge cases for inline blocks
      "WhileStatement[body.type='ReturnStatement']"(node) {
        if (!currentFunction.isAsyncEventFunction) {
          return;
        }

        if (currentFunction.block.hasEventStop) {
          return;
        }

        context.report({
          node: node.body,
          messageId: "missingEventStop",
          suggest: [
            {
              messageId: "addEventStop",
              fix: (fixer) => {
                fixer.insertTextBefore(node.body, "{\neventStop(event);\n");
                fixer.insertTextAfter(node.body, "}");
              },
            },
          ],
        });
      },
      "IfStatement[consequent.type='ReturnStatement']"(node) {
        if (!currentFunction.isAsyncEventFunction) {
          return;
        }

        if (currentFunction.block.hasEventStop) {
          return;
        }

        context.report({
          node: node.consequent,
          messageId: "missingEventStop",
          suggest: [
            {
              messageId: "addEventStop",
              fix: (fixer) => {
                fixer.insertTextBefore(
                  node.consequent,
                  "{\neventStop(event);\n",
                );
                fixer.insertTextAfter(node.consequent, "}");
              },
            },
          ],
        });
      },
      "IfStatement[alternate.type='ReturnStatement']"(node) {
        if (!currentFunction.isAsyncEventFunction) {
          return;
        }

        if (currentFunction.block.hasEventStop) {
          return;
        }

        context.report({
          node: node.alternate,
          messageId: "missingEventStop",
          suggest: [
            {
              messageId: "addEventStop",
              fix: (fixer) => {
                fixer.insertTextBefore(
                  node.alternate,
                  "{\neventStop(event);\n",
                );
                fixer.insertTextAfter(node.alternate, "}");
              },
            },
          ],
        });
      },
    };
  },
};
