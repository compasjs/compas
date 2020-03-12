import {
  App,
  getApiClientPlugin,
  getMocksPlugin,
  getRouterPlugin,
  getTypesPlugin,
  getValidatorPlugin,
  M,
  paginate,
  R,
  runCodeGen,
} from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";

const app = new App("TODO App");

app.model(M("MyBoolean1").bool());
app.model(
  M("MyBoolean2")
    .bool()
    .oneOf(true),
);
app.model(
  M("MyBoolean3")
    .bool()
    .oneOf(true)
    .optional()
    .default(true),
);
app.model(
  M("MyBoolean4")
    .bool()
    .optional(),
);
app.model(
  M("MyBoolean5")
    .bool()
    .optional()
    .default(true),
);

app.model(
  M("MyInteger1")
    .number()
    .integer()
    .min(5),
);
app.model(
  M("MyNumber1")
    .number()
    .max(5),
);

app.model(
  M("RawMock")
    .string()
    .mock(`__.string()`),
);
app.model(
  M("ChanceParagraph")
    .string()
    .mock("__.paragraph()"),
);

app.model(
  M("MYGeneric")
    .generic()
    .keys(M.string().mock("__.first()"))
    .values(
      M.array(
        M.anyOf(
          M.bool().optional(),
          M.string()
            .min(2)
            .max(20)
            .upperCase(),
          M.number()
            .min(0)
            .integer()
            .max(1500),
        ),
      ).min(5),
    ),
);

const idObject = M("IdObject").object({
  id: M.number()
    .integer()
    .convert(),
});

const todoModel = M("Todo").object({
  id: M.number().integer(),
  name: M.string(),
  items: M.array(
    M("TodoItem").object({
      createdAt: M.number().integer(),
      item: M.string(),
      completedAt: M.number()
        .integer()
        .optional(),
    }),
  ),
});

const todoResponse = M("TodoResponse").object({
  data: todoModel,
});

const postTodo = M.object({
  name: M.string()
    .trim()
    .min(2)
    .default("new Date().toISOString()"),
});

const todoRouter = R("todo", "/todo")
  .tags("todo")
  .params(idObject)
  .response(todoResponse);

app
  .route(
    todoRouter
      .getList()
      .params()
      .query(paginate.query)
      .response(
        M.object({
          data: M.array(todoModel),
          pagination: paginate.response,
        }),
      ),
  )
  .route(todoRouter.get().path("/:id"))
  .route(
    todoRouter
      .post("PostNew")
      .params()
      .body(postTodo),
  )
  .route(
    todoRouter
      .post("PostItems")
      .path("/:id/items")
      .body(
        M.object({
          items: M.array(
            M.string()
              .trim()
              .min(1),
          )
            .convert()
            .min(1),
        }),
      ),
  )
  .route(
    todoRouter
      .post("PostTick")
      .path("/:id/tick")
      .body(
        M.object({
          index: M.number()
            .integer()
            .min(0)
            .default(0),
        }),
      ),
  );

const main = async logger => {
  // Code gen validators
  await runCodeGen(logger, () => app.build()).build({
    plugins: [
      getTypesPlugin(),
      getValidatorPlugin(),
      getRouterPlugin(),
      getMocksPlugin(),
      getApiClientPlugin(),
    ],
    outputDir: "./generated",
  });
};

mainFn(import.meta, log, main);

export const nodemonArgs = "--ignore generated -e tmpl,js,json";
