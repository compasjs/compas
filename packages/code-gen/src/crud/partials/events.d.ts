export function crudPartialEventCount(data: {
  crudName: string;
  entityUniqueName: string;
  entityName: string;
  primaryKey: string;
  primaryKeyType: string;
}): string;
export function crudPartialEventList(data: {
  crudName: string;
  entityUniqueName: string;
  entityName: string;
}): string;
export function crudPartialEventSingle(data: {
  crudName: string;
  entityUniqueName: string;
  entityName: string;
}): string;
export function crudPartialEventCreate(data: {
  crudName: string;
  entityUniqueName: string;
  entityName: string;
  primaryKey: string;
  writableType: {
    group: string;
    name: string;
  };
  inlineRelations: {
    name: string;
    referencedKey: string;
    entityName: string;
    isInlineArray: boolean;
    isOwningSideOfRelation: boolean;
    isOptional: boolean;
    parentPrimaryKey: string;
    inlineRelations: any[];
  }[];
}): string;
export function crudPartialEventUpdate(data: {
  crudName: string;
  entityUniqueName: string;
  entityName: string;
  primaryKey: string;
  writableType: {
    group: string;
    name: string;
  };
  inlineRelations: {
    name: string;
    referencedKey: string;
    entityName: string;
    isInlineArray: boolean;
    isOwningSideOfRelation: boolean;
    isOptional: boolean;
    parentPrimaryKey: string;
    inlineRelations: any[];
  }[];
}): string;
export function crudPartialInlineRelationInserts(
  relations: {
    name: string;
    referencedKey: string;
    entityName: string;
    isInlineArray: boolean;
    isOwningSideOfRelation: boolean;
    isOptional: boolean;
    parentPrimaryKey: string;
    inlineRelations: any[];
  }[],
  parentName: string,
): string;
export function crudPartialEventDelete(data: {
  crudName: string;
  entityUniqueName: string;
  entityName: string;
  primaryKey: string;
}): string;
export function crudPartialEventTransformer(data: {
  crudName: string;
  entityUniqueName: string;
  entityName: string;
  entity: Record<string, boolean | Record<string, boolean>>;
  readableType: {
    group: string;
    name: string;
  };
}): string;
//# sourceMappingURL=events.d.ts.map
