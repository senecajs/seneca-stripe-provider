/* Copyright © 2026 Seneca Project Contributors, MIT License. */

import Stripe from 'stripe'

import Pkg from '../package.json'

import type {
  StripeProviderOptions,
  CheckoutCreateParams,
  CheckoutListParams,
} from './StripeProviderTypes.js'

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

  // NOTE: entityBuilder is undefined when running `npm run doc`
  entityBuilder &&
    entityBuilder(seneca, {
      provider: {
        name: 'stripe',
      },
      entity: {
        checkout: {
          cmd: {
            save: {
              action: async function (this: any, entize: any, msg: any) {
                const q: CheckoutCreateParams = msg.q
                const session: Stripe.Checkout.Session =
                  await seneca.shared.sdk.checkout.sessions.create(q)
                return entize(session)
              },
            },
            load: {
              action: async function (this: any, entize: any, msg: any) {
                const session: Stripe.Checkout.Session =
                  await seneca.shared.sdk.checkout.sessions.retrieve(msg.q.id)
                return entize(session)
              },
            },
            list: {
              action: async function (this: any, entize: any, msg: any) {
                const q: CheckoutListParams = msg.q
                const result: Stripe.ApiList<Stripe.Checkout.Session> =
                  await seneca.shared.sdk.checkout.sessions.list(q)
                return result.data.map((session: Stripe.Checkout.Session) =>
                  entize(session),
                )
              },
            },
            remove: {
              action: async function (this: any, entize: any, msg: any) {
                const session: Stripe.Checkout.Session =
                  await seneca.shared.sdk.checkout.sessions.expire(msg.q.id)
                return entize(session)
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

    if (secretKey) {
      seneca.shared.sdk = new Stripe(secretKey)
    }
  })

  return {
    exports: {
      sdk: () => seneca.shared.sdk,
    },
  }
}

const defaults: StripeProviderOptions = {
  debug: false,
}

Object.assign(StripeProvider, { defaults })

export default StripeProvider

if ('undefined' !== typeof module) {
  module.exports = StripeProvider
}
