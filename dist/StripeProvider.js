"use strict";
/* Copyright © 2026 Seneca Project Contributors, MIT License. */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
                            action: async function (entize, msg) {
                                const q = msg.q;
                                const session = await seneca.shared.sdk.checkout.sessions.create(q);
                                return entize(session);
                            },
                        },
                        load: {
                            action: async function (entize, msg) {
                                const session = await seneca.shared.sdk.checkout.sessions.retrieve(msg.q.id);
                                return entize(session);
                            },
                        },
                        list: {
                            action: async function (entize, msg) {
                                const q = msg.q;
                                const result = await seneca.shared.sdk.checkout.sessions.list(q);
                                return result.data.map((session) => entize(session));
                            },
                        },
                        remove: {
                            action: async function (entize, msg) {
                                const session = await seneca.shared.sdk.checkout.sessions.expire(msg.q.id);
                                return entize(session);
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
const defaults = {
    debug: false,
};
Object.assign(StripeProvider, { defaults });
exports.default = StripeProvider;
if ('undefined' !== typeof module) {
    module.exports = StripeProvider;
}
//# sourceMappingURL=StripeProvider.js.map