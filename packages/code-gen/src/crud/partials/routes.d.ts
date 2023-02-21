export function crudPartialRouteList(data: {
  handlerName: string;
  crudName: string;
  countBuilder: string;
  listBuilder: string;
  primaryKey: string;
  skipNext?: boolean;
}): string;
export function crudPartialRouteSingle(data: {
  handlerName: string;
  crudName: string;
  builder: string;
  skipNext?: boolean;
}): string;
export function crudPartialRouteCreate(data: {
  handlerName: string;
  crudName: string;
  applyParams?: {
    bodyKey: string;
    paramsKey: string;
  };
  oneToOneChecks?: {
    builder: string;
  };
  skipNext?: boolean;
}): string;
export function crudPartialRouteUpdate(data: {
  handlerName: string;
  crudName: string;
  builder: string;
  skipNext?: boolean;
}): string;
export function crudPartialRouteDelete(data: {
  handlerName: string;
  crudName: string;
  builder: string;
  skipNext?: boolean;
}): string;
//# sourceMappingURL=routes.d.ts.map
