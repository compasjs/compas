export type TypeBuilderLike =
  | string
  | number
  | boolean
  | import("../src/builders/TypeBuilder.js").TypeBuilder
  | { [property: string]: TypeBuilderLike }
  | TypeBuilderLike[];

export type NamedType<T> = T & {
  group: string;
  name: string;
};
