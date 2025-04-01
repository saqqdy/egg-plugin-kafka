<div style="text-align: center;" align="center">

# egg-plugin-kafka

An egg plugin that provides a number of built-in methods

[![NPM version][npm-image]][npm-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]
[![License][license-image]][license-url]

[![Sonar][sonar-image]][sonar-url]

</div>

## Install

```bash
# use pnpm
$ pnpm install egg-plugin-kafka

# use yarn
$ yarn add egg-plugin-kafka
```

## Usage

```js
// {app_root}/config/plugin.js
exports.kafka = {
  enable: true,
  package: 'egg-plugin-kafka'
}
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.kafka = {
  limit: '2mb',
  encoding: 'utf8',
  key: 'body'
}
```

## Extends

```js
// {app_root}/app/extend/helper.js
const { helper } = ctx

helper.functionXXX()
```

## Change logs

[Change logs](./CHANGELOG.md)

## Questions & Suggestions

Please open an issue [here](https://github.com/saqqdy/egg-plugin-kafka/issues).

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/egg-plugin-kafka.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-plugin-kafka
[codacy-image]: https://app.codacy.com/project/badge/Grade/f70d4880e4ad4f40aa970eb9ee9d0696
[codacy-url]: https://www.codacy.com/gh/saqqdy/egg-plugin-kafka/dashboard?utm_source=github.com&utm_medium=referral&utm_content=saqqdy/egg-plugin-kafka&utm_campaign=Badge_Grade
[snyk-image]: https://snyk.io/test/npm/egg-plugin-kafka/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-plugin-kafka
[download-image]: https://img.shields.io/npm/dm/egg-plugin-kafka.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-plugin-kafka
[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: LICENSE
[sonar-image]: https://sonarcloud.io/api/project_badges/quality_gate?project=saqqdy_egg-plugin-kafka
[sonar-url]: https://sonarcloud.io/dashboard?id=saqqdy_egg-plugin-kafka
