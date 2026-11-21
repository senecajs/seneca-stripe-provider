# Changes

## 0.3.0 2026-11-21

First entry of this change log. Earlier versions are on npm and in the git history.

* Seneca 4: the peer dependency is `seneca` `^4.0.0`. Seneca 3 users stay on `@seneca/stripe-provider@0.2`.
* The entity peer is `@seneca/entity` `^29.0.0`, replacing `seneca-entity`, and the provider peer is `@seneca/provider` `^5.0.0`. The `seneca-promisify` peer is removed, because Seneca 4 has it built in, and so is the unused `@seneca/entity-util` peer.
* Node.js 24 or later (`engines.node` `>=24`).
* `package.json` declares `"type": "commonjs"` (it said `common.js`, which is not a valid value) and a `git+https` repository URL.
* The tests load `@seneca/entity` and `@seneca/provider` by full name, compile against the Seneca 4 and `@seneca/entity` types, and read the Stripe key from `STRIPE_SECRET` as well as `test/local-config.js`. Without a key the checkout tests are reported as skipped.
* Tested offline only: the plugin load test runs; the checkout tests need a Stripe key, so live calls were not tested on Seneca 4.
