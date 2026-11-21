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

// The environment wins over the local file, so that CI can supply the key.
if (process.env.STRIPE_SECRET) {
  CONFIG.STRIPE_SECRET = process.env.STRIPE_SECRET
}

// The checkout tests call the Stripe API, so they need a test-mode key.
const LIVE = CONFIG.STRIPE_SECRET
  ? {}
  : {
      skip: 'needs a Stripe test-mode key: set STRIPE_SECRET (or STRIPE_SECRET in test/local-config.js)',
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

async function makeSeneca() {
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
    .use(StripeProvider)

  return seneca.ready()
}
