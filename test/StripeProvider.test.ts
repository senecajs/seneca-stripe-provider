/* Copyright © 2026 Seneca Project Contributors, MIT License. */
import * as Fs from 'fs'

import { describe, test } from 'node:test'
import { expect } from '@hapi/code'

import Seneca from 'seneca'

// The @seneca/entity types add entity() to Seneca.Instance.
import type {} from '@seneca/entity'

import StripeProviderDoc from '../dist/StripeProviderDoc'
import StripeProvider from '..'

const CONFIG: any = {}

if (Fs.existsSync(__dirname + '/../test/local-config.js')) {
  Object.assign(CONFIG, require(__dirname + '/../test/local-config.js'))
}

// Stripe client options for the plugin's sdk option.
let SDK: Record<string, any> = {}

// SENECA_TEST_STRIPE_MOCK names a stripe-mock server, for example
// http://127.0.0.1:12111. The checkout tests then run against it with a dummy
// test-mode key, and never against the Stripe API, whatever else is set.
// stripe-mock accepts only a key of the form sk_test_ plus letters or digits.
const STRIPE_MOCK = process.env.SENECA_TEST_STRIPE_MOCK

if (STRIPE_MOCK) {
  const mock = new URL(STRIPE_MOCK)
  const protocol = mock.protocol.replace(/:$/, '')
  SDK = {
    host: mock.hostname,
    port: mock.port || ('https' === protocol ? 443 : 80),
    protocol,
  }
  CONFIG.STRIPE_SECRET = 'sk_test_123'
}

// Otherwise the checkout tests call the Stripe API, with a test-mode key
// from STRIPE_SECRET, which wins over the local file so that CI can supply it.
else if (process.env.STRIPE_SECRET) {
  CONFIG.STRIPE_SECRET = process.env.STRIPE_SECRET
}

const LIVE = CONFIG.STRIPE_SECRET
  ? {}
  : {
      skip:
        'needs SENECA_TEST_STRIPE_MOCK (a stripe-mock URL, for example http://127.0.0.1:12111) ' +
        'or STRIPE_SECRET (a Stripe test-mode key, also read from test/local-config.js)',
    }

describe('stripe-provider', () => {
  test('load-plugin', async () => {
    expect(StripeProvider).exist()
    expect(StripeProviderDoc).exist()

    const seneca = await makeSeneca()
    expect(seneca.find_plugin('StripeProvider')).exist()

    expect(await seneca.post('sys:provider,provider:stripe,get:info')).contain({
      ok: true,
      name: 'stripe',
    })
  })

  // The sdk option is an open object: any Stripe client option passes.
  test('sdk-option', async () => {
    const seneca = await makeSeneca({
      sdk: { maxNetworkRetries: 1, timeout: 20000, telemetry: false },
    })
    expect(seneca.find_plugin('StripeProvider')).exist()
  })

  test('create-checkout', LIVE, async () => {
    const seneca = await makeSeneca()

    const session = await seneca.entity('provider/stripe/checkout').save$({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Item - $1' },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      success_url:
        'https://store.example/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://store.example/cancel',
    })

    // console.log('create-checkout ', session)
    expect(session.id).exists()
    expect(session.url).exists()
    expect(session.status).equals('open')
  })

  test('load-checkout', LIVE, async () => {
    const seneca = await makeSeneca()

    const created = await seneca.entity('provider/stripe/checkout').save$({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Load Test Item' },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      success_url: 'https://store.example/success',
      cancel_url: 'https://store.example/cancel',
    })

    expect(created.id).exists()

    const loaded = await seneca
      .entity('provider/stripe/checkout')
      .load$(created.id)

    // console.log('load-checkout ', loaded)
    expect(loaded.id).equals(created.id)
    expect(loaded.status).equals('open')
  })

  test('list-checkout', LIVE, async () => {
    const seneca = await makeSeneca()

    const sessions = await seneca
      .entity('provider/stripe/checkout')
      .list$({ limit: 5 })

    // console.log('list-checkout ', sessions)
    expect(sessions).array()
  })
})

async function makeSeneca(options: Record<string, any> = { sdk: SDK }) {
  const seneca = Seneca({ legacy: false })
    .test()
    .use('@seneca/entity')
    .use('@seneca/provider', {
      provider: {
        stripe: {
          keys: {
            secret: { value: CONFIG.STRIPE_SECRET },
          },
        },
      },
    })
    .use(StripeProvider, options)

  return seneca.ready()
}
