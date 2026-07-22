# @simple-libs/normalize-package-data

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@simple-libs/normalize-package-data.svg
[npm-url]: https://www.npmjs.com/package/@simple-libs/normalize-package-data

[node]: https://img.shields.io/node/v/@simple-libs/normalize-package-data.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@simple-libs/normalize-package-data
[deps-url]: https://libraries.io/npm/@simple-libs%2Fnormalize-package-data

[size]: https://packagephobia.com/badge?p=@simple-libs/normalize-package-data
[size-url]: https://packagephobia.com/result?p=@simple-libs/normalize-package-data

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/simple-libs/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/simple-libs/actions

[coverage]: https://coveralls.io/repos/github/TrigenSoftware/simple-libs/badge.svg?branch=main
[coverage-url]: https://coveralls.io/github/TrigenSoftware/simple-libs?branch=main

A small library to normalize package data.

## Install

```bash
# pnpm
pnpm add @simple-libs/normalize-package-data
# yarn
yarn add @simple-libs/normalize-package-data
# npm
npm i @simple-libs/normalize-package-data
```

## Usage

```ts
import { normalizePackageData } from '@simple-libs/normalize-package-data'

normalizePackageData({
  name: ' package ',
  version: 'v1.2.3',
  repository: 'conventional-changelog/conventional-changelog'
})
/* {
  name: 'package',
  version: '1.2.3',
  repository: {
    type: 'git',
    url: 'https://github.com/conventional-changelog/conventional-changelog'
  },
  bugs: {
    url: 'https://github.com/conventional-changelog/conventional-changelog/issues'
  },
  homepage: 'https://github.com/conventional-changelog/conventional-changelog#readme'
} */

normalizePackageData({
  bugs: 'support@example.com',
  homepage: 'example.com'
})
/* {
  name: '',
  version: '',
  bugs: {
    email: 'support@example.com'
  },
  homepage: 'http://example.com'
} */
```
