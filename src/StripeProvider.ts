/* Copyright © 2026 Seneca Project Contributors, MIT License. */
import Stripe from 'stripe'

import Pkg from '../package.json' with { type: 'json' }

type StripeProviderOptions = {
  debug: boolean
}

function StripeProvider(this: any, options: StripeProviderOptions) {
  const seneca: any = this

  const entityBuilder = seneca.export('provider/entityBuilder')

  seneca.message('sys:provider,provider:stripe,get:info', get_info)

  async function get_info(this: any, _msg: any) {
    return {
      ok: true,
      name: 'stripe',
      version: Pkg.version,
    }
  }

  entityBuilder(seneca, {
    provider: {
      name: 'stripe',
    },
    entity: {
      checkout: {
        cmd: {
          save: {
            action: async function (this: any, entize: any, msg: any) {
              const seneca = this

              // const session = await seneca.shared.skd.checkout.sessions.create({
              // });

              return {
                // statusCode: 200,
                // body: JSON.stringify({ url: session.url })
              }
            },
          },
        },
      },
    },
  })

  seneca.prepare(async function (this: any) {
    let seneca = this

    let res = await seneca.post('sys:provider,get:keymap,provider:stripe')

    if (!res.ok) {
      this.fail('secretkey-missing-keymap', res)
    }

    let secretKey = res.keymap.secret.value

    seneca.shared.sdk = new Stripe(secretKey)
  })

  return {
    exports: {
      sdk: () => this.shared.sdk,
    },
  }
}

// Default options.
const defaults: StripeProviderOptions = {
  debug: false,
}

Object.assign(StripeProvider, { defaults })

export default StripeProvider

if ('undefined' !== typeof module) {
  module.exports = StripeProvider
}
