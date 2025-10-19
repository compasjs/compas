# React Fetch API client

This project is created using the
[react-fetch](https://github.com/compasjs/compas/tree/main/examples/react-fetch) template.

## Maintenance mode

Compas is in maintenance mode. The packages will be maintained for the foreseeable future.
New features might be added, but some will also be dropped in favor of other
ecosystem-available libraries. Please don't start new projects using Compas.

## Getting started

- Generate the API client and React query wrappers
  - `node ./scripts/generate.js`
- Run the dev server
  - `npm run dev`

## Structure and features

This example contains the three main components for starting with generated api clients in
your React application.

- A script to generate the api client is located at `scripts/generate.js`. It fetches the
  latest remote structure and generates the typed api client files in `src/generated`.
- In `main.tsx` we set the required `QueryClientProvider` with a global query client from
  react-query
- In `src/App.tsx` there are a few things happening:
  - We set a custom `fetch` instance with a base url. All Compas clients rely on relative
    paths. We generate a helper around `fetch` to automatically add your API base url.
  - We use a generated react-query hook `useDateConvertNumber`. Under the covers it is a
    separately exported function that calls the api, wrapped in `useQuery`.
