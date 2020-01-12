# CONTRIBUTING

### Development

Development should be pretty straight forward. Run `yarn build --watch` and
`yarn test --watch` both in their own terminal. Before making a commit, make
sure to run `yarn lint`. Note that this automatically will try to fix most
issues that popup.

### Publishing

- Bump versions in [template package.json](./packages/cli/template/package.json)
  to the new version.
- Run `yarn release`. This will build & publish all packages
  - Specify the new version
  - Check packages it will publish and send `y`
  - Give a new OTP every time it is asked.
