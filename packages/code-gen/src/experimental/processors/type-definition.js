import { AppError, isNil } from "@compas/stdlib";
import { isNamedTypeBuilderLike } from "../../builders/index.js";
import { stringFormatNameForError } from "../string-format.js";
import {
  structureAddType,
  structureCreateReference,
  structureExtractReferences,
  structureIncludeReferences,
  structureResolveReference,
  structureValidateReferenceForType,
} from "./structure.js";

/**
 * Implementations for structure behaviors per type. It should be used in stead of
 * switching per type. Adding support for new behavior is then limited to this file only.
 *
 * Not all types need to support each operation, these will still be written out with
 * empty functions.
 *
 * @type {Record<
 *   import("../generated/common/types").ExperimentalTypeDefinition["type"],
 *   {
 *     structureExtractReferences: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition,
 *     ) => import("../generated/common/types").ExperimentalTypeDefinition|undefined,
 *     structureIncludeReferences: (
 *        fullStructure: import("../generated/common/types").ExperimentalStructure,
 *        newStructure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition,
 *     ) => void,
 *     structureValidateReferenceForType: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition|undefined,
 *        parentTypeStack: string[],
 *     ) => void,
 *   }
 * >}
 */
export const typeDefinitionHelpers = {
  any: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "any") {
        return;
      }

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  anyOf: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "anyOf") {
        return;
      }

      for (let i = 0; i < type.values.length; i++) {
        type.values[i] = structureExtractReferences(structure, type.values[i]);
      }

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type?.type !== "anyOf") {
        return;
      }

      for (const value of type.values) {
        structureIncludeReferences(fullStructure, newStructure, value);
      }
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type?.type !== "anyOf") {
        return;
      }

      parentTypeStack.push(stringFormatNameForError(type));

      for (const value of type.values) {
        // Whe need to give copies of the parentTypeStack to each recursive call. Each
        // call normally mutates the provided stack, but since we are going in separate
        // trees, they will mutate each other.
        structureValidateReferenceForType(structure, value, [
          ...parentTypeStack,
        ]);
      }
    },
  },
  array: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "array") {
        return;
      }

      type.values = structureExtractReferences(structure, type.values);

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type?.type !== "array") {
        return;
      }

      structureIncludeReferences(fullStructure, newStructure, type.values);
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type?.type !== "array") {
        return;
      }

      parentTypeStack.push(stringFormatNameForError(type));

      structureValidateReferenceForType(
        structure,
        type.values,
        parentTypeStack,
      );
    },
  },
  boolean: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "boolean") {
        return;
      }

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  crud: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "crud") {
        return;
      }

      // Entity is typed as a reference, but users could inline an entity definition.

      // @ts-expect-error
      type.entity = structureExtractReferences(structure, type.entity);

      for (let i = 0; i < type.inlineRelations.length; i++) {
        // @ts-expect-error
        type.inlineRelations[i] = structureExtractReferences(
          structure,
          type.inlineRelations[i],
        );
      }

      for (let i = 0; i < type.nestedRelations.length; i++) {
        // @ts-expect-error
        type.nestedRelations[i] = structureExtractReferences(
          structure,
          type.nestedRelations[i],
        );
      }

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type?.type !== "crud") {
        return;
      }

      structureIncludeReferences(fullStructure, newStructure, type.entity);

      for (const inlineRelation of type.inlineRelations) {
        structureIncludeReferences(fullStructure, newStructure, inlineRelation);
      }

      for (const nestedRelation of type.nestedRelations) {
        structureIncludeReferences(fullStructure, newStructure, nestedRelation);
      }
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type?.type !== "crud") {
        return;
      }

      parentTypeStack.push(stringFormatNameForError(type));

      // Whe need to give copies of the parentTypeStack to each recursive call. Each
      // call normally mutates the provided stack, but since we are going in separate
      // trees, they will mutate each other.
      structureValidateReferenceForType(structure, type.entity, [
        ...parentTypeStack,
      ]);

      for (const inlineRelation of type.inlineRelations) {
        structureValidateReferenceForType(structure, inlineRelation, [
          ...parentTypeStack,
        ]);
      }

      for (const nestedRelation of type.nestedRelations) {
        structureValidateReferenceForType(structure, nestedRelation, [
          ...parentTypeStack,
        ]);
      }
    },
  },
  date: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "date") {
        return;
      }

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  extend: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "extend") {
        return;
      }

      // The reference is always a named type, so the result will be that we get an
      // reference back.

      // @ts-expect-error
      type.reference = structureExtractReferences(structure, type.reference);

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type?.type !== "extend") {
        return;
      }

      structureIncludeReferences(fullStructure, newStructure, type.reference);
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type?.type !== "extend") {
        return;
      }

      parentTypeStack.push(stringFormatNameForError(type));

      structureValidateReferenceForType(
        structure,
        type.reference,
        parentTypeStack,
      );
    },
  },
  file: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "file") {
        return;
      }

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  generic: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "generic") {
        return;
      }

      type.keys = structureExtractReferences(structure, type.keys);
      type.values = structureExtractReferences(structure, type.values);

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type?.type !== "generic") {
        return;
      }

      structureIncludeReferences(fullStructure, newStructure, type.keys);
      structureIncludeReferences(fullStructure, newStructure, type.values);
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type?.type !== "generic") {
        return;
      }

      parentTypeStack.push(stringFormatNameForError(type));

      // Whe need to give copies of the parentTypeStack to each recursive call. Each
      // call normally mutates the provided stack, but since we are going in separate
      // trees, they will mutate each other
      structureValidateReferenceForType(structure, type.keys, [
        ...parentTypeStack,
      ]);
      structureValidateReferenceForType(structure, type.values, [
        ...parentTypeStack,
      ]);
    },
  },
  number: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "number") {
        return;
      }

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  object: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "object") {
        return;
      }

      for (const key of Object.keys(type.keys)) {
        type.keys[key] = structureExtractReferences(structure, type.keys[key]);
      }

      for (let i = 0; i < (type.relations ?? []).length; ++i) {
        // @ts-expect-error We always get a relation type back, since they won't be named.
        type.relations[i] = structureExtractReferences(
          structure,
          type.relations[i],
        );
      }

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type?.type !== "object") {
        return;
      }

      for (const key of Object.keys(type.keys)) {
        structureIncludeReferences(fullStructure, newStructure, type.keys[key]);
      }

      for (const relation of type.relations ?? []) {
        structureIncludeReferences(fullStructure, newStructure, relation);
      }
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type?.type !== "object") {
        return;
      }

      parentTypeStack.push(stringFormatNameForError(type));

      for (const key of Object.keys(type.keys)) {
        // Whe need to give copies of the parentTypeStack to each recursive call. Each
        // call normally mutates the provided stack, but since we are going in separate
        // trees, they will mutate each other
        structureValidateReferenceForType(structure, type.keys[key], [
          ...parentTypeStack,
        ]);
      }

      for (const relation of type.relations ?? []) {
        // Whe need to give copies of the parentTypeStack to each recursive call. Each
        // call normally mutates the provided stack, but since we are going in separate
        // trees, they will mutate each other
        structureValidateReferenceForType(structure, relation, [
          ...parentTypeStack,
        ]);
      }
    },
  },
  omit: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "omit") {
        return;
      }

      // @ts-expect-error Strictly types as reference definition
      type.reference = structureExtractReferences(structure, type.reference);

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type?.type !== "omit") {
        return;
      }

      structureIncludeReferences(fullStructure, newStructure, type.reference);
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type?.type !== "omit") {
        return;
      }

      parentTypeStack.push(stringFormatNameForError(type));

      structureValidateReferenceForType(
        structure,
        type.reference,
        parentTypeStack,
      );
    },
  },
  pick: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "pick") {
        return;
      }

      // @ts-expect-error
      type.reference = structureExtractReferences(structure, type.reference);

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type?.type !== "pick") {
        return;
      }

      structureIncludeReferences(fullStructure, newStructure, type.reference);
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type?.type !== "pick") {
        return;
      }

      parentTypeStack.push(stringFormatNameForError(type));

      structureValidateReferenceForType(
        structure,
        type.reference,
        parentTypeStack,
      );
    },
  },
  reference: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "reference") {
        return;
      }

      // We only need to extract these references if the reference includes the full type
      // definition

      // @ts-expect-error TypeBuilder only properties
      if (type.reference.type) {
        // @ts-expect-error TypeBuilder only properties
        structureAddType(structure, type.reference, {
          skipReferencesCheck: false,
        });

        type.reference = {
          group: type.reference.group,
          name: type.reference.name,
        };
      }

      return type;
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type?.type !== "reference") {
        return;
      }

      const referencedType =
        fullStructure[type.reference.group]?.[type.reference.name];
      if (isNil(referencedType)) {
        return;
      }

      structureAddType(newStructure, referencedType, {
        skipReferenceExtraction: true,
      });
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type?.type !== "reference") {
        return;
      }

      try {
        structureResolveReference(structure, type);
      } catch {
        throw AppError.serverError({
          message: `Could not resolve reference to ${stringFormatNameForError(
            type.reference,
          )} via ${parentTypeStack.join(" -> ")}`,
        });
      }
    },
  },
  relation: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "relation") {
        return;
      }

      // @ts-expect-error
      type.reference = structureExtractReferences(structure, type.reference);

      // Can't ever be named, so we don't check if we need to return a reference.

      return type;
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type?.type !== "relation") {
        return;
      }

      structureIncludeReferences(fullStructure, newStructure, type.reference);
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type?.type !== "relation") {
        return;
      }

      parentTypeStack.push(stringFormatNameForError(type));

      structureValidateReferenceForType(
        structure,
        type.reference,
        parentTypeStack,
      );
    },
  },
  route: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "route") {
        return;
      }

      // @ts-expect-error
      type.params = structureExtractReferences(structure, type.params);
      // @ts-expect-error
      type.query = structureExtractReferences(structure, type.query);
      // @ts-expect-error
      type.files = structureExtractReferences(structure, type.files);
      // @ts-expect-error
      type.body = structureExtractReferences(structure, type.body);
      // @ts-expect-error
      type.response = structureExtractReferences(structure, type.response);

      for (let i = 0; i < type.invalidations.length; i++) {
        // @ts-expect-error
        type.invalidations[i] = structureExtractReferences(
          structure,
          type.invalidations[i],
        );
      }

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type?.type !== "route") {
        return;
      }

      structureIncludeReferences(fullStructure, newStructure, type.params);
      structureIncludeReferences(fullStructure, newStructure, type.query);
      structureIncludeReferences(fullStructure, newStructure, type.files);
      structureIncludeReferences(fullStructure, newStructure, type.body);
      structureIncludeReferences(fullStructure, newStructure, type.response);

      for (const invalidation of type.invalidations) {
        structureIncludeReferences(fullStructure, newStructure, invalidation);
      }
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type?.type !== "route") {
        return;
      }

      parentTypeStack.push(stringFormatNameForError(type));

      // Whe need to give copies of the parentTypeStack to each recursive call. Each
      // call normally mutates the provided stack, but since we are going in separate
      // trees, they will mutate each other
      structureValidateReferenceForType(structure, type.params, [
        ...parentTypeStack,
      ]);
      structureValidateReferenceForType(structure, type.query, [
        ...parentTypeStack,
      ]);
      structureValidateReferenceForType(structure, type.files, [
        ...parentTypeStack,
      ]);
      structureValidateReferenceForType(structure, type.body, [
        ...parentTypeStack,
      ]);
      structureValidateReferenceForType(structure, type.response, [
        ...parentTypeStack,
      ]);

      for (const invalidation of type.invalidations) {
        structureValidateReferenceForType(structure, invalidation, [
          ...parentTypeStack,
        ]);
      }
    },
  },
  routeInvalidation: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "routeInvalidation") {
        return;
      }

      // Can't ever be named, so we don't have to check if we need to extract a reference

      return type;
    },
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  string: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "string") {
        return;
      }

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  uuid: {
    structureExtractReferences(structure, type) {
      if (type?.type !== "uuid") {
        return;
      }

      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
};
