/* Copyright © 2026 Seneca Project Contributors, MIT License. */
import * as Fs from 'fs'

import { describe, test } from 'node:test'
import { expect } from '@hapi/code'

import Seneca from 'seneca'
// import SenecaMsgTest from 'seneca-msg-test'
// import { Maintain } from '@seneca/maintain'

import StripeProviderDoc from '..'
import StripeProvider from '..'

const CONFIG: any = {}

if (Fs.existsSync(__dirname + '/../test/local-config.js')) {
  Object.assign(CONFIG, require(__dirname + '/../test/local-config.js'))
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

  test('create-checkout', async () => {
    expect(StripeProvider).exist()
    expect(StripeProviderDoc).exist()
  })

  // test('messages', async () => {
  //   const seneca = await makeSeneca()
  //   await (SenecaMsgTest(seneca, BasicMessages)())
  // })
})

async function makeSeneca() {
  const seneca = Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use('provider', {
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
