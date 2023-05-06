import { AnyOfType } from "./AnyOfType.js";
import { AnyType } from "./AnyType.js";
import { ArrayType } from "./ArrayType.js";
import { BooleanType } from "./BooleanType.js";
import { CrudType } from "./CrudType.js";
import { DateType } from "./DateType.js";
import { ExtendType } from "./ExtendType.js";
import { FileType } from "./FileType.js";
import { GenericType } from "./GenericType.js";
import { NumberType } from "./NumberType.js";
import { ObjectType } from "./ObjectType.js";
import { OmitType } from "./OmitType.js";
import { OptionalType } from "./OptionalType.js";
import { PickType } from "./PickType.js";
import { ReferenceType } from "./ReferenceType.js";
import { RelationType } from "./RelationType.js";
import { RouteCreator } from "./RouteBuilder.js";
import { SearchableType } from "./SearchableType.js";
import { StringType } from "./StringType.js";
import { UuidType } from "./UuidType.js";

export class TypeCreator {
  /**
   * @param {string} [group]
   */
  constructor(group) {
    this.group = group || "app";

    if (this.group.indexOf(".") !== -1) {
      throw new Error(
        `The '.' is reserved for later use when creating nested groups`,
      );
    }
  }

  /**
   * @param {string} [name]
   * @returns {AnyType}
   */
  any(name) {
    return new AnyType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {AnyOfType}
   */
  anyOf(name) {
    return new AnyOfType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {ArrayType}
   */
  array(name) {
    return new ArrayType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {BooleanType}
   */
  bool(name) {
    return new BooleanType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {DateType}
   */
  date(name) {
    return new DateType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {FileType}
   */
  file(name) {
    return new FileType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {GenericType}
   */
  generic(name) {
    return new GenericType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {NumberType}
   */
  number(name) {
    return new NumberType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {ObjectType}
   */
  object(name) {
    return new ObjectType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {OmitType}
   */
  omit(name) {
    return new OmitType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {OptionalType}
   */
  optional(name) {
    return new OptionalType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {PickType}
   */
  pick(name) {
    return new PickType(this.group, name);
  }

  /**
   * @param {ReferenceType} reference
   * @returns {ExtendType}
   */
  extendNamedObject(reference) {
    return new ExtendType(this.group, reference);
  }

  /**
   * @param {string|import("./TypeBuilder.js").TypeBuilder} groupOrOther
   * @param {string} [name]
   * @returns {ReferenceType}
   */
  reference(groupOrOther, name) {
    return new ReferenceType(groupOrOther, name);
  }

  /**
   * @param {string} [name]
   * @returns {SearchableType}
   */
  searchable(name) {
    return new SearchableType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {StringType}
   */
  string(name) {
    return new StringType(this.group, name);
  }

  /**
   * @param {string} [name]
   * @returns {UuidType}
   */
  uuid(name) {
    return new UuidType(this.group, name);
  }

  /**
   * @param {string} path
   * @returns {RouteCreator}
   */
  router(path) {
    return new RouteCreator(this.group, path);
  }

  /**
   * @param {string} [path]
   * @returns {CrudType}
   */
  crud(path) {
    return new CrudType(this.group, path);
  }

  /**
   * @param {string} ownKey
   * @param {ReferenceType} reference
   * @returns {RelationType}
   */
  oneToMany(ownKey, reference) {
    return new RelationType("oneToMany", ownKey, reference);
  }

  /**
   * @param {string} ownKey
   * @param {ReferenceType} reference
   * @param {string} referencedKey
   * @returns {RelationType}
   */
  manyToOne(ownKey, reference, referencedKey) {
    return new RelationType("manyToOne", ownKey, reference, referencedKey);
  }

  /**
   * @param {string} ownKey
   * @param {ReferenceType} reference
   * @param {string} referencedKey
   * @returns {RelationType}
   */
  oneToOne(ownKey, reference, referencedKey) {
    return new RelationType("oneToOne", ownKey, reference, referencedKey);
  }
}
