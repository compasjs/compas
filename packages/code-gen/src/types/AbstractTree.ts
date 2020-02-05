export interface WrappedAbstractTree extends AbstractTree {
  routeTrie: AbstractRouteTrie;
  models: ModelTypeMap;
  validators: TypeMap;
}

export interface AbstractTree {
  name: string;
  abstractRoutes: AbstractRoute[];
  types: TypeMap;
}

export type TypeMap = Record<string, NamedType>;
export type ModelTypeMap = Record<string, NamedTypeT<ObjectType>>;

export type NamedType = BaseType & TypeUnion;

export type NamedTypeT<T extends TypeUnion> = T & BaseType;

export type TypeUnion =
  | BooleanType
  | NumberType
  | StringType
  | ObjectType
  | ArrayType
  | AnyOfType
  | ReferenceType;

export interface BaseType {
  name: string;
  withValidator: boolean;
  withModel: boolean;
}

export interface ModelReference {
  modelName: string;
  fieldName: string;
}

export interface BooleanType {
  type: "boolean";
  optional: boolean;
  oneOf?: [boolean];
  validator: {
    convert: boolean;
  };
  model: {
    comparable: boolean;
  };
}

export interface NumberType {
  type: "number";
  optional: boolean;
  oneOf?: number[];
  validator: {
    convert: boolean;
    min?: number;
    max?: number;
    integer: boolean;
  };
  model: {
    primaryKey: boolean;
    comparable: boolean;
    reference?: ModelReference;
  };
}

export interface StringType {
  type: "string";
  optional: boolean;
  oneOf?: string[];
  validator: {
    convert: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    trim: boolean;
    lowerCase: boolean;
    upperCase: boolean;
  };
  model: {
    primaryKey: boolean;
    comparable: boolean;
    textSearch: boolean;
    reference?: ModelReference;
  };
}

export interface ObjectType {
  type: "object";
  optional: boolean;
  keys: { [key: string]: TypeUnion };
  validator: {
    strict: boolean;
  };
  model: {};
}

export interface ArrayType {
  type: "array";
  optional: boolean;
  values: TypeUnion;
  validator: {
    convert: boolean;
    min?: number;
    max?: number;
  };
  model: {
    reference?: ModelReference;
  };
}

export interface AnyOfType {
  type: "anyOf";
  optional: boolean;
  anyOf: TypeUnion[];
  validator: {};
  model: {};
}

/**
 * Note this is not for model reference but only for type reference
 * Can only reference named types.
 */
export interface ReferenceType {
  type: "reference";
  optional: boolean;
  reference: string;
  validator: {};
  model: {};
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
  queryValidator?: string;
  paramsValidator?: string;
  bodyValidator?: string;
  response?: string;
}
