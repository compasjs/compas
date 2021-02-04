/**
 * If errors are present, they are printed and the process is exited.
 * Else this function will just return
 *
 * @param {CodeGenContext} context
 */
export function exitOnErrorsOrReturn(context) {
  if (context.errors.length === 0) {
    return;
  }

  const formatArray = [""];

  for (let i = 0; i < context.errors.length; i++) {
    const error = context.errors[i];
    let str = `- (${i + 1}/${context.errors.length}): `;

    if (error.key === "sqlEnableValidator") {
      str += `Validator generator not enabled. The sql generator requires this.
  Please add 'validator' to the 'App.generate({ enabledGenerators: ["sql"] })' array.`;
    } else if (error.key === "sqlThrowingValidators") {
      str += `Option 'throwingValidators' not enabled. The sql generator requires this.
  Please add 'throwingValidators' to the 'App.generate({ throwingValidators: true })' call.`;
    } else if (error.key === "sqlMissingPrimaryKey") {
      str += `Type '${error.typeName}' is missing a primary key.
  Either remove 'withPrimaryKey' from the options passed to 'enableQueries()' or add 'T.uuid().primary()' / 'T.number().primary()' to your type.
`;
    } else if (error.key === "sqlForgotEnableQueries") {
      str += `Type '${error.typeName}' did not call 'enableQueries' but '${error.referencedByType}' has a relation to it.
  Call 'enableQueries()' on '${error.typeName}' or remove the relation from '${error.referencedByType}'.
`;
    } else if (error.key === "sqlMissingOneToMany") {
      str += `Relation from '${error.referencedByType}' is missing the inverse 'T.oneToMany()' on '${error.typeName}'.
  Add 'T.oneToMany("${error.relationOwnKey}", T.reference("${error.referencedByGroup}", "${error.referencedByType}"))' to the 'relations()' call on '${error.typeName}'.
`;
    } else if (error.key === "sqlUnusedOneToMany") {
      str += `Relation defined for '${error.type}', referencing '${error.referencedType}' via '${error.ownKey}' is unnecessary.
  Remove it or add the corresponding 'T.manyToOne()' call to '${error.referencedType}'.`;
    } else if (error.key === "sqlDuplicateShortName") {
      str += `Short name '${error.shortName}' is used by both '${error.firstName}' and '${error.secondName}'.
  These short name values should be unique. Please call '.shortName()' on one or both of these types to set a custom value.`;
    } else if (error.key === "coreReservedGroupName") {
      str += `Group '${error.groupName}' is a JavaScript or TypeScript reserved keyword. Please use another group name.`;
    } else {
      str += `[${error.key}]: ${JSON.stringify(error, null, 2)}`;
    }

    formatArray.push(str);
  }

  context.logger.error(formatArray.join("\n"));
  process.exit(1);
}
