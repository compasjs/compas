# CONTRIBUTING

### Development

Development should be pretty straight forward. Run `yarn build --watch` and
`yarn test --watch` both in their own terminal. Before making a commit, make
sure to run `yarn lint`. Note that this automatically will try to fix most
issues that popup.

To test changes to the template, use the following command:
`../lbu/packages/cli/dist/index.js [command]`

Where the folder structure is something like:

```
/lbu        -- the lbu checkout
/lbu-test   -- your test project and also the current working directory
```

### Scripts

A few development utilities are provided in [./scripts](./scripts):

- `node ./scripts/references.js`: Update all tsconfig references based on the
  dependencies of the package.

### Publishing

- Bump versions in [template package.json](./packages/cli/template/package.json)
  to the new version.
- Write to the changelog
  - New features
  - Breaking changes
  - SHA of previous version
- Commit with `[*] Prepare release for vX.X.X`
- Run `yarn release`. This will build & publish all packages
  - Specify the new version
  - Check packages it will publish and send `y`
  - Give a new OTP every time it is asked.
- Bump version in root package.json to new version
