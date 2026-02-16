"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("../package.json"));
function StripeProvider(options) {
    const seneca = this;
    seneca.message('sys:provider,provider:stripe,get:info', get_info);
    async function get_info(_msg) {
        return {
            ok: true,
            name: 'stripe',
            version: package_json_1.default.version,
        };
    }
    seneca.prepare(async function () {
        // let seneca = this
        //
        // let res = await seneca.post('sys:provider,get:keymap,provider:stripe')
        //
        // if (!res.ok) {
        //   this.fail('secretkey-missing-keymap', res)
        // }
        //
        // let secretKey = res.keymap.secret.value
        //
        // this.shared.sdk = new Stripe('')
    });
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