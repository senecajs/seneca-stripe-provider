"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Copyright © 2026 Seneca Project Contributors, MIT License. */
const Fs = __importStar(require("fs"));
const node_test_1 = require("node:test");
const code_1 = require("@hapi/code");
const seneca_1 = __importDefault(require("seneca"));
const StripeProviderDoc_1 = __importDefault(require("../dist/StripeProviderDoc"));
const __1 = __importDefault(require(".."));
const CONFIG = {};
if (Fs.existsSync(__dirname + '/../test/local-config.js')) {
    Object.assign(CONFIG, require(__dirname + '/../test/local-config.js'));
}
// Stripe client options for the plugin's sdk option.
let SDK = {};
// SENECA_TEST_STRIPE_MOCK names a stripe-mock server, for example
// http://127.0.0.1:12111. The checkout tests then run against it with a dummy
// test-mode key, and never against the Stripe API, whatever else is set.
// stripe-mock accepts only a key of the form sk_test_ plus letters or digits.
const STRIPE_MOCK = process.env.SENECA_TEST_STRIPE_MOCK;
if (STRIPE_MOCK) {
    const mock = new URL(STRIPE_MOCK);
    const protocol = mock.protocol.replace(/:$/, '');
    SDK = {
        host: mock.hostname,
        port: mock.port || ('https' === protocol ? 443 : 80),
        protocol,
    };
    CONFIG.STRIPE_SECRET = 'sk_test_123';
}
// Otherwise the checkout tests call the Stripe API, with a test-mode key
// from STRIPE_SECRET, which wins over the local file so that CI can supply it.
else if (process.env.STRIPE_SECRET) {
    CONFIG.STRIPE_SECRET = process.env.STRIPE_SECRET;
}
const LIVE = CONFIG.STRIPE_SECRET
    ? {}
    : {
        skip: 'needs SENECA_TEST_STRIPE_MOCK (a stripe-mock URL, for example http://127.0.0.1:12111) ' +
            'or STRIPE_SECRET (a Stripe test-mode key, also read from test/local-config.js)',
    };
(0, node_test_1.describe)('stripe-provider', () => {
    (0, node_test_1.test)('load-plugin', async () => {
        (0, code_1.expect)(__1.default).exist();
        (0, code_1.expect)(StripeProviderDoc_1.default).exist();
        const seneca = await makeSeneca();
        (0, code_1.expect)(seneca.find_plugin('StripeProvider')).exist();
        (0, code_1.expect)(await seneca.post('sys:provider,provider:stripe,get:info')).contain({
            ok: true,
            name: 'stripe',
        });
    });
    // The sdk option is an open object: any Stripe client option passes.
    (0, node_test_1.test)('sdk-option', async () => {
        const seneca = await makeSeneca({
            sdk: { maxNetworkRetries: 1, timeout: 20000, telemetry: false },
        });
        (0, code_1.expect)(seneca.find_plugin('StripeProvider')).exist();
    });
    (0, node_test_1.test)('create-checkout', LIVE, async () => {
        const seneca = await makeSeneca();
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
            success_url: 'https://store.example/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://store.example/cancel',
        });
        // console.log('create-checkout ', session)
        (0, code_1.expect)(session.id).exists();
        (0, code_1.expect)(session.url).exists();
        (0, code_1.expect)(session.status).equals('open');
    });
    (0, node_test_1.test)('load-checkout', LIVE, async () => {
        const seneca = await makeSeneca();
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
        });
        (0, code_1.expect)(created.id).exists();
        const loaded = await seneca
            .entity('provider/stripe/checkout')
            .load$(created.id);
        // console.log('load-checkout ', loaded)
        (0, code_1.expect)(loaded.id).equals(created.id);
        (0, code_1.expect)(loaded.status).equals('open');
    });
    (0, node_test_1.test)('list-checkout', LIVE, async () => {
        const seneca = await makeSeneca();
        const sessions = await seneca
            .entity('provider/stripe/checkout')
            .list$({ limit: 5 });
        // console.log('list-checkout ', sessions)
        (0, code_1.expect)(sessions).array();
    });
});
async function makeSeneca(options = { sdk: SDK }) {
    const seneca = (0, seneca_1.default)({ legacy: false })
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
        .use(__1.default, options);
    return seneca.ready();
}
//# sourceMappingURL=StripeProvider.test.js.map