export function crudPartialRouteList(data: {
  handlerName: string;
  crudName: string;
  hasTransformContext: boolean;
  countBuilder: string;
  listBuilder: string;
  primaryKey: string;
}): string;
export function crudPartialRouteSingle(data: {
  handlerName: string;
  hasTransformContext: boolean;
  crudName: string;
  builder: string;
}): string;
export function crudPartialRouteCreate(data: {
  handlerName: string;
  crudName: string;
  hasTransformContext: boolean;
  builder: string;
  applyParams?: {
    bodyKey: string;
    paramsKey: string;
  };
  oneToOneChecks?: {
    builder: string;
  };
}): string;
export function crudPartialRouteUpdate(data: {
  handlerName: string;
  crudName: string;
  builder: string;
}): string;
export function crudPartialRouteDelete(data: {
  handlerName: string;
  crudName: string;
  builder: string;
}): string;
//# sourceMappingURL=routes.d.ts.map
