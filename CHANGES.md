# Changes

## 0.3.0 2026-11-21

First entry of this change log. Earlier versions are on npm and in the git history.

* Seneca 4: the peer dependency is `seneca` `^4.0.0`. Seneca 3 users stay on `@seneca/stripe-provider@0.2`.
* The entity peer is `@seneca/entity` `^29.0.0`, replacing `seneca-entity`, and the provider peer is `@seneca/provider` `^5.0.0`. The `seneca-promisify` peer is removed, because Seneca 4 has it built in, and so is the unused `@seneca/entity-util` peer.
* Node.js 24 or later (`engines.node` `>=24`).
* Added: the `sdk` option, an open object passed to the Stripe client constructor (`new Stripe(secretKey, sdk)`), for example `{ host, port, protocol }` to use a local stripe-mock server. It defaults to `{}`, which keeps the previous behaviour.
* `package.json` declares `"type": "commonjs"` (it said `common.js`, which is not a valid value) and a `git+https` repository URL.
* The tests load `@seneca/entity` and `@seneca/provider` by full name and compile against the Seneca 4 and `@seneca/entity` types. The checkout tests run against stripe-mock when `SENECA_TEST_STRIPE_MOCK` names it, with a dummy key; otherwise they call the Stripe API with the key in `STRIPE_SECRET` (or `test/local-config.js`), and they are reported as skipped when neither is set.
* Tested against stripe-mock (`stripe/stripe-mock` v0.206.0); live calls to the Stripe API were not tested on Seneca 4.
