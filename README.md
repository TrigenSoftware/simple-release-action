# 🚀 simple-release-action

A simple GitHub Action to automate version bumps, changelogs, and releases using [Conventional Commits](https://conventionalcommits.org).

- 📄 Uses [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) to parse commits, determine the next version, and generate a changelog.
- 🗂️ Supports monorepos and can release multiple packages in a single run.
- 🧩 Flexible and extensible with custom addons for different project types.

For more details, guides and API references, check out the [documentation website](https://simple-release.js.org/github-action/).

> [!TIP]
> New to Conventional Commits? [Check out The Complete Guide](https://simple-release.js.org/getting-started/complete-guide/).

## Usage

1. Create `.simple-release.json` config file with project setup in repository root:

```json
{
  "project": ["@simple-release/pnpm#PnpmWorkspacesProject", {
    "mode": "fixed"
  }]
}
```

<details>
<summary>js-config example</summary>

You should install the addon package first, then:

```js
import { PnpmWorkspacesProject } from '@simple-release/pnpm'

export const project = new PnpmWorkspacesProject({
  mode: 'fixed'
})
```

</details>

In this example [@simple-release/pnpm](https://github.com/TrigenSoftware/simple-release/blob/main/packages/pnpm#readme) is used to setup a monorepo project with fixed versioning mode.

Addon will be automatically downloaded and cached by the action when it runs.

You can find other addons in the [simple-release repository](https://github.com/TrigenSoftware/simple-release).

2. Create `.github/workflows/release.yml` with release workflow, like in the example below:

```yaml
name: Release
on:
  issue_comment:
    types: [created, deleted]
  push:
    branches:
      - main
jobs:
  check:
    runs-on: ubuntu-latest
    name: Context check
    outputs:
      continue: ${{ steps.check.outputs.continue }}
      workflow: ${{ steps.check.outputs.workflow }}
    steps:
      - name: Checkout the repository
        uses: actions/checkout@v4
      - name: Context check
        id: check
        uses: trigensoftware/simple-release-action@v1
        with:
          workflow: check
          github-token: ${{ secrets.GITHUB_TOKEN }}
  pull-request:
    runs-on: ubuntu-latest
    name: Pull request
    needs: check
    if: needs.check.outputs.workflow == 'pull-request'
    steps:
      - name: Checkout the repository
        uses: actions/checkout@v4
      - name: Create or update pull request
        uses: trigensoftware/simple-release-action@v1
        with:
          workflow: pull-request
          github-token: ${{ secrets.GITHUB_TOKEN }}
  release:
    runs-on: ubuntu-latest
    name: Release
    needs: check
    if: needs.check.outputs.workflow == 'release'
    steps:
      - name: Checkout the repository
        uses: actions/checkout@v4
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10
      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'
      - name: Install dependencies
        run: pnpm install
      - name: Release
        uses: trigensoftware/simple-release-action@v1
        with:
          workflow: release
          github-token: ${{ secrets.GITHUB_TOKEN }}
          npm-token: ${{ secrets.NPM_TOKEN }}
```

Now every time you push to the `main` branch, the action will create or update a pull request with a version bump and updated changelog if necessary. When the pull request is merged, it will automatically release the project. Also you can comment on the pull request to pass additional options to simple-release:

````md
!simple-release/set-options

```json
{
  "bump": {
    "prerelease": "alpha"
  }
}
```
````

## Documentation

For all action inputs, manual releases, snapshot releases, and maintenance branches, visit the [documentation website](https://simple-release.js.org/github-action/).
