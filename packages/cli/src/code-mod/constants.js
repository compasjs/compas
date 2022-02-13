import { cpus } from "os";
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
};
