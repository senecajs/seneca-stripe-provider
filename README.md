![Seneca Stripe-Provider](http://senecajs.org/files/assets/seneca-logo.png)

> _Seneca Stripe-Provider_ is a plugin for [Seneca](http://senecajs.org)

Provides access to the Tangocard API using the Seneca _provider_
convention. Tangocard API entities are represented as Seneca entities so
that they can be accessed using the Seneca entity API and messages.

See [seneca-entity](senecajs/seneca-entity) and the [Seneca Data
Entities
Tutorial](https://senecajs.org/docs/tutorials/understanding-data-entities.html) for more details on the Seneca entity API.

NOTE: underlying third party SDK needs to be replaced as out of date and has a security issue.

[![npm version](https://img.shields.io/npm/v/@seneca/tangocard-provider.svg)](https://npmjs.com/package/@seneca/tangocard-provider)
[![build](https://github.com/senecajs/seneca-tangocard-provider/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-tangocard-provider/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-tangocard-provider/badge.svg?branch=main)](https://coveralls.io/github/senecajs/seneca-tangocard-provider?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-tangocard-provider/badge.svg)](https://snyk.io/test/github/senecajs/seneca-tangocard-provider)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/19462/branches/505954/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=19462&bid=505954)
[![Maintainability](https://api.codeclimate.com/v1/badges/f76e83896b731bb5d609/maintainability)](https://codeclimate.com/github/senecajs/seneca-tangocard-provider/maintainability)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |

## Quick Example

```js
// Setup - get the key value (<SECRET>) separately from a vault or
// environment variable.
Seneca()
  // Get API keys using the seneca-env plugin
  .use('env', {
    var: {
      $TANGOCARD_APIKEY: String,
      $TANGOCARD_USERTOKEN: String,
    },
  })
  .use('provider', {
    provider: {
      tangocard: {
        keys: {
          apikey: { value: '$TANGOCARD_APIKEY' },
          usertoken: { value: '$TANGOCARD_USERTOKEN' },
        },
      },
    },
  })
  .use('tangocard-provider')

let board = await seneca
  .entity('provider/tangocard/board')
  .load$('<tangocard-board-id>')

Console.log('BOARD', board)

board.desc = 'New description'
board = await board.save$()

Console.log('UPDATED BOARD', board)
```

## Install

```sh
$ npm install @seneca/tangocard-provider @seneca/env
```

<!--START:options-->

## Options

- `debug` : boolean
- `init$` : boolean

<!--END:options-->

<!--START:action-list-->

## Action Patterns

- [sys:provider,get:info,provider:stripe](#-sysprovidergetinfoproviderstripe-)

<!--END:action-list-->

<!--START:action-desc-->

## Action Descriptions

### &laquo; `sys:provider,get:info,provider:stripe` &raquo;

Get information about the Stripe plugin.

---

<!--END:action-desc-->
