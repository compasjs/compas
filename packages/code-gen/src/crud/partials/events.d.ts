export function crudPartialEventCount(data: {
  crudName: string;
  entityUniqueName: string;
  entityName: string;
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
  builder: string;
  inlineRelations: {
    name: string;
    referencedKey: string;
    entityName: string;
    isInlineArray: boolean;
    inlineRelations: any[];
  }[];
}): string;
export function crudPartialEventUpdate(data: {
  crudName: string;
  entityUniqueName: string;
  entityName: string;
  inlineRelations: {
    name: string;
    referencedKey: string;
    entityName: string;
    isInlineArray: boolean;
    inlineRelations: any[];
  }[];
}): string;
export function crudPartialInlineRelationInserts(
  relations: {
    name: string;
    referencedKey: string;
    entityName: string;
    isInlineArray: boolean;
    inlineRelations: any[];
  }[],
  parentName: string,
): string;
export function crudPartialEventDelete(data: {
  crudName: string;
  entityUniqueName: string;
  entityName: string;
}): string;
export function crudPartialEventTransformer(data: {
  crudName: string;
  entityUniqueName: string;
  entityName: string;
  entity: Record<string, boolean | Record<string, boolean>>;
}): string;
//# sourceMappingURL=events.d.ts.map
