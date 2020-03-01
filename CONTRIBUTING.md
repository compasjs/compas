# CONTRIBUTING

### Development

Development should be pretty straight forward. Run `yarn lbu --test watch` to
run the test suite. Before making a commit, make sure to run `yarn lbu lint`.
Note that this automatically will try to fix most issues that popup.

### Scripts

All commands in this repo can be run via the 'self-hosted' `@lbu/cli`. Run
`yarn lbu help` for an overview.

### Debugging tests

Add in the test file that you want to debug:

```javascript
import { mainFn } from "@lbu/stdlib";
import { log } from "@lbu/insight";
import tape from "tape";
import promiseWrap from "tape-promise";

mainFn(import.meta, log, () => {
  const tapeTest = promiseWrap.default(tape);
  test(tapeTest);
});
```

Debug that file as if you debug whatever other Node.js script. E.g in Webstorm:
(right-mouse click -> Debug `file.test.js`)

### Publishing

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

- `Help` > `Edit Custom Properties...` >
  `idea.javascript.max.evaluation.complexity=80`
- Open `/package.json` > `Find Actions` > `Apply Prettier Code Style Rules`
- Open `/.eslintrc.cjs` > `Find Actions` > `Apply ESLint Code Style Rules`
- `Settings` > `Node.js And NPM` > `Coding assistance for Node.js`
- `Edit configurations...` > `Templates/Node.js`:
  - `V8 Profiling` > `Allow taking heap snapshots`
  - `Configuration` > `Working directory` > `/path/to/checkout/root`
