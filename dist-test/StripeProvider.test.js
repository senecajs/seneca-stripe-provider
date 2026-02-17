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
const __1 = __importDefault(require(".."));
const __2 = __importDefault(require(".."));
const CONFIG = {};
if (Fs.existsSync(__dirname + '/../test/local-config.js')) {
    Object.assign(CONFIG, require(__dirname + '/../test/local-config.js'));
}
(0, node_test_1.describe)('stripe-provider', () => {
    (0, node_test_1.test)('load-plugin', async () => {
        (0, code_1.expect)(__2.default).exist();
        (0, code_1.expect)(__1.default).exist();
        const seneca = await makeSeneca();
        (0, code_1.expect)(seneca.find_plugin('StripeProvider')).exist();
        (0, code_1.expect)(await seneca.post('sys:provider,provider:stripe,get:info')).contain({
            ok: true,
            name: 'stripe',
        });
    });
    (0, node_test_1.test)('create-checkout', async () => {
        if (CONFIG.STRIPE_SECRET) {
            const seneca = await makeSeneca();
            const checkoutRes = await seneca
                .entity('provider/stripe/checkout')
                .save$({
                item: {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Item - $1' },
                        unit_amount: 100,
                    },
                    quantity: 1,
                },
                mode: 'payment',
                success_url: 'https://store.example/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'https://store.example/cancel',
            });
            (0, code_1.expect)(checkoutRes.ok).true();
            (0, code_1.expect)(checkoutRes.url).exists();
        }
    });
});
async function makeSeneca() {
    const seneca = (0, seneca_1.default)({ legacy: false })
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
        .use(__2.default);
    return seneca.ready();
}
//# sourceMappingURL=StripeProvider.test.js.map