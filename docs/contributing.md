---
editLink: false
---

# Contributing

### Development & scripts

Development should be pretty straight forward. Run `compas test` to run the test
suite. Before making a commit, make sure to run `compas lint`. Note that this
automatically tries to fix most issues. All commands in this repo can be run vai
the 'self-hosted' `@compas/cli`. Run `compas help` for an overview. Below a few
commands related to things you could be working on:

**General**:

```
# Format with ESLint & Prettier
compas lint
# Run the tests
compas test (--coverage)
# Update type definition files
compas run types
```

**Documentation**:

```
# Sync README's, changelog, contributing and regenerate API reference
compas run syncMetadata
```

**Code generation, @compas/store structure changes**:

```
compas run generate && compas run types && compas lint
```

### Improving test coverage

There are a bunch of things not covered by tests, there are a few ways to
improve coverage, but let's start by running `compas test --coverage` and
opening `file:///path/to/repo/coverage/lcov-report/index.html` in your browser.

If it is your first time doing this, start by checking out files in the
`generated` directory. Most of these files are partially covered, and it should
be pretty straight forward to find a related function that is tested, and doing
the same for the yet untested function. For new cases related to code
generation, add the missing case in `gen/testing.js` and regenerate with
`compas run generate && compas run types && compas lint`. Then run
`compas test --coverage` again to see that the new case is not yet covered by
tests.

### Debugging tests

Debug that file as if you debug whatever other Node.js script. E.g in Webstorm:
(right-mouse click -> Debug `file.test.js`)

### Publishing

- Ensure you are logged in to npm with `npm whoami`, when logged out;
  `npm login`
- Ensure you have the `main`-branch checked out, and are completely up-to-date
- Write to the changelog
  - Run `compas run changelog`
  - Replace `x.x.x` with the new version (3 times) in `./changelog.md`
  - Write about the changes and how to use it them, in `docs/releases/x.x.x.md`
- Check if types are still generating with `compas run types`
- Sync metadata: `compas run syncMetadata`, this will sync the changelog to the
  docs folder and regenerate the api reference.
- Commit with `chore: prepare release for vX.X.X` and push to main
- Run `compas release --version vX.x.X --otp 111111`. This will build & publish
  all packages
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
