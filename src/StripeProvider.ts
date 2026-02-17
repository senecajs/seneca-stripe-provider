/* Copyright © 2026 Seneca Project Contributors, MIT License. */
import Stripe from 'stripe'

import Pkg from '../package.json'

type Currency = 'usd' | 'eur' | 'gbp'
type Mode = 'payment' | 'subscription' | 'setup'

type Item = {
  price_data: {
    currency: Currency
    product_data: { name: string }
    unit_amount: number
  }
  quantity: number
}

type CheckoutQuery = {
  item: Item
  mode: Mode
  success_url: string
  cancel_url: string
}

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
            action: async function (this: any, _entize: any, msg: any) {
              const seneca = this

              const { item, mode, success_url, cancel_url }: CheckoutQuery =
                msg.q

              const payload = {
                line_items: [item],
                mode,
                success_url,
                cancel_url,
              }

              const session: { url: string } =
                await seneca.shared.sdk.checkout.sessions.create(payload)

              if (!session?.url) {
                return {
                  ok: false,
                  why: 'checkout-session-creation-failed',
                }
              }

              return {
                ok: true,
                url: session.url,
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

    if (secretKey) {
      seneca.shared.sdk = new Stripe(secretKey)
    }
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
