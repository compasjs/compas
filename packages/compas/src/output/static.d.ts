export namespace output {
  namespace config {
    namespace environment {
      function creating(): void;
      function loaded(env: any): void;
    }
    namespace resolve {
      export function starting(): void;
      export function creating_1(): void;
      export { creating_1 as creating };
      export function notFound(expectedFileLocation: any): void;
      export function parseError(e: any, expectedFileLocation: any): void;
      export function validationError(
        error: any,
        expectedFileLocation: any,
      ): void;
      export function resolved(resolvedConfig: any): void;
    }
  }
}
//# sourceMappingURL=static.d.ts.map
