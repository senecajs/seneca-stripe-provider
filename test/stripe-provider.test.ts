/* Copyright © 2026 Seneca Project Contributors, MIT License. */

import { describe, test } from 'node:test'
import { expect } from '@hapi/code'

import Seneca from 'seneca'
// import SenecaMsgTest from 'seneca-msg-test'
// import { Maintain } from '@seneca/maintain'

import StripeProviderDoc from '..'
import StripeProvider from '..'

describe('tangocard-provider', () => {
  test('happy', async () => {
    expect(StripeProvider).toBeDefined()
    expect(StripeProviderDoc).toBeDefined()

    const seneca = await makeSeneca()

    expect(
      await seneca.post('sys:provider,provider:tangocard,get:info'),
    ).toMatchObject({
      ok: true,
      name: 'tangocard',
    })
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
    .use('env', {
      // debug: true,
      file: [__dirname + '/local-env.js;?'],
      var: {
        $STRIPE_secret: String,
      },
    })
    .use('provider', {
      provider: {
        stripe: {
          keys: {
            secret: { value: '$STRIPE_SECRET' },
          },
        },
      },
    })
    .use(StripeProvider, {
      // fetch: Fetch,
    })

  return seneca.ready()
}
