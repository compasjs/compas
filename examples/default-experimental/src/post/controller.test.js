import { mainTestFn, test } from "@compas/cli";
import { closeTestApp, createTestAppAndClient } from "@compas/server";
import { uuid } from "@compas/stdlib";
import axios from "axios";
import { axiosInterceptErrorAndWrapWithAppError } from "../generated/application/common/api-client.js";
import {
  apiPostCreate,
  apiPostSingle,
  apiPostUpdate,
} from "../generated/application/post/apiClient.js";
import { app } from "../services/core.js";

mainTestFn(import.meta);

test("post/controller", async (t) => {
  // Run the Koa instance on a random port and create an Axios instance that uses that as
  // the baseUrl.
  const axiosInstance = axios.create();
  await createTestAppAndClient(app, axiosInstance);
  axiosInterceptErrorAndWrapWithAppError(axiosInstance);

  // We skip testing `apiPostList`, `apiPostSingle` and `apiPostCreate` since these
  // implementations are generated and do not use `preModifiers`. If you add those
  // `preModifiers` you should test them.
  t.test("apiPostUpdate", (t) => {
    t.test("post.single.notFound", async (t) => {
      try {
        await apiPostUpdate(
          axiosInstance,
          {
            postId: uuid(),
          },
          { text: "some random long post" },
        );
      } catch (e) {
        // The api client that is generated in combination with a router will
        // automatically recreate the original `AppError` if possible.
        // It also validates the responses automatically.
        t.equal(e.key, "post.single.notFound");
      }
    });

    t.test("success", async (t) => {
      const { item: post } = await apiPostCreate(axiosInstance, {
        title: "My post",
        text: "my original post text",
      });

      await apiPostUpdate(
        axiosInstance,
        {
          postId: post.id,
        },
        {
          text: "my updated post text",
        },
      );

      const { item: updatedPost } = await apiPostSingle(axiosInstance, {
        postId: post.id,
      });

      t.equal(updatedPost.text, "my updated post text");
    });
  });

  t.test("teardown", async (t) => {
    // Since subtests run in the order they are registered, we can always do some
    // teardown in the last subtest.

    await closeTestApp(app);

    t.pass();
  });
});
