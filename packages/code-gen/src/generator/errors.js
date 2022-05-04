import { getHashForString } from "../utils.js";

/**
 * If errors are present, they are printed and the process is exited.
 * Else this function will just return
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function exitOnErrorsOrReturn(context) {
  const errorHashes = new Set();
  const skippedErrors = [];

  for (let i = 0; i < context.errors.length; ++i) {
    const hash = getHashForString(JSON.stringify(context.errors[i]));
    if (errorHashes.has(hash)) {
      skippedErrors.push(i);
      continue;
    }

    errorHashes.add(hash);
  }

  for (const removeIdx of skippedErrors.reverse()) {
    context.errors.splice(removeIdx, 1);
  }

  if (context.errors.length === 0) {
    return;
  }

  const formatArray = [""];

  for (let i = 0; i < context.errors.length; i++) {
    /** @type {CodeGenCollectableError} */
    const error = context.errors[i];
    let str = `- (${i + 1}/${context.errors.length}): `;

    switch (error.key) {
      case "structureReservedGroupName":
        str += `Group '${error.groupName}' is a JavaScript or TypeScript reserved keyword. Please use another group name.`;
        break;

      case "structureUnknownOrEmptyGroup":
        str += `Group '${error.groupName}' is provided in 'enabledGenerators' but does not exists or does not contain any type.`;
        break;

      case "sqlEnableValidator":
        str += `Validator generator not enabled. The sql generator requires this.
  Please add 'validator' to the 'App.generate({ enabledGenerators: ["sql"] })' array.`;
        break;

      case "sqlMissingPrimaryKey":
        str += `Type '${error.typeName}' is missing a primary key.
  Either remove 'withPrimaryKey' from the options passed to 'enableQueries()' or add 'T.uuid().primary()' / 'T.number().primary()' to your type.
`;
        break;

      case "sqlForgotEnableQueries":
        str += `Type '${error.typeName}' did not call 'enableQueries' but '${error.referencedByType}' has a relation to it.
  Call 'enableQueries()' on '${error.typeName}' or remove the relation from '${error.referencedByType}'.
`;
        break;

      case "sqlDuplicateRelationOwnKey":
        str += `Type '${error.type}' has multiple relations with the same own key '${error.relationKey}'.
  Please use unique own keys.
`;
        break;

      case "sqlReservedObjectKey":
        str += `Type '${error.type}' recursively uses the reserved key '${
          error.reservedKey
        }'.
  Use '${error.reservedKey.substring(1)}' instead.
`;

        break;

      case "sqlDuplicateRelationReferencedKey":
        str += `There are multiple relations to '${error.type}'.'${error.relationKey}'.
  Make sure that they all have their own unique referenced key.
`;
        break;

      case "sqlMissingOneToMany":
        str += `Relation from '${error.referencedByType}' is missing the inverse 'T.oneToMany()' on '${error.typeName}'.
  Add 'T.oneToMany("${error.relationOwnKey}", T.reference("${error.referencedByGroup}", "${error.referencedByType}"))' to the 'relations()' call on '${error.typeName}'.
`;
        break;

      case "sqlUnusedOneToMany":
        str += `Relation defined for '${error.type}', referencing '${error.referencedType}' via '${error.ownKey}' is unnecessary.
  Remove it or add the corresponding 'T.manyToOne()' call to '${error.referencedType}'.`;
        break;

      case "sqlDuplicateShortName":
        str += `Short name '${error.shortName}' is used by both '${error.firstName}' and '${error.secondName}'.
  These short name values should be unique. Please call '.shortName()' on one or both of these types to set a custom value.`;
        break;

      case "sqlReservedRelationKey":
        str += `Relation name '${error.ownKey}' from type '${error.type}' is a reserved keyword. Use another relation name.`;
        break;

      case "routerUnknownInvalidationTarget":
        str += `Invalidation from '${
          error.from
        }' specifies an invalid target (group: '${error.target.group}'${
          error.target.name ? `, name: '${error.target.name}'` : ""
        }).
  Valid targets are 'R.get()' and 'R.post().idempotent()' routes.`;
        break;

      case "routerIncorrectlySpecifiedInvalidation":
        str += `Invalidation from '${error.from}' to '(group: '${
          error.target.group
        }'${
          error.target.name ? `, name: '${error.target.name}'` : ""
        })' has an invalid specification.
  The specified source ([${error.sourcePropertyPath.join(
    ", ",
  )}]) or target ('${error.targetPropertyPath.join(".")}') does not exist.
  Both should be defined on their appropriate routes. See the docs for the constraints.`;
        break;

      default:
        str += `[${error["key"] ?? "unknown"}]: ${JSON.stringify(
          error,
          null,
          2,
        )}`;
        break;
    }

    formatArray.push(str);
  }

  // @ts-ignore
  context.logger.error(formatArray.join("\n"));
  process.exit(1);
}
