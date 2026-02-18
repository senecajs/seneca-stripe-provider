![Seneca Stripe-Provider](http://senecajs.org/files/assets/seneca-logo.png)

> _Seneca Stripe-Provider_ is a plugin for [Seneca](http://senecajs.org)

Provides access to the Stripe API using the Seneca _provider_
convention. Stripe API entities are represented as Seneca entities so
that they can be accessed using the Seneca entity API and messages.

See [seneca-entity](senecajs/seneca-entity) and the [Seneca Data
Entities
Tutorial](https://senecajs.org/docs/tutorials/understanding-data-entities.html) for more details on the Seneca entity API.

[![npm version](https://img.shields.io/npm/v/@seneca/stripe-provider.svg)](https://npmjs.com/package/@seneca/stripe-provider)
[![build](https://github.com/senecajs/seneca-stripe-provider/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-stripe-provider/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-stripe-provider/badge.svg?branch=main)](https://coveralls.io/github/senecajs/seneca-stripe-provider?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-stripe-provider/badge.svg)](https://snyk.io/test/github/senecajs/seneca-stripe-provider)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/19462/branches/505954/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=19462&bid=505954)
[![Maintainability](https://api.codeclimate.com/v1/badges/f76e83896b731bb5d609/maintainability)](https://codeclimate.com/github/senecajs/seneca-stripe-provider/maintainability)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |

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

## Install

```sh
$ npm install @seneca/stripe-provider
```

<!--START:options-->

## Options

- `debug` : boolean

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

## Supported Entities

### `provider/stripe/checkout`

Wraps [Stripe Checkout Sessions](https://stripe.com/docs/api/checkout/sessions).

| Operation | Method                   | Description                          |
| --------- | ------------------------ | ------------------------------------ |
| Create    | `entity.save$(params)`   | Create a new Stripe Checkout Session |
| Retrieve  | `entity.load$({ id })`   | Retrieve a Checkout Session by ID    |
| List      | `entity.list$(params)`   | List Checkout Sessions               |
| Expire    | `entity.remove$({ id })` | Expire (cancel) a Checkout Session   |
