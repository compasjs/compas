/* eslint-disable import/no-commonjs */

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Suggest that the 'event.name' passed to 'eventStart' is a derivative from the function name.`,
    },
    hasSuggestions: true,

    messages: {
      consistentEventName:
        "Use an event name that can be derived from the function name",
      replaceEventName: `Replace value with {{value}}`,
      missingEventStart:
        "Function accepts 'event' as the first argument, but doesn't call 'eventStart'.",
      addEventStart: `Add 'eventStart(event, "")' in your function body.`,
    },
  },

  create(context) {
    let currentFunction;

    function processFunctionStart(node) {
      currentFunction = {
        parent: currentFunction,
        node,
        isAsyncEventFunction:
          node.async && node.id?.name && node.params[0]?.name === "event",
        hasEventStart: false,
        functionName: node.id?.name,
      };
    }

    function processFunctionEnd() {
      if (
        currentFunction?.isAsyncEventFunction &&
        !currentFunction.hasEventStart
      ) {
        context.report({
          node: currentFunction.node.body,
          messageId: "missingEventStart",
          suggest: [
            {
              messageId: "addEventStart",
              data: {},
              fix: function (fixer) {
                return fixer.insertTextBefore(
                  currentFunction.node.body.body[0],
                  `eventStart(event, "");\n  `,
                );
              },
            },
          ],
        });
      }

      currentFunction = currentFunction.parent;
    }

    return {
      // Manage function scopes
      ":function": processFunctionStart,
      ":function:exit": processFunctionEnd,

      // Process `eventStart` calls
      "CallExpression[callee.name='eventStart']"(node) {
        if (!currentFunction?.isAsyncEventFunction) {
          return;
        }

        if (node.arguments?.length !== 2) {
          return;
        }

        currentFunction.hasEventStart = true;

        let value = undefined;
        if (node.arguments[1].type === "Literal") {
          value = node.arguments[1].value;
        }

        if (
          node.arguments[1].type === "TemplateLiteral" &&
          node.arguments[1].expressions.length === 0 &&
          node.arguments[1].quasis.length === 1
        ) {
          value = node.arguments[1].quasis[0].value.raw;
        }

        if (value === null || value === undefined) {
          return;
        }

        const fnNameParts = currentFunction.functionName
          .split(/(?=[A-Z])/)
          .map((it) => it.toLowerCase());
        const validEventNames = calculateValidEventNames(fnNameParts);

        if (validEventNames.includes(value)) {
          return;
        }

        context.report({
          node: node.arguments[1],
          messageId: "consistentEventName",
          suggest: validEventNames.map((it) => {
            return {
              messageId: "replaceEventName",
              data: {
                value: it,
              },
              fix: function (fixer) {
                return fixer.replaceText(node.arguments[1], `"${it}"`);
              },
            };
          }),
        });
      },
    };
  },
};

function calculateValidEventNames(parts) {
  const result = [];

  if (parts.length === 1) {
    return parts;
  }

  for (let i = 1; i < parts.length; ++i) {
    let str = "";

    for (let j = 0; j < parts.length; ++j) {
      if (j === 0) {
        str += parts[j];
      } else if (i === j) {
        str += ".";
        str += parts[j];
      } else {
        str += parts[j][0].toUpperCase() + parts[j].substring(1);
      }
    }

    result.push(str);
  }

  return result;
}
