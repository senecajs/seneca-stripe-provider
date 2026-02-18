"use strict";
/* Copyright © 2026 Seneca Project Contributors, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
const docs = {
    messages: {
        get_info: {
            desc: 'Get information about the Stripe plugin.',
        },
    },
    entity: {
        checkout: {
            desc: 'A Stripe Checkout Session. Supports save$ (create), load$ (retrieve), list$ (list), and remove$ (expire).',
            cmd: {
                save: {
                    desc: 'Create a new Stripe Checkout Session. Returns the session entity with id, url, status, and all Stripe session fields.',
                },
                load: {
                    desc: 'Retrieve an existing Stripe Checkout Session by ID. Returns the full session entity.',
                },
                list: {
                    desc: 'List Stripe Checkout Sessions. Optionally filter by status, customer, payment_intent, subscription, and more.',
                },
                remove: {
                    desc: 'Expire an open Stripe Checkout Session. Only sessions with status "open" can be expired.',
                },
            },
        },
    },
};
exports.default = docs;
if ('undefined' !== typeof module) {
    module.exports = docs;
}
//# sourceMappingURL=StripeProviderDoc.js.map