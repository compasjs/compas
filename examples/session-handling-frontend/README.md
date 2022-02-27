# Session handling frontend

This document contains a few code examples for how you can manage the JSON Web
tokens (JWT) created by the [session-handling](../session-handling) example. It
uses [Axios](https://npmjs.com/package/axios),
[nookies](https://npmjs.com/package/nookies) and
[jwt-decode](https://npmjs.com/package/jwt-decode) to store the access and
refresh tokens in cookies, so that they are available on both the client and the
server. So that they can be send via the `Authorization` header to Compas
backends that use the `sessionStore` and `sessionTransport` features from
`@compas/store`.

This is not a security guide, and only advised to follow if the backend does not
read the tokens from cookies.

## Setup

Let's start with the utilities around Nookies;

```ts
// lib/auth.ts
import jwtDecode from "jwt-decode";
import { GetServerSidePropsContext } from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { AuthTokenPairApi } from "../generated/common/types";

/**
 * Use nookies to create cookies from the provided token pair.
 * The `ctx` can be `undefined` when this runs in the browser.
 * It decodes the tokens, so the cookies expire when the tokens expire.
 */
export function createCookiesFromTokenPair(
  ctx: GetServerSidePropsContext | undefined,
  tokenPair: AuthTokenPairApi,
) {
  const accessToken = jwtDecode(tokenPair.accessToken) as any;
  const refreshToken = jwtDecode(tokenPair.refreshToken) as any;

  setCookie(ctx, "accessToken", tokenPair.accessToken, {
    expires: new Date(accessToken.exp * 1000),
    secure: process.env.NODE_ENV === "production",
  });
  setCookie(ctx, "refreshToken", tokenPair.refreshToken, {
    expires: new Date(refreshToken.exp * 1000),
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Remove the access and refresh token cookies
 */
export function removeCookies(ctx: GetServerSidePropsContext | undefined) {
  destroyCookie(ctx, "accessToken");
  destroyCookie(ctx, "refreshToken");
}
```

Since we know that we always want an `accessToken` and `refreshToken`, we can
use these utilties instead of using nookies directly. The next utility that we
need is a bit more complex;

```ts
// lib/auth.ts
import axios, { AxiosRequestConfig } from "axios";
import { GetServerSidePropsContext } from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { apiAuthRefreshTokens } from "../generated/auth/apiClient";
import { AuthTokenPairApi } from "../generated/common/types";

/**
 * Interceptor managing added accces tokens to api calls.
 * If no access token is found, but a refresh token is available, it goes in to the refresh
 * state;
 * - Temporarily adds all new requests to a queue
 * - Calls the refresh tokens endpoint
 *    - If fails, removes the refresh token and just let's all other requests go through
 *    - If successfully, runs all requests in the queue and resolves the current request
 */
export function axiosRefreshTokenInterceptor(
  ctx: GetServerSidePropsContext | undefined,
): (config: AxiosRequestConfig) => Promise<AxiosRequestConfig> {
  let isRefreshing = false;
  const queueWhileRefreshing: (() => AxiosRequestConfig)[] = [];

  const interceptor = async (
    config: AxiosRequestConfig,
  ): Promise<AxiosRequestConfig> => {
    let cookies: AuthTokenPairApi = parseCookies(ctx) as any;

    if (isRefreshing) {
      return new Promise((r) => {
        queueWhileRefreshing.push(r as any);
      }).then(() => interceptor(config));
    }

    if (!cookies.accessToken && cookies.refreshToken) {
      isRefreshing = true;

      try {
        cookies = await apiAuthRefreshTokens(
          axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL }),
          {
            refreshToken: cookies.refreshToken,
          },
        );

        createCookiesFromTokenPair(ctx, cookies);
      } catch {
        // If we can't refresh, we can safely remove the refresh token
        removeCookies(ctx);
      }

      isRefreshing = false;
      while (queueWhileRefreshing.length) {
        queueWhileRefreshing.pop()?.();
      }
    }

    if (cookies.accessToken) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${cookies.accessToken}`;
    }

    return config;
  };

  return interceptor;
}
```

This function provides a scoped Axios interceptor, that can use the refresh
token to fetch new tokens. Making sure that other pending requests wait while
resolving the new tokens. Note that we also accept a
`ctx: GetServerSidePropsContext|undefined` here. This enables us to use the same
interceptor, and utilities both on server and client.

## Usage client side

Now that the setup is done, let's hang it in Next.js, starting with creating the
Axios instance in `pages/_app.page.tsx`:

```tsx
// pages/_app.page.tsx

const [axiosInstance] = useState(() => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  client.interceptors.request.use(axiosRefreshTokenInterceptor(undefined));

  return client;
});
```

Job pretty much done for client side usage. If we have a token, it is
automatically added to the requests, and refreshed when necessary. We are only
missing the 'start' and 'stop' conditions, our login and logout calls.

```tsx
const queryClient = useQueryClient();
const isLoggedIn = useAuthMe();
const login = useAuthLogin({
  onSuccess: (data) => {
    createCookiesFromTokenPair(undefined, data);
    queryClient.invalidateQueries([]);
  },
});
const logout = useAuthLogout({
  onSuccess: () => {
    removeCookies(undefined);
    queryClient.invalidateQueries([]);
  },
});
```

## Usage server side

In server side use, we need to use the `ctx: GetServerSidePropsContext`, so that
nookies can read the tokens from the request. Using it looks pretty much the
same as client side;

```tsx
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  // Note that we pass the 'context' here.
  axiosInstance.interceptors.request.use(axiosRefreshTokenInterceptor(context));

  await queryClient.prefetchQuery(useAuthMe.queryKey(), () =>
    apiAuthMe(axiosInstance),
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
```

## Files and images

Files and images are by convention out of context for sessions. This is done, so
we can use a plain urls provided by the backend and pass it in an
`<img src="url">` html element. See the docs on
[secure file handling](https://compasjs.com/features/file-handling.html#securing-file-downloads).s
