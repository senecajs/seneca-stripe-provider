/* Copyright © 2026 Seneca Project Contributors, MIT License. */

const docs = {
  messages: {
    get_info: {
      desc: 'Get information about the Stripe plugin.',
    },

    save_checkout: {
      desc: 'Create a checkout session',
    },
  },
}

export default docs

if ('undefined' !== typeof module) {
  module.exports = docs
}
