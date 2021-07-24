export type TypeBuilderLike =
  | boolean
  | number
  | string
  | TypeBuilderLikeObject
  | TypeBuilderLike[]
  | TypeBuilder;

type TypeBuilderLikeObject = Record<string, TypeBuilderLike>;
