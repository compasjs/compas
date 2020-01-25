import { Route, RoutePrio, RouteTrie } from "../types";
import { lowerCaseFirst, upperCaseFirst } from "../util";

type Context = {
  imports: string[];
  validatorImports: string[];
  matchers: string[];
  routeMatchName(): string;
};

export function createTypesAndFunctionsForTrie(
  routes: Route[],
  trie: RouteTrie,
): string {
  let routeMatchIdx = 0;
  const ctx: Context = {
    imports: [],
    validatorImports: [],
    matchers: [],
    routeMatchName(): string {
      return `routeMatch${routeMatchIdx++}`;
    },
  };

  const typings = buildTypes(ctx, trie);
  const handlers = buildNamedHandlers(ctx, routes);
  const func = buildFunction(ctx, trie);
  const mountFn = getMountFunction(ctx);

  return [
    getHeader(),
    getImports(ctx),
    typings,
    mountFn,
    handlers,
    func,
    ctx.matchers.join("\n"),
  ].join("\n");
}

function getHeader(): string {
  return `
// @lbu/code-gen
// GENERATED FILE DO NOT EDIT
`;
}

function getImports(ctx: Context): string {
  const validators = ctx.validatorImports.join(", ");
  ctx.imports.push(`import { ${validators} } from "./validators";`);

  return ctx.imports.join("\n");
}

function getMountFunction(ctx: Context): string {
  ctx.imports.push(`import Koa from "koa";`);
  ctx.imports.push(`import { AppState, Context, bodyParser } from "@lbu/koa";`);

  return `
export function mountRouter(app: Koa<AppState>) {
  app.use(routeFn);
}
`;
}

function buildNamedHandlers(ctx: Context, routes: Route[]) {
  const publicHandlers = [`export const routeHandlers = {`];
  const privateHandlers = [`const handlers = {`];
  const bodyParser = `
    const bodyInstance = bodyParser({
      jsonLimit: 5 * 1024 * 1024, // 5mb
      multipart: true,
    });
    const wrappedBodyParser = (ctx: Context) => new Promise(r => bodyInstance(ctx, r as Koa.Next));
  `;

  for (const r of routes) {
    publicHandlers.push(
      `${lowerCaseFirst(r.name)}: async (ctx: Context & ${upperCaseFirst(
        r.name,
      )}, next: Koa.Next) => { return next(); },`,
    );

    privateHandlers.push(
      `${lowerCaseFirst(
        r.name,
      )}: async (params: any, ctx: Context & ${upperCaseFirst(
        r.name,
      )}, next: Koa.Next) => {`,
    );

    privateHandlers.push(`// @ts-ignore`);
    privateHandlers.push(`ctx.request.params = params;`);
    if (r.paramsValidator) {
      privateHandlers.push(
        `ctx.validatedParams = validate${r.paramsValidator.name}(params);`,
      );
    }
    if (r.bodyValidator || r.queryValidator) {
      privateHandlers.push(`await wrappedBodyParser(ctx);`);
    }

    if (r.bodyValidator) {
      privateHandlers.push(
        `ctx.validatedBody = validate${r.bodyValidator.name}(ctx.request.body);`,
      );
    }
    if (r.queryValidator) {
      privateHandlers.push(
        `ctx.validatedQuery = validate${r.queryValidator.name}(ctx.request.query);`,
      );
    }

    privateHandlers.push(
      `return routeHandlers.${lowerCaseFirst(r.name)}(ctx, next);`,
    );

    privateHandlers.push("},");
  }

  publicHandlers.push(`};`);
  privateHandlers.push(`};`);

  return (
    bodyParser + "\n" + publicHandlers.join("\n") + privateHandlers.join("\n")
  );
}

function buildTypes(ctx: Context, trie: RouteTrie): string {
  const childrenArr = [];
  for (const child of trie.children) {
    childrenArr.push(buildTypes(ctx, child));
  }

  const childrenSrc = childrenArr.join("\n");
  if (trie.handler === undefined) {
    return childrenSrc;
  }

  const { name, queryValidator, paramsValidator, bodyValidator } = trie.handler;

  const src: string[] = [];
  src.push(`export type ${name} = {`);
  if (queryValidator) {
    const validator = `validate${queryValidator.name}`;
    ctx.validatorImports.push(validator);
    src.push(`validatedQuery: ReturnType<typeof ${validator}>;`);
  }
  if (paramsValidator) {
    const validator = `validate${paramsValidator.name}`;
    ctx.validatorImports.push(validator);
    src.push(`validatedParams: ReturnType<typeof ${validator}>;`);
  }
  if (bodyValidator) {
    const validator = `validate${bodyValidator.name}`;
    ctx.validatorImports.push(validator);
    src.push(`validatedBody: ReturnType<typeof ${validator}>;`);
  }
  src.push(`};`);

  return src.join("\n") + childrenSrc;
}

function buildFunction(ctx: Context, trie: RouteTrie): string {
  const { name } = buildRouteMatcher(ctx, trie);

  // params are lifted up to this generated code, cause they will be added to the object
  // directly
  return `
async function routeFn(ctx: Context, next: Koa.Next) {
  let triePath = (ctx.method + ctx.path);
  if (triePath.endsWith("/")) {
    triePath = triePath.substring(0, triePath.length -2);
  }
  const params: any = {};

  const route = ${name}(triePath, params);
  if (route !== undefined) {
    return route(params, ctx, next);
  }
      
  return next();
}`;
}

function buildRouteMatcher(ctx: Context, trie: RouteTrie): { name: string } {
  const name = ctx.routeMatchName();
  const src = [];

  if (trie.children.length === 0) {
    const handlerName = trie.handler ? trie.handler.name : "__UNKNOWN__";
    ctx.matchers.push(
      `function ${name}(path: string, params: any, currentIdx = 0) { return handlers["${lowerCaseFirst(
        handlerName,
      )}"]; }`,
    );

    return { name };
  }

  src.push(`function ${name}(path: string, params: any, currentIdx = 0) {`);
  src.push(`let nextSlash = path.indexOf("/", currentIdx);`);
  src.push(`if (nextSlash === -1) { nextSlash = path.length ;}`);
  src.push(`const subPath = path.substring(currentIdx, nextSlash);`);
  src.push(`let handler: any = undefined`);

  for (const child of trie.children) {
    const childHasHandler =
      child.children.length === 0 && child.handler !== undefined;

    // Because the trie is sorted, all prio's should follow each other up
    if (child.prio === RoutePrio.STATIC) {
      src.push(`if (subPath === "${child.path}") {`);

      if (childHasHandler && child.children.length === 0) {
        src.push(`if (subPath.length + 1 + currentIdx === path.length) {`);
        src.push(`return handlers["${lowerCaseFirst(child.handler!.name)}"];`);
        src.push(`}`);
      }

      if (!childHasHandler && child.children.length === 0) {
        src.push(`return undefined;`);
      } else {
        src.push(
          `handler = ${
            buildRouteMatcher(ctx, child).name
          }(path, params, currentIdx + subPath.length + 1);`,
        );
        src.push(`if (handler !== undefined) { return handler; }`);
      }
      src.push(`}`);
    } else if (child.prio === RoutePrio.PARAM) {
      src.push(`if (subPath.length > 0) {`);
      if (childHasHandler && child.children.length === 0) {
        src.push(`if (subPath.length + 1 + currentIdx === path.length) {`);
        src.push(`params["${child.path.substring(1)}"] = subPath;`);
        src.push(`return handlers["${lowerCaseFirst(child.handler!.name)}"];`);
        src.push(`}`);
      }

      if (!childHasHandler && child.children.length === 0) {
        src.push(`return undefined;`);
      } else {
        src.push(
          `handler = ${
            buildRouteMatcher(ctx, child).name
          }(path, params, currentIdx + subPath.length + 1);`,
        );

        src.push(`if (handler !== undefined) {`);
        src.push(`params["${child.path.substring(1)}"] = subPath;`);
        src.push(`return handler;`);
        src.push(`}`);
      }
      src.push(`}`);
    } else if (child.prio === RoutePrio.WILDCARD) {
      if (trie.children.length === 1) {
        ctx.matchers.push(`
          function ${name}(path: string, params: any, currentIdx = 0) {
            return handlers["${lowerCaseFirst(child.handler!.name)}"];
          }
        `);

        return { name };
      } else {
        src.push(`return handlers["${lowerCaseFirst(child.handler!.name)}"];`);
      }
    }
  }

  if (trie.handler !== undefined) {
    src.push(`if (!handler) {`);
    src.push(`handler = handlers["${lowerCaseFirst(trie.handler!.name)}"];`);
    src.push("}");
  }

  src.push(`return handler;`);
  src.push(`}`);

  ctx.matchers.push(src.join("\n"));

  return { name };
}
