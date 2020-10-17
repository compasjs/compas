# CONTRIBUTING

### Development & scripts

Development should be pretty straight forward. Run `yarn lbu test --watch` to
run the test suite. Before making a commit, make sure to run `yarn lbu lint`.
Note that this automatically will try to fix most issues that popup. All
commands in this repo can be run vai the 'self-hosted' `@lbu/cli`. Run
`yarn lbu help` for an overview. Below a few commands related to things you
could be working on:

**General**:

```
# Format with ESLint & Prettier
yarn lbu lint (--watch)
# Run the tests
yarn lbu test (--watch)
# Run coverage test
yarn lbu coverage -- --check-coverage
yarn lbu coverage -- report --reporter lcov
# Link your local lbu checkout to another project
yarn lbu link && yarn lbu linkExternally ../other-project/
```

**Documentation & Typescript types**:

```
# Build docs from index.d.ts files and put in /docs/api.md
yarn lbu typedoc
# Sync content of README.md's based on the README.md in the root
yarn lbu syncMetadata
# Sync assets/examples to the documentation files
yarn lbu syncDocExamples
```

**Code generation, @lbu/store structure changes**:

```
# Generate to ignored files for testing stuff out
yarn lbu generate
# Generate for @lbu/ packages
yarn lbu internal_generate
```

### Improving test coverage

There are a bunch of things not covered by tests, there are a few ways to
improve coverage, but let's start by running `yarn lbu coverage` and opening
`file:///path/to/repo/coverage/lcov-report/index.html` in your browser.

If it is your first time doing this, start by checking out files in the
`generated` directory. Most of these files are partially covered, and it should
be pretty straight forward to find a related function that is tested, and doing
the same for the yet untested function. For new cases related to code
generation, add the missing case in `gen/testing.js` and regenerate with
`yarn lbu gen && yarn lbu lint`. Then run `yarn lbu coverage` again to see that
the new case is not yet covered by tests.

### Debugging tests

Debug that file as if you debug whatever other Node.js script. E.g in Webstorm:
(right-mouse click -> Debug `file.test.js`)

### Publishing

- Ensure you are logged in to npm with `npm whoami`, when logged out;
  `npm login`
- Ensure you have the `main`-branch checked out, and are completely up-to-date
- Write to the changelog
  - Run `yarn lbu changelog`
  - Replace `x.x.x` with the new version (3 times) in `docs/changelog.md`
  - Write about the changes and how to use it them, in `docs/releases/x.x.x.md`
- Run the linter with `yarn lbu lint`
- Commit with `*: prepare release for vX.X.X` and push to master
- Run `yarn release`. This will build & publish all packages
  - Specify the new version
  - Check packages it will publish and send `y`
  - Give a new OTP every time it is asked.

### WebStorm

- `Help` > `Edit Custom Properties...` >
  `idea.javascript.max.evaluation.complexity=80`
- Open `/package.json` > `Find Actions` > `Apply Prettier Code Style Rules`
- Open `/.eslintrc.cjs` > `Find Actions` > `Apply ESLint Code Style Rules`
- `Settings` > `Node.js And NPM` > `Coding assistance for Node.js`
- `Edit configurations...` > `Templates/Node.js`:
  - `V8 Profiling` > `Allow taking heap snapshots`
  - `Configuration` > `Working directory` > `/path/to/checkout/root`
