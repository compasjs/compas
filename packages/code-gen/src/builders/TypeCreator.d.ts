export class TypeCreator {
  /**
   * @param {string} [group]
   */
  constructor(group?: string | undefined);
  group: string;
  /**
   * @param {string} [name]
   * @returns {AnyType}
   */
  any(name?: string | undefined): AnyType;
  /**
   * @param {string} [name]
   * @returns {AnyOfType}
   */
  anyOf(name?: string | undefined): AnyOfType;
  /**
   * @param {string} [name]
   * @returns {ArrayType}
   */
  array(name?: string | undefined): ArrayType;
  /**
   * @param {string} [name]
   * @returns {BooleanType}
   */
  bool(name?: string | undefined): BooleanType;
  /**
   * @param {string} [name]
   * @returns {DateType}
   */
  date(name?: string | undefined): DateType;
  /**
   * @param {string} [name]
   * @returns {FileType}
   */
  file(name?: string | undefined): FileType;
  /**
   * @param {string} [name]
   * @returns {GenericType}
   */
  generic(name?: string | undefined): GenericType;
  /**
   * @param {string} [name]
   * @returns {NumberType}
   */
  number(name?: string | undefined): NumberType;
  /**
   * @param {string} [name]
   * @returns {ObjectType}
   */
  object(name?: string | undefined): ObjectType;
  /**
   * @param {string} [name]
   * @returns {OmitType}
   */
  omit(name?: string | undefined): OmitType;
  /**
   * @param {string} [name]
   * @returns {OptionalType}
   */
  optional(name?: string | undefined): OptionalType;
  /**
   * @param {string} [name]
   * @returns {PickType}
   */
  pick(name?: string | undefined): PickType;
  /**
   * @param {string|TypeBuilder} groupOrOther
   * @param {string} [name]
   * @returns {ReferenceType}
   */
  reference(
    groupOrOther: string | TypeBuilder,
    name?: string | undefined,
  ): ReferenceType;
  /**
   * @param {string} [name]
   * @returns {SearchableType}
   */
  searchable(name?: string | undefined): SearchableType;
  /**
   * @param {string} [name]
   * @returns {StringType}
   */
  string(name?: string | undefined): StringType;
  /**
   * @param {string} [name]
   * @returns {UuidType}
   */
  uuid(name?: string | undefined): UuidType;
  /**
   * @param {string} path
   * @returns {RouteCreator}
   */
  router(path: string): RouteCreator;
  /**
   * @param {string} ownKey
   * @param {ReferenceType} reference
   * @returns {RelationType}
   */
  oneToMany(ownKey: string, reference: ReferenceType): RelationType;
  /**
   * @param {string} ownKey
   * @param {ReferenceType} reference
   * @param {string} referencedKey
   * @returns {RelationType}
   */
  manyToOne(
    ownKey: string,
    reference: ReferenceType,
    referencedKey: string,
  ): RelationType;
  /**
   * @param {string} ownKey
   * @param {ReferenceType} reference
   * @param {string} referencedKey
   * @returns {RelationType}
   */
  oneToOne(
    ownKey: string,
    reference: ReferenceType,
    referencedKey: string,
  ): RelationType;
  /**
   * Generate `queryClient.invalidateQueries` calls in the react-query generator, which
   * can be executed when the generated hook is called.
   *
   * @param {string} group
   * @param {string} [name]
   * @param {import("../generated/common/types").CodeGenRouteInvalidationTypeInput["properties"]} [properties]
   * @returns {RouteInvalidationType}
   */
  invalidates(
    group: string,
    name?: string | undefined,
    properties?:
      | {
          useSharedParams?: boolean | undefined;
          useSharedQuery?: boolean | undefined;
          specification?:
            | {
                params?:
                  | {
                      [key: string]: string[];
                    }
                  | undefined;
                query?:
                  | {
                      [key: string]: string[];
                    }
                  | undefined;
              }
            | undefined;
        }
      | undefined,
  ): RouteInvalidationType;
}
import { AnyType } from "./AnyType.js";
import { AnyOfType } from "./AnyOfType.js";
import { ArrayType } from "./ArrayType.js";
import { BooleanType } from "./BooleanType.js";
import { DateType } from "./DateType.js";
import { FileType } from "./FileType.js";
import { GenericType } from "./GenericType.js";
import { NumberType } from "./NumberType.js";
import { ObjectType } from "./ObjectType.js";
import { OmitType } from "./OmitType.js";
import { OptionalType } from "./OptionalType.js";
import { PickType } from "./PickType.js";
import { ReferenceType } from "./ReferenceType.js";
import { SearchableType } from "./SearchableType.js";
import { StringType } from "./StringType.js";
import { UuidType } from "./UuidType.js";
import { RouteCreator } from "./RouteBuilder.js";
import { RelationType } from "./RelationType.js";
import { RouteInvalidationType } from "./RouteInvalidationType.js";
//# sourceMappingURL=TypeCreator.d.ts.map
