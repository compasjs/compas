import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";
import axios from "axios";
import tape from "tape";
import promiseWrap from "tape-promise";
import * as api from "../src/generated/apiClient.js";
import {
  validateTodoAllResponse,
  validateTodoListResponse,
} from "../src/generated/validators.js";

mainFn(import.meta, log, main);

async function main(logger) {
  const test = promiseWrap.default(tape);

  api.createApiClient(
    axios.create({
      baseURL: "http://localhost:3000",
    }),
  );

  test("todo#all", async (t) => {
    const response = await api.todo.all();

    t.deepEqual(response, validateTodoAllResponse(response));

    t.end();
  });

  test("todo#one", async (t) => {
    const response = await api.todo.one({ name: "Default List" });

    t.deepEqual(response, validateTodoListResponse(response));

    t.end();
  });

  test("todo#new", async (t) => {
    const postResponse = await api.todo.new({ name: "Todo Test" });

    t.deepEqual(postResponse, validateTodoListResponse(postResponse));

    const getResponse = await api.todo.one({ name: "Todo Test" });
    t.deepEqual(getResponse, postResponse);

    t.end();
  });

  test("todo#createItem", async (t) => {
    const response = await api.todo.createItem(
      { name: "Todo Test" },
      { name: "TodoItem 1" },
    );

    t.deepEqual(response, validateTodoListResponse(response));

    t.end();
  });

  test("todo#toggleItem", async (t) => {
    let response = await api.todo.toggleItem(
      {
        name: "Todo Test",
      },
      { index: "0" },
    );

    t.deepEqual(response, validateTodoListResponse(response));
    t.equal(response.todo.items[0].completed, true, "item completed");

    response = await api.todo.toggleItem(
      {
        name: "Todo Test",
      },
      {
        index: 0,
      },
    );
    t.equal(response.todo.items[0].completed, false);

    t.end();
  });

  test("todo#delete", async (t) => {
    const response = await api.todo.delete({ name: "Todo Test" });
    t.equal(response.deleted, true);

    try {
      await api.todo.one({ name: "Todo Test" });
      t.fail("Should nog resolve");
    } catch (e) {
      t.equal(e.response.status, 400);
    }

    t.end();
  });

  test("unimplemented", async (t) => {
    log.info({
      user: await api.unimplemented.user(),
      settings: await api.unimplemented.settings(),
    });

    t.end();
  });
}
