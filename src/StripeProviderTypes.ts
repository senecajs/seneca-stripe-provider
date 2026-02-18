/* Copyright © 2026 Seneca Project Contributors, MIT License. */

// ============================================================
// Plugin Options
// ============================================================

type StripeProviderOptions = {
  debug: boolean
}

// ============================================================
// Primitive / Literal Types
// ============================================================

/** Stripe Checkout Session mode. */
type StripeMode = 'payment' | 'subscription' | 'setup'

/** Lifecycle status of a Checkout Session. */
type StripeSessionStatus = 'open' | 'complete' | 'expired'

/** Payment completion status of a Checkout Session. */
type StripePaymentStatus = 'paid' | 'unpaid' | 'no_payment_required'

/** UI rendering mode for the Checkout page. */
type StripeUiMode = 'hosted' | 'embedded' | 'custom'

/** Whether to collect a billing address. */
type StripeBillingAddressCollection = 'auto' | 'required'

/** Controls when a Stripe Customer record is created for the session. */
type StripeCustomerCreation = 'always' | 'if_required'

/** Controls when to require payment method collection. */
type StripePaymentMethodCollection = 'always' | 'if_required'

/** How tax is applied to a price. */
type StripeTaxBehavior = 'inclusive' | 'exclusive' | 'unspecified'

/** Billing frequency unit for recurring prices. */
type StripeInterval = 'day' | 'week' | 'month' | 'year'

/** Payment capture strategy for the underlying PaymentIntent. */
type StripeCaptureMethod = 'automatic' | 'automatic_async' | 'manual'

/** Whether to save the payment method for future use. */
type StripeSetupFutureUsage = 'on_session' | 'off_session'

// ============================================================
// Nested Types
// ============================================================

/**
 * Inline product definition used within `StripePriceData.product_data`.
 * Use this instead of `product` when you don't have a pre-existing Stripe Product.
 */
type StripeProductData = {
  /** Display name shown to the customer at checkout. Required. */
  name: string
  /** Optional longer description of the product. */
  description?: string
  /** Up to 8 image URLs displayed in the Checkout UI. */
  images?: string[]
  /** Arbitrary key-value metadata attached to the Product object. */
  metadata?: Record<string, string>
  /** Tax code for automatic tax calculation. */
  tax_code?: string
}

/**
 * Inline price definition for a line item.
 * Use this when you don't have a pre-existing Stripe Price object
 * and want to define pricing at checkout time.
 *
 * Either `product` or `product_data` must be provided, not both.
 */
type StripePriceData = {
  /**
   * Three-letter ISO 4217 currency code (e.g. `'usd'`, `'eur'`, `'gbp'`).
   * Required.
   */
  currency: string
  /** ID of an existing Stripe Product. Mutually exclusive with `product_data`. */
  product?: string
  /** Inline product definition. Mutually exclusive with `product`. */
  product_data?: StripeProductData
  /**
   * Unit price in the smallest currency unit (e.g. cents for USD).
   * Mutually exclusive with `unit_amount_decimal`.
   * Example: `2000` = $20.00 USD.
   */
  unit_amount?: number
  /**
   * Unit price as a decimal string with up to 12 decimal places.
   * Useful for currencies that allow sub-cent amounts.
   * Mutually exclusive with `unit_amount`.
   */
  unit_amount_decimal?: string
  /** Recurring billing config. Required when `mode` is `'subscription'`. */
  recurring?: {
    /** How often to bill. */
    interval: StripeInterval
    /** Number of intervals between billings. Defaults to 1. */
    interval_count?: number
  }
  /** How tax is applied to this price. */
  tax_behavior?: StripeTaxBehavior
}

/**
 * A single line item displayed and charged in the Checkout Session.
 *
 * Provide either:
 * - `price` — ID of an existing Stripe Price, or
 * - `price_data` — inline price definition
 */
type StripeLineItem = {
  /** ID of an existing Stripe Price or Plan. */
  price?: string
  /** Inline price definition (alternative to `price`). */
  price_data?: StripePriceData
  /** Number of units. Defaults to 1. */
  quantity?: number
  /** Allow the customer to change the quantity during checkout. */
  adjustable_quantity?: {
    enabled: boolean
    /** Minimum quantity the customer can select. Defaults to 0. */
    minimum?: number
    /** Maximum quantity the customer can select. Defaults to 99. */
    maximum?: number
  }
  /** IDs of fixed tax rates to apply to this line item. */
  tax_rates?: string[]
  /** IDs of tax rates applied dynamically based on customer location. */
  dynamic_tax_rates?: string[]
  /** Arbitrary key-value metadata for this line item. */
  metadata?: Record<string, string>
}

/**
 * Options for the PaymentIntent created during a `payment` mode session.
 * Not valid in `subscription` or `setup` modes.
 */
type StripePaymentIntentData = {
  /** Description shown on the customer's bank statement and in the Dashboard. */
  description?: string
  /** Arbitrary key-value metadata on the PaymentIntent. */
  metadata?: Record<string, string>
  /** Email address to send the payment receipt to. */
  receipt_email?: string
  /** Save the payment method for future use. */
  setup_future_usage?: StripeSetupFutureUsage
  /** When to capture the payment. Defaults to `'automatic'`. */
  capture_method?: StripeCaptureMethod
  /** Statement descriptor (max 22 chars) shown on the customer's bank statement. */
  statement_descriptor?: string
  /** Suffix appended to the account's statement descriptor (max 22 chars). */
  statement_descriptor_suffix?: string
  /** Platform fee in smallest currency unit, taken from the charge (Connect only). */
  application_fee_amount?: number
  /** Stripe Connect account to receive the transfer. */
  on_behalf_of?: string
}

/**
 * Options for the Subscription created during a `subscription` mode session.
 * Not valid in `payment` or `setup` modes.
 */
type StripeSubscriptionData = {
  /** Description for the subscription. */
  description?: string
  /** Arbitrary key-value metadata on the Subscription. */
  metadata?: Record<string, string>
  /** Number of trial days before billing starts. */
  trial_period_days?: number
  /** Unix timestamp to anchor the billing cycle. */
  billing_cycle_anchor?: number
  /** Percentage platform fee taken from each invoice (Connect only). */
  application_fee_percent?: number
  /** Stripe Connect account on whose behalf the subscription is created. */
  on_behalf_of?: string
}

/**
 * A discount applied to the session via a coupon or promotion code.
 * Provide either `coupon` or `promotion_code`, not both.
 */
type StripeDiscount = {
  /** ID of an existing Stripe Coupon. */
  coupon?: string
  /** ID of an existing Stripe PromotionCode. */
  promotion_code?: string
}

/**
 * Recovery configuration shown to customers after a session expires.
 */
type StripeAfterExpiration = {
  recovery?: {
    /** Show a recovery link to the customer after expiry. Required to enable recovery. */
    enabled: boolean
    /** Allow the customer to use promotion codes on the recovered session. */
    allow_promotion_codes?: boolean
  }
}

/**
 * Automatic tax calculation configuration.
 * Requires Stripe Tax to be enabled on your account.
 */
type StripeAutomaticTax = {
  /** Enable automatic tax calculation for this session. */
  enabled: boolean
  /** The account responsible for collecting and remitting tax. */
  liability?: {
    type: 'account' | 'self'
    /** Stripe Connect account ID. Required when `type` is `'account'`. */
    account?: string
  }
}

/**
 * A shipping rate option presented to the customer at checkout.
 * Provide either `shipping_rate` (existing rate ID) or `shipping_rate_data` (inline).
 */
type StripeShippingOption = {
  /** ID of an existing Stripe ShippingRate. */
  shipping_rate?: string
  /** Inline shipping rate definition. */
  shipping_rate_data?: {
    type: 'fixed_amount'
    fixed_amount: { amount: number; currency: string }
    /** Label shown to the customer (e.g. `'Standard shipping'`). */
    display_name: string
    delivery_estimate?: {
      minimum?: { unit: string; value: number }
      maximum?: { unit: string; value: number }
    }
    tax_behavior?: StripeTaxBehavior
    tax_code?: string
    metadata?: Record<string, string>
  }
}

// ============================================================
// Entity Action Param Types
// ============================================================

/**
 * Parameters for creating a Stripe Checkout Session.
 *
 * Pass this as the query object to `entity('provider/stripe/checkout').save$(params)`.
 *
 * @see https://docs.stripe.com/api/checkout/sessions/create
 *
 * @example
 * ```typescript
 * const session = await seneca.entity('provider/stripe/checkout').save$({
 *   mode: 'payment',
 *   line_items: [{
 *     price_data: {
 *       currency: 'usd',
 *       product_data: { name: 'T-shirt' },
 *       unit_amount: 2000,   // $20.00
 *     },
 *     quantity: 1,
 *   }],
 *   success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
 *   cancel_url: 'https://example.com/cancel',
 * })
 * // session.id   → Stripe session ID, e.g. 'cs_test_...'
 * // session.url  → Stripe-hosted checkout URL
 * ```
 */
type CheckoutCreateParams = {
  /** The session mode. Always required. */
  mode: StripeMode

  /**
   * Items to display and charge. Required for `payment` and `subscription` modes.
   * Each item needs either `price` (existing Stripe Price ID) or
   * `price_data` (inline definition). Max 100 items in payment mode.
   */
  line_items?: StripeLineItem[]

  /**
   * URL to redirect to after a successful payment.
   * Supports the `{CHECKOUT_SESSION_ID}` template variable.
   * Required for `hosted` ui_mode.
   */
  success_url?: string

  /**
   * URL to redirect to if the customer cancels or closes the Checkout page.
   * Required for `hosted` ui_mode.
   */
  cancel_url?: string

  /** ID of an existing Stripe Customer to associate with this session. */
  customer?: string

  /** Pre-fills the email field in the checkout form. */
  customer_email?: string

  /**
   * Your reference string for this session. Appears in webhook events and
   * in the Stripe Dashboard. Max 200 characters.
   */
  client_reference_id?: string

  /** Arbitrary key-value metadata attached to the session. */
  metadata?: Record<string, string>

  /**
   * Three-letter ISO 4217 currency code (e.g. `'usd'`, `'eur'`).
   * Required when using `price_data` on line items.
   */
  currency?: string

  /**
   * IETF language tag for the Checkout page locale (e.g. `'en'`, `'fr'`).
   * Use `'auto'` to detect from the browser. Defaults to `'auto'`.
   */
  locale?: string

  /**
   * Unix timestamp (seconds) when this session expires.
   * Must be between 30 minutes and 24 hours from now.
   * Defaults to 24 hours after creation.
   */
  expires_at?: number

  /** UI rendering mode. Defaults to `'hosted'` (Stripe-hosted redirect). */
  ui_mode?: StripeUiMode

  /** Allow customers to enter promotion codes during checkout. */
  allow_promotion_codes?: boolean

  /** Whether to collect the customer's billing address. */
  billing_address_collection?: StripeBillingAddressCollection

  /** Controls when a Stripe Customer object is created for this session. */
  customer_creation?: StripeCustomerCreation

  /**
   * Explicit list of payment method types to present (e.g. `['card', 'paypal']`).
   * If omitted, Stripe automatically shows the most relevant methods for the
   * customer's country and browser.
   */
  payment_method_types?: string[]

  /** Payment method types to explicitly exclude from the session. */
  excluded_payment_method_types?: string[]

  /** Whether to always collect a payment method or only when required. */
  payment_method_collection?: StripePaymentMethodCollection

  /**
   * Options for the PaymentIntent created by this session.
   * Only valid in `payment` mode.
   */
  payment_intent_data?: StripePaymentIntentData

  /** Collect a shipping address from the customer. */
  shipping_address_collection?: {
    /** ISO 3166-1 alpha-2 country codes permitted for shipping. */
    allowed_countries: string[]
  }

  /** Shipping rate options presented to the customer. */
  shipping_options?: StripeShippingOption[]

  /** Configure automatic tax calculation (requires Stripe Tax enabled). */
  automatic_tax?: StripeAutomaticTax

  /** Pre-apply a coupon or promotion code to the session. */
  discounts?: StripeDiscount[]

  /** Configure the recovery flow shown when a session expires. */
  after_expiration?: StripeAfterExpiration

  /** Enable adaptive pricing to localise prices for international customers. */
  adaptive_pricing?: { enabled: boolean }

  /**
   * Settings for the Subscription created in `subscription` mode.
   * Only valid in `subscription` mode.
   */
  subscription_data?: StripeSubscriptionData
}

/**
 * Query parameters for listing Stripe Checkout Sessions.
 *
 * Pass this as the query object to `entity('provider/stripe/checkout').list$(params)`.
 *
 * @see https://docs.stripe.com/api/checkout/sessions/list
 *
 * @example
 * ```typescript
 * // List the 20 most recent open sessions
 * const sessions = await seneca.entity('provider/stripe/checkout').list$({
 *   status: 'open',
 *   limit: 20,
 * })
 *
 * // List sessions for a specific customer
 * const sessions = await seneca.entity('provider/stripe/checkout').list$({
 *   customer: 'cus_xxx',
 * })
 * ```
 */
type CheckoutListParams = {
  /** Filter by lifecycle status. */
  status?: StripeSessionStatus

  /** Filter by an existing Stripe Customer ID. */
  customer?: string

  /** Filter by the customer's email address. Max 800 characters. */
  customer_details?: { email: string }

  /** Filter by the PaymentIntent ID associated with the session. */
  payment_intent?: string

  /** Filter by the Subscription ID associated with the session. */
  subscription?: string

  /** Filter by the Payment Link that created the session. */
  payment_link?: string

  /**
   * Filter by creation date. Accepts a Unix timestamp or a range object.
   * @example { gte: 1700000000, lte: 1710000000 }
   */
  created?: number | { gt?: number; gte?: number; lt?: number; lte?: number }

  /** Number of results per page (1–100). Defaults to 10. */
  limit?: number

  /** Return results after this Session ID (forward pagination). */
  starting_after?: string

  /** Return results before this Session ID (backward pagination). */
  ending_before?: string
}

export type {
  StripeProviderOptions,
  StripeMode,
  StripeSessionStatus,
  StripePaymentStatus,
  StripeUiMode,
  StripeBillingAddressCollection,
  StripeCustomerCreation,
  StripePaymentMethodCollection,
  StripeTaxBehavior,
  StripeInterval,
  StripeCaptureMethod,
  StripeSetupFutureUsage,
  StripeProductData,
  StripePriceData,
  StripeLineItem,
  StripePaymentIntentData,
  StripeSubscriptionData,
  StripeDiscount,
  StripeAfterExpiration,
  StripeAutomaticTax,
  StripeShippingOption,
  CheckoutCreateParams,
  CheckoutListParams,
}
