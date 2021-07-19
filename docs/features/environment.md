# Environment

The `mainFn` function from `@compas/stdlib`, and by extension `mainTestFn` and
`mainBenchFn`, automatically loads the `.env.local` and `.env` files in the root
of the project. The idea is that the `.env` contains default values for a quick
development setup, so a new person on the team can just clone the project and
run it directly. The `.env.local` values take precedence over values defined the
`.env` file, and should be `.gitingore`'d. This is useful when your particular
dev setup is somehow different, ie your not using the `yarn compas docker` based
Postgres instance, but need to connect to a different Postgres instance.

It is expected that production values for these environment variables are
injected by the hosting method of choice.

Use `yarn compas help --check` to see if your `.env.local` is `.gitignore`'d
properly.
