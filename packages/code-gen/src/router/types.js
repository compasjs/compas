import { M } from "../model/index.js";

export const paginate = {
  query: M("PaginateInput").object({
    cursor: M.number()
      .optional()
      .convert()
      .integer()
      .docs("Optional cursor parameter"),
    maxItems: M.number()
      .optional()
      .convert()
      .integer()
      .docs(
        `Maximum number of items that is optimal for the client. The backend will still decide on the number of items send back.`,
      ),
  }),
  response: M("PaginateOutput").object({
    count: M.number().integer(),
    nextCursor: M.number().optional().integer(),
  }),
};
