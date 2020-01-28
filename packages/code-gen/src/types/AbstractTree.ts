export interface AbstractTree {
  types: AbstractTypeMap;
  router: AbstractRouteTrie;
  abstractRoutes: AbstractRoute[];
  validators: AbstractValidatorMap;
}

export type AbstractTypeMap = Record<string, NamedAbstractType>;

export type NamedAbstractType = { name: string } & AbstractTypeUnion;

export type NamedAbstractT<T extends AbstractTypeUnion> = T & { name: string };

export type AbstractTypeUnion =
  | AbstractNumberType
  | AbstractBooleanType
  | AbstractStringType
  | AbstractObjectType
  | AbstractArrayType
  | AbstractOneOfType
  | AbstractRefType;

export interface AbstractNumberType {
  type: "number";
  optional: boolean;
  oneOf?: number[];
}

export interface AbstractBooleanType {
  type: "boolean";
  optional: boolean;
  oneOf?: [boolean];
}

export interface AbstractStringType {
  type: "string";
  optional: boolean;
  oneOf?: string[];
}

export interface AbstractObjectType {
  type: "object";
  optional: boolean;
  keys: Record<string, AbstractTypeUnion>;
}

export interface AbstractArrayType {
  type: "array";
  optional: boolean;
  values: AbstractTypeUnion;
}

export interface AbstractRefType {
  type: "ref";
  optional: boolean;
  ref: string;
}

export interface AbstractOneOfType {
  type: "oneOf";
  optional: boolean;
  oneOf: AbstractTypeUnion[];
}

/**
 * Lowest prio value means higher priority and should be matched first
 */
export enum RoutePrio {
  STATIC,
  PARAM,
  WILDCARD,
}

export interface AbstractRouteTrie {
  prio: RoutePrio;
  path: string;
  parent?: AbstractRouteTrie;
  children: AbstractRouteTrie[];
  handler?: AbstractRoute;
}

export interface AbstractRoute {
  method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD";
  path: string;
  name: string;
  queryValidator?: AbstractValidatorReference;
  paramsValidator?: AbstractValidatorReference;
  bodyValidator?: AbstractValidatorReference;
  response?: {
    typeName: string;
  };
}

export interface AbstractValidatorReference {
  typeName: string;
  validatorName: string;
}

export type AbstractValidatorMap = Record<string, NamedAbstractValidator>;

export type NamedAbstractValidator = { name: string } & AbstractValidatorUnion;

export type NamedAbstractValidatorT<T extends AbstractValidatorUnion> = T & {
  name: string;
};

export type AbstractValidatorUnion =
  | AbstractNumberValidator
  | AbstractBooleanValidator
  | AbstractStringValidator
  | AbstractObjectValidator
  | AbstractArrayValidator
  | AbstractOneOfValidator
  | AbstractRefValidator;

export interface AbstractNumberValidator extends AbstractNumberType {
  convert: boolean;
  min?: number;
  max?: number;
  integer: boolean;
}

export interface AbstractBooleanValidator extends AbstractBooleanType {
  convert: boolean;
}

export interface AbstractStringValidator extends AbstractStringType {
  convert: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  trim: boolean;
  lowerCase: boolean;
  upperCase: boolean;
}

export interface AbstractObjectValidator extends AbstractObjectType {
  strict: boolean;
  keys: Record<string, AbstractValidatorUnion>;
}

export interface AbstractArrayValidator extends AbstractArrayType {
  convert: boolean;
  values: AbstractValidatorUnion;
}

export type AbstractRefValidator = AbstractRefType;

export interface AbstractOneOfValidator extends AbstractOneOfType {
  oneOf: AbstractValidatorUnion[];
}
