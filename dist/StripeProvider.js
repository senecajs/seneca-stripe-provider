"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Copyright © 2026 Seneca Project Contributors, MIT License. */
const stripe_1 = __importDefault(require("stripe"));
const package_json_1 = __importDefault(require("../package.json"));
function StripeProvider(options) {
    const seneca = this;
    const entityBuilder = seneca.export('provider/entityBuilder');
    seneca.message('sys:provider,provider:stripe,get:info', get_info);
    async function get_info(_msg) {
        return {
            ok: true,
            name: 'stripe',
            version: package_json_1.default.version,
        };
    }
    // TODO: entityBuilder is undefined on npm run doc
    entityBuilder &&
        entityBuilder(seneca, {
            provider: {
                name: 'stripe',
            },
            entity: {
                checkout: {
                    cmd: {
                        save: {
                            action: async function (_entize, msg) {
                                const seneca = this;
                                const { item, mode, success_url, cancel_url } = msg.q;
                                const payload = {
                                    line_items: [item],
                                    mode,
                                    success_url,
                                    cancel_url,
                                };
                                const session = await seneca.shared.sdk.checkout.sessions.create(payload);
                                if (!session?.url) {
                                    return {
                                        ok: false,
                                        why: 'checkout-session-creation-failed',
                                    };
                                }
                                return {
                                    ok: true,
                                    id: session.id,
                                    url: session.url,
                                };
                            },
                        },
                    },
                },
            },
        });
    seneca.prepare(async function () {
        let seneca = this;
        let res = await seneca.post('sys:provider,get:keymap,provider:stripe');
        if (!res.ok) {
            this.fail('secretkey-missing-keymap', res);
        }
        let secretKey = res.keymap.secret.value;
        if (secretKey) {
            seneca.shared.sdk = new stripe_1.default(secretKey);
        }
    });
    return {
        exports: {
            sdk: () => seneca.shared.sdk,
        },
    };
}
// Default options.
const defaults = {
    debug: false,
};
Object.assign(StripeProvider, { defaults });
exports.default = StripeProvider;
if ('undefined' !== typeof module) {
    module.exports = StripeProvider;
}
//# sourceMappingURL=StripeProvider.js.map