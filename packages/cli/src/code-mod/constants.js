import { cpus } from "node:os";
import { executeApiClientToExperimentalCodeGen } from "./mods/api-client-to-experimental-code-gen.js";
import { executeLintConfigToEslintPlugin } from "./mods/lint-config-to-eslint-plugin.js";
import { executeUpdateQueriesSignatureChange } from "./mods/update-queries-signature-change.js";

export const PARALLEL_COUNT = Math.max(cpus().length - 1, 1);

/**
 * @type {Record<string, {
 *    description: string,
 *    exec: (logger: Logger) => Promise<void>
 * }>}
 */
export const codeModMap = {
  "update-queries-signature-change": {
    description: `Convert arguments in call sites of generated 'queries.entityUpdate' to pass in the named 'where' and 'update' parameters.
  It also adds 'returning: "*"' if it detects that the result is used, or if it is unable to detect that the return value is unused.

  Inline update & where;
    // old
    await queries.entityUpdate(sql, { /* inline update */ }, { /* inline where  */});
    // new
    await queries.entityUpdate(sql, {
      update: { /* inline update */ },
      where: { /* inline where */ },
    });

  Referenced update & where:
    // old
    await queries.entityUpdate(sql, update, where);
    // new
    await queries.entityUpdate(sql, {
      update,
      where,
    });

  Infer that result is used:
    // old
    const [updatedEntity] = await queries.entityUpdate(sql, update, where);
    // new
    const [updatedEntity] = await queries.entityUpdate(sql, {
      update,
      where,
      returning: "*",
    });

  Or any combination of the above.
`,
    exec: executeUpdateQueriesSignatureChange,
  },
  "lint-config-to-eslint-plugin": {
    description: `Convert all known usages of @compas/lint-config to use @compas/eslint-plugin.

  This only updates the configuration files and does not update the code to be consistent with the newly enforced rules.
`,
    exec: executeLintConfigToEslintPlugin,
  },
  "api-client-to-experimental-code-gen": {
    description: `Convert the project to use experimental code-gen based on a list of structures in '$project/structures.txt'.

  'structures.txt' has the following format;
     https://a.remote.compas.backend -- src/generated
     ./local-openapi.json -- src/generated/foo -- defaultGroup
     
  The code-mode executes the following steps:
    - Resolve and validated 'structures.txt'
    - Resolve all mentioned structures from 'structures.txt'
    - Overwrite 'scripts/generate.mjs'
    - Execute 'scripts/generate.mjs'
    - Try to overwrite as much type usages as possible based on the cleaner type name generation.
    
  Manual cleanup:
    - Remove structures.txt
    - Copy-edit & cleanup 'scripts/generate.mjs'
      - Use environment variables where appropriate
      - Cleanup imports
      - Correct 'targetRuntime' when using React-native.
    - Go through 'mutation' hooks usage & flatten arguments
    `,
    exec: executeApiClientToExperimentalCodeGen,
  },
};
