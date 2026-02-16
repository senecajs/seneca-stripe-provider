"use strict";
/* Copyright © 2026 Seneca Project Contributors, MIT License. */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const code_1 = require("@hapi/code");
const seneca_1 = __importDefault(require("seneca"));
// import SenecaMsgTest from 'seneca-msg-test'
// import { Maintain } from '@seneca/maintain'
const __1 = __importDefault(require(".."));
const __2 = __importDefault(require(".."));
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
    // test('messages', async () => {
    //   const seneca = await makeSeneca()
    //   await (SenecaMsgTest(seneca, BasicMessages)())
    // })
});
async function makeSeneca() {
    const seneca = (0, seneca_1.default)({ legacy: false })
        .test()
        .use('promisify')
        .use('entity')
        // .use('env', {
        // debug: true,
        //   file: [__dirname + '/local-env.js;?'],
        //   var: {
        //     $STRIPE_SECRET: String,
        //   },
        // })
        // .use('provider', {
        //   provider: {
        //     stripe: {
        //       keys: {
        //         secret: { value: '$STRIPE_SECRET' },
        //       },
        //     },
        //   },
        // })
        .use(__2.default, {});
    return seneca.ready();
}
//# sourceMappingURL=StripeProvider.test.js.map