![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js](http://senecajs.org) plugin

# @seneca/stripe-provider

[![npm version](https://img.shields.io/npm/v/@seneca/stripe-provider.svg)](https://npmjs.com/package/@seneca/stripe-provider)
[![build](https://github.com/senecajs/seneca-stripe-provider/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-stripe-provider/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-stripe-provider/badge.svg?branch=main)](https://coveralls.io/github/senecajs/seneca-stripe-provider?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-stripe-provider/badge.svg)](https://snyk.io/test/github/senecajs/seneca-stripe-provider)
[![Maintainability](https://api.codeclimate.com/v1/badges/f76e83896b731bb5d609/maintainability)](https://codeclimate.com/github/senecajs/seneca-stripe-provider/maintainability)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

Provides access to the Stripe API using the Seneca _provider_
convention. Stripe API entities are represented as Seneca entities so
that they can be accessed using the Seneca entity API and messages.
See [seneca-entity](senecajs/seneca-entity) and the [Seneca Data
Entities
Tutorial](https://senecajs.org/docs/tutorials/understanding-data-entities.html) for more details on the Seneca entity API.

## Install

```sh
$ npm install @seneca/stripe-provider
```

## Quick Example

```js
// Setup - get the secret key separately from a vault or environment variable.
Seneca()
  // Load API keys using the seneca-env plugin
  .use('env', {
    var: {
      $STRIPE_SECRETKEY: String,
    },
  })
  .use('provider', {
    provider: {
      stripe: {
        keys: {
          secret: { value: '$STRIPE_SECRETKEY' },
        },
      },
    },
  })
  .use('stripe-provider')

// Create a checkout session
let checkout = await seneca.entity('provider/stripe/checkout').save$({
  mode: 'payment',
  success_url: 'https://example.com/success',
  line_items: [{ price: 'price_xxx', quantity: 1 }],
})

console.log('CHECKOUT SESSION', checkout)

// Retrieve a checkout session by ID
let session = await seneca
  .entity('provider/stripe/checkout')
  .load$({ id: checkout.id })

console.log('SESSION', session)
```

## More Examples

See [test/](test/) for more usage examples.

## Motivation

A [Seneca.js](http://senecajs.org) plugin.

## Support

If you're using this module and need help, you can:

- Post a [github issue](https://github.com/senecajs/seneca-stripe-provider/issues)
- Tweet to [@senecajs](http://twitter.com/senecajs)
- Ask on the [Gitter](https://gitter.im/senecajs/seneca)

## API

### Options

* `debug` : boolean
* `init$` : boolean

### Action Patterns

* [sys:provider,get:info,provider:stripe](#-sysprovidergetinfoproviderstripe-)

### Action Descriptions

### &laquo; `sys:provider,get:info,provider:stripe` &raquo;

Get information about the Stripe plugin.



----------

## Contributing

The [Senecajs org](https://github.com/senecajs/) encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

## Background

Part of the [Senecajs org](https://github.com/senecajs/).
