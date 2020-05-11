import { isNil, isPlainObject, merge } from "@lbu/stdlib";
import { isNamedTypeBuilderLike } from "./types/index.js";
import { isReferenceTypeWithField } from "./types/TypeBuilder.js";
import { upperCaseFirst } from "./utils.js";

/**
 * Create a js-reference for reference types
 * @param structure
 * @param value
 */
export function recursiveLinkupReferences(structure, value) {
  if (isNil(value) || (!isPlainObject(value) && !Array.isArray(value))) {
    // Skip primitives & null / undefined
    return;
  }

  if (
    isPlainObject(value) &&
    value.type &&
    value.type === "reference" &&
    isPlainObject(value.reference)
  ) {
    const { group, name } = value.reference;
    if (!isNil(structure[group]?.[name])) {
      if (isNil(value.reference.field)) {
        value.referencedItem = structure[group][name];
      } else {
        const otherValue = structure[group][name];
        if (isNil(otherValue) || otherValue.type !== "object") {
          throw new Error(
            `Can't resolve a field reference to ${otherValue.uniqueName}, which is not an object but a ${otherValue.type}.`,
          );
        }

        if (isNil(otherValue.keys[value.reference.field.referencing])) {
          throw new Error(
            `Referenced field ${value.reference.field.referencing} does not exists on ${otherValue.uniqueName}`,
          );
        }

        value.referencedItem =
          otherValue.keys[value.reference.field.referencing];
      }
    }
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      recursiveLinkupReferences(structure, value[key]);
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      recursiveLinkupReferences(structure, value[i]);
    }
  }
}

/**
 * Should always return all variants of it's own
 * @param structure
 * @param context
 * @param value
 */
export function recursivelyApplyReferenceFieldsAsReferences(
  structure,
  context = {
    stack: [],
  },
  value,
) {
  if (isNil(value) || (!isPlainObject(value) && !Array.isArray(value))) {
    // Skip primitives & null / undefined
    return;
  }

  if (isReferenceTypeWithField(value)) {
    const valueCopy = merge({}, value);

    // Remove field, all copies will be a plain reference
    valueCopy.replacement = valueCopy.reference.field.replacement;
    delete valueCopy.reference.field;

    const referencedValue =
      structure[value.reference.group]?.[value.reference.name];

    if (
      !referencedValue.variants &&
      context.stack.indexOf(referencedValue.uniqueName === -1)
    ) {
      // Handle referenced item first
      // Except when it's a recursive type than we skip it here
      context.stack.push(referencedValue.uniqueName);
      // Ignore the result here, since named values will always return an empty array
      recursivelyApplyReferenceFieldsAsReferences(
        structure,
        context,
        referencedValue,
      );
      context.stack.pop();
    }

    // The default copies: 1 reference with field, 1 reference without field
    const result = [
      { withNames: [], item: value },
      {
        withNames: [
          { group: referencedValue.group, name: referencedValue.name },
        ],
        item: valueCopy,
      },
    ];

    // If the referenced model has variants, add them as will, with the correct name
    if (isNil(referencedValue?.variants)) {
      return result;
    }

    for (const v of referencedValue.variants) {
      const { withNames } = v;
      result.push({
        withNames: [
          {
            group: valueCopy.reference.group,
            name: valueCopy.reference.name,
          },
          ...withNames,
        ],
        item: merge({}, valueCopy, {
          reference: buildName(
            valueCopy.reference.group,
            valueCopy.reference.name,
            withNames,
          ),
        }),
      });
    }

    return result;
  }

  const collectedVariants = {};

  // collect variants in an object
  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      collectedVariants[key] = recursivelyApplyReferenceFieldsAsReferences(
        structure,
        context,
        value[key],
      );
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      collectedVariants[i] = recursivelyApplyReferenceFieldsAsReferences(
        structure,
        context,
        value[i],
      );
    }
  }

  // Cleanup empty variant states
  for (const key of Object.keys(collectedVariants)) {
    if (isNil(collectedVariants[key]) || collectedVariants[key].length === 0) {
      delete collectedVariants[key];
    }
  }

  if (Object.keys(collectedVariants).length === 0) {
    return;
  }

  const result = [];
  // Generate all combinations of variants
  for (const variant of generateObjectWithArrayVariants(collectedVariants)) {
    const intermediate = {
      withNames: [],
      item: merge({}, value),
    };

    for (const key of Object.keys(variant)) {
      intermediate.withNames = intermediate.withNames.concat(
        variant[key].withNames,
      );

      let newKey = key;
      // Use the replacement value if present.
      // eg. userId can become user
      if (variant?.[key]?.item?.replacement) {
        delete intermediate.item[key];
        newKey = variant?.[key]?.item?.replacement;
      }
      intermediate.item[newKey] = variant[key].item;
    }

    result.push(intermediate);
  }

  if (isNamedTypeBuilderLike(value)) {
    // add variants to the structure

    value.variants = [];

    // Add all alternative results to structure
    for (const item of result) {
      if (item.withNames.length === 0) {
        continue;
      }

      const newValue = item.item;
      const { group, name, uniqueName } = buildName(
        newValue.group,
        newValue.name,
        item.withNames,
      );
      newValue.group = group;
      newValue.name = name;
      newValue.uniqueName = uniqueName;

      structure[value.group][newValue.name] = newValue;

      value.variants.push({
        group: newValue.group,
        name: newValue.name,
        withNames: [...item.withNames],
      });
    }

    return [];
  }

  return result;
}

/**
 *
 * @param {string} group
 * @param {string} name
 * @param {{group: string, name: string}[]} withNames
 * @return {{group: string, name: string, uniqueName: string}}
 */
function buildName(group, name, withNames) {
  const result = {
    group,
    name,
    uniqueName: undefined,
  };

  let lastGroup = group;
  let didWith = false;

  for (const extraName of withNames) {
    result.name += didWith ? "And" : "With";
    didWith = true;

    if (lastGroup !== extraName.group) {
      result.name += upperCaseFirst(extraName.group);
    }
    result.name += upperCaseFirst(extraName.name);
  }

  result.uniqueName =
    upperCaseFirst(result.group) + upperCaseFirst(result.name);

  return result;
}

// Yeey JavaScript
// Input: { foo: [1, 2], bar: [ true, false ] }
// Output: [{foo: 1, bar: true }, { foo: 1, bar: false }, {foo: 2, bar: true }, { foo: 2,
// bar: false } ]
function generateObjectWithArrayVariants(obj) {
  return (function recurse(keys) {
    if (!keys.length) {
      return [{}];
    }
    let result = recurse(keys.slice(1));
    return obj[keys[0]].reduce(
      (acc, value) =>
        acc.concat(result.map((item) => ({ ...item, [keys[0]]: value }))),
      [],
    );
  })(Object.keys(obj));
}
