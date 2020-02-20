# CONTRIBUTING

### Development

Development should be pretty straight forward. Run `yarn test --watch` to run
the test suite. Before making a commit, make sure to run `yarn lint`. Note that
this automatically will try to fix most issues that popup.

To test changes to the template, use the following command:
`../lbu/packages/cli/dist/index.js [command]`

Where the folder structure is something like:

```
/lbu        -- the lbu checkout
/lbu-test   -- your test project and also the current working directory
```

### Scripts

A few development utilities are provided in [./scripts](./scripts):

- `node ./scripts/syncMetadata.js`: Copy and paste the root README.md to all
  packages

### Debugging tests

Add in the test file that you want to debug:

```javascript
if (require.main === module) {
  const tape = require("tape");
  const promiseWrap = require("tape-promise");
  const test = promiseWrap.default(tape);
  module.exports(test);
}
```

Debug that file as if you debug whatever other Node.js script.
E.g in Webstorm: (right-mouse click -> Debug `file.test.js`)

### Publishing

- Bump versions in [template package.json](./packages/cli/template/package.json)
  to the new version.
- Write to the changelog
  - New features
  - Breaking changes
- Commit with `[*] Prepare release for vX.X.X`
- Run `yarn release`. This will build & publish all packages
  - Specify the new version
  - Check packages it will publish and send `y`
  - Give a new OTP every time it is asked.

Everything should be published now. To make the repo ready for more development:

- Bump version in root package.json to new version
- Run `yarn`
- Copy SHA of release commit in CHANGELOG.md
- Commit with `[*] Bump @lbu/* to vX.X.X`


### WebStorm

- `Help` > `Edit Custom Properties...` > `idea.javascript.max.evaluation.complexity=80`
- Open `/.prettierrc.js` > `Find Actions` > `Apply Prettier Code Style Rules`
- Open `/.eslintrc.js` > `Find Actions` > `Apply ESLint Code Style Rules`
- `Settings` > `Node.js And NPM` > `Coding assistance for Node.js`
- `Edit configurations...` > `Templates/Node.js`:
    - `V8 Profiling` > `Allow taking heap snapshots`
    - `Configuration` > `Working directory` > `/path/to/checkout/root`
