import { logger } from "../logger";
import {
  AbstractTree,
  AnyOfType,
  ArrayType,
  BooleanType,
  NamedType,
  NumberType,
  ObjectType,
  ReferenceType,
  StringType,
  TypeUnion,
} from "../types";

interface TypeUnionBuilder {
  toTypeUnion(): TypeUnion;
}

export class NamedTypeBuilder {
  private result: NamedType = {
    name: this.name,
    withValidator: false,
    withModel: false,
  } as any;

  constructor(private tree: AbstractTree, private name: string) {
    if (this.tree.types[name] !== undefined) {
      logger.info(`Overwriting type ${name}`);
    }
    this.tree.types[name] = this.result;
  }

  enableValidator() {
    this.result.withValidator = true;
    return this;
  }

  enableModel() {
    this.result.withModel = true;
    return this;
  }

  set(type: TypeUnionBuilder) {
    Object.assign(this.result, type.toTypeUnion());
  }

  public boolean(): BooleanTypeBuilder {
    return new BooleanTypeBuilder();
  }

  public number(): NumberTypeBuilder {
    return new NumberTypeBuilder();
  }

  public string(): StringTypeBuilder {
    return new StringTypeBuilder();
  }

  public object(): ObjectTypeBuilder {
    return new ObjectTypeBuilder();
  }

  public array(): ArrayTypeBuilder {
    return new ArrayTypeBuilder();
  }

  public anyOf(): AnyOfTypeBuilder {
    return new AnyOfTypeBuilder();
  }

  public ref(): ReferenceTypeBuilder {
    return new ReferenceTypeBuilder();
  }
}

class BooleanTypeBuilder implements TypeUnionBuilder {
  private result: BooleanType = {
    type: "boolean",
    optional: false,
    model: {
      comparable: false,
    },
    validator: {
      convert: false,
    },
  };

  optional() {
    this.result.optional = true;
    return this;
  }

  convert() {
    this.result.validator.convert = true;
    return this;
  }

  comparable() {
    this.result.model.comparable = true;
    return this;
  }

  oneOf(value: boolean) {
    this.result.oneOf = [value];
    return this;
  }

  toTypeUnion(): BooleanType {
    return this.result;
  }
}

class NumberTypeBuilder implements TypeUnionBuilder {
  private result: NumberType = {
    type: "number",
    optional: false,
    model: {
      comparable: false,
    },
    validator: {
      convert: false,
      integer: false,
    },
  };

  optional() {
    this.result.optional = true;
    return this;
  }

  convert() {
    this.result.validator.convert = true;
    return this;
  }

  comparable() {
    this.result.model.comparable = true;
    return this;
  }

  reference(modelName: string, fieldName: string) {
    this.result.model.reference = {
      modelName,
      fieldName,
    };
    return this;
  }

  integer() {
    this.result.validator.integer = true;
    return this;
  }

  min(min: number) {
    this.result.validator.min = min;
    return this;
  }

  max(max: number) {
    this.result.validator.max = max;
    return this;
  }

  oneOf(...values: number[]) {
    this.result.oneOf = values;
    return this;
  }

  public toTypeUnion(): NumberType {
    return this.result;
  }
}

class StringTypeBuilder implements TypeUnionBuilder {
  private result: StringType = {
    type: "string",
    optional: false,
    model: {
      comparable: false,
      textSearch: false,
    },
    validator: {
      convert: false,
      trim: false,
      lowerCase: false,
      upperCase: false,
    },
  };

  optional() {
    this.result.optional = true;
    return this;
  }

  oneOf(...values: string[]) {
    this.result.oneOf = values;
    return this;
  }

  comparable() {
    this.result.model.comparable = true;
    return this;
  }

  textSearch() {
    this.result.model.textSearch = true;
    return this;
  }

  reference(modelName: string, fieldName: string) {
    this.result.model.reference = {
      modelName,
      fieldName,
    };
    return this;
  }

  convert() {
    this.result.validator.convert = true;
    return this;
  }

  trim() {
    this.result.validator.trim = true;
    return this;
  }

  lowerCase() {
    this.result.validator.lowerCase = true;
    return this;
  }

  upperCase() {
    this.result.validator.upperCase = true;
    return this;
  }

  min(min: number) {
    this.result.validator.min = min;
    return this;
  }

  max(max: number) {
    this.result.validator.max = max;
    return this;
  }

  pattern(pattern: RegExp) {
    this.result.validator.pattern = pattern;
    return this;
  }

  public toTypeUnion(): StringType {
    return this.result;
  }
}

class ObjectTypeBuilder implements TypeUnionBuilder {
  private result: ObjectType = {
    type: "object",
    optional: false,
    keys: {},
    model: {},
    validator: {
      strict: false,
    },
  };

  optional() {
    this.result.optional = true;
    return this;
  }

  strict() {
    this.result.validator.strict = true;
    return this;
  }

  keys(values: Record<string, TypeUnionBuilder>) {
    for (const k in values) {
      if (!Object.prototype.hasOwnProperty.call(values, k)) {
        continue;
      }
      this.result.keys[k] = values[k].toTypeUnion();
    }
    return this;
  }

  public toTypeUnion(): ObjectType {
    return this.result;
  }
}

class ArrayTypeBuilder implements TypeUnionBuilder {
  // Note: any cast is a quick hack, because values can't be undefined and @ts-ignore in a
  // object literal flips with my formatter
  private result: ArrayType = {
    type: "array",
    optional: false,
    values: undefined,
    model: {},
    validator: {
      convert: false,
    },
  } as any;

  optional() {
    this.result.optional = true;
    return this;
  }

  reference(modelName: string, fieldName: string) {
    this.result.model.reference = {
      modelName,
      fieldName,
    };
    return this;
  }

  values(values: TypeUnionBuilder) {
    this.result.values = values.toTypeUnion();
  }

  convert() {
    this.result.validator.convert = true;
    return this;
  }

  min(min: number) {
    this.result.validator.min = min;
    return this;
  }

  max(max: number) {
    this.result.validator.max = max;
    return this;
  }

  public toTypeUnion(): ArrayType {
    if (this.result.values === undefined) {
      throw new Error("Can't build an array without types defined");
    }

    return this.result;
  }
}

class AnyOfTypeBuilder implements TypeUnionBuilder {
  private result: AnyOfType = {
    type: "anyOf",
    optional: false,
    anyOf: [],
    model: {},
    validator: {},
  };

  optional() {
    this.result.optional = true;
    return this;
  }

  types(...types: TypeUnionBuilder[]) {
    this.result.anyOf = types.map(it => it.toTypeUnion());
  }

  public toTypeUnion(): AnyOfType {
    return this.result;
  }
}

class ReferenceTypeBuilder implements TypeUnionBuilder {
  private result: ReferenceType = {
    type: "reference",
    optional: false,
    reference: "",
    model: {},
    validator: {},
  };

  optional() {
    this.result.optional = true;
    return this;
  }

  type(typeName: string) {
    this.result.reference = typeName;
    return this;
  }

  public toTypeUnion(): ReferenceType {
    if (this.result.reference === "") {
      throw new Error("Noo!");
    }

    return this.result;
  }
}
