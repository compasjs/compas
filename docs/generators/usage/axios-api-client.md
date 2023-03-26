# Axios API client

As seen at [the targets](/generators/targets.html) Compas supports generating
API clients based on Axios. Even though we support different target languages
(JavaScript and TypeScript) and runtimes (Node.js, browser, React-Native), the
generated interface looks practically the same over all of them. In this
documented we use the Typescript variant for the broswer runtime

```js
import { Generator } from "@compas/code-gen/experimental";

const generator = new Generator();

generator.generate({
  targetLanguage: "ts",
  outputDirectory: "./src/generated",
  generators: {
    apiClient: {
      target: {
        library: "axios",
        targetRuntime: "browser",
        globalClient: false,
        includeWrapper: "react-query",
      },
    },
  },
});
```

## Usage

Compas generates a specific, fully typed, function for each available route.

```ts
import { apiUserList } from "./generated/user/apiClient";
// declare function apiUserList(axiosInstance: AxiosInstance): Promise<UserListResponse>;

const { users } = await apiUserList(axiosInstance);

// Extra inputs like route params, query params or a request body is typed as well
// declare function apiUserUpdate(axiosInstance: AxiosInstance, params: { userId: string }, body: { receiveNotifications: boolean }): Promise<UserListResponse>;
await apiUserUpdate(
  axiosInstance,
  { userId: "uuid-x" },
  { receiveNotifications: true },
);
```

## React-query wrapper

When `includeWrapper` is set to `react-query`, Compas will generate a wrapper
hook around each API client function using
[TanStack Query](https://tanstack.com/query/latest). The above examples can then
be used like

```tsx
import { ApiProvider } from "./generated/api-client";
import { useUserList, useUserUpdate } from "./generated/reactQueries";

function App() {
  // Wrap your React tree with the generated ApiProvder
  // This step is not necessary when `globalClients` is set to `true`, see below.
  return (
    <ApiProvider
      axiosInstance={axios.create({
        /* ... */
      })}
    >
      <UserList />
    </ApiProvider>
  );
}

function UserList() {
  const { data } = useUserList();
  const { mutate: updateUser } = useUserUpdate(
    {},
    {
      // Automatically invalidate dependant queries when they are provided in the structure
      invalidateQueries: true,
    },
  );

  // Use some form library
  const { onSubmit } = useForm({
    onSubmit: (values) => {
      // Call the mutation
      updateUser({
        params: {
          userId: values.selectedUser,
        },
        body: {
          receiveNotifications: value.receiveNotifications,
        },
      });
    },
  });

  return <div>{/* ... */}</div>;
}
```

## Global client usage

If the `globalClient` option is set to `true` in the generate call, Compas will
generate a `common/api-clients.ts` file. This contains a bare Axios (and
react-query `QueryClient`) instance. This removes the need to pass in the
`AxiosInstance` as the first argument on all generated API calls.

Use this with caution if you do things like server-side-rendering (SSR) for
authenticated pages, as the global client will be reused across different
requests from different users.

Overwriting options on global clients can be done as well:

```ts
import { QueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./generated/api-clients";

axiosIntance.defaults.baseURL = "https://my.site";

// And if you use the react-query wrapper
import { queryClient } from "./generated/api-clients";

queryClient.setDefaultOptions({
  queries: {
    retry: 2,
  },
});
```
