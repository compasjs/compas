/* eslint-disable import/no-commonjs */

const { builtinModules } = require("node:module");

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Suggest that imports of Node.js builtin modules use the 'node:' specifier.`,
    },
    fixable: "code",
    hasSuggestions: true,

    messages: {
      consistentImport: `Always use the 'node:' specifier when importing Node.js builtins.`,
      replaceImport: `Replace '{{value}}' with 'node:{{value}}'`,
    },
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (!builtinModules.includes(node.source.value)) {
          return;
        }

        context.report({
          node: node,
          messageId: "consistentImport",
          fix: (fixer) =>
            fixer.replaceText(node.source, `"node:${node.source.value}"`),
          suggest: [
            {
              messageId: "replaceImport",
              data: {
                value: node.source.value,
              },
              fix: (fixer) =>
                fixer.replaceText(node.source, `"node:${node.source.value}"`),
            },
          ],
        });
      },
    };
  },
};
