# @lbu/validator

Generate type-safe validation functions

## API

```typescript
import { V, createSchema, runGenerators } from "@lbu/validator";
import { readFileSync } from "fs";

createSchema("Direction", V.string().oneOf("NORT", "EAST", "SOUTH", "WEST"));

createSchema(
  "Vec2D",
  V.object({
    x: V.number()
      .integer()
      .min(0),
    y: V.number()
      .integer()
      .min(0),
  }),
);

createSchema(
  "Vector",
  V.object({
    direction: V.ref("Direction"),
    point: V.ref("Vec2D"),
    speed: V.number().optional(),
  }),
);

runGenerators("/tmp/validator.ts");
console.log(readFileSync("/tmp/validator.ts", { encoding: "utf-8" }));
```

Outputs the following (unformatted):
```typescript
export type Direction = "NORT" | "EAST" | "SOUTH" | "WEST";

export interface Vec2D {
  x: number;
  y: number;
}

export interface Vector {
  direction: Direction;
  point: Vec2D;
  speed: number | undefined;
}
```
