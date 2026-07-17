<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/76113b28-6e45-439b-8178-bc8ab9130d49

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Payment

This project can be configured to accept payments via a payment provider (example: Stripe). To add a payment method:

1. Choose a provider (e.g., Stripe, PayPal) and follow their integration guide.
2. Install the provider SDK (example for Stripe):
   `npm install stripe`
3. Add provider credentials to `.env.local` (example keys for Stripe):
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_PUBLISHABLE_KEY=pk_test_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...` (if using webhooks)
4. Implement server routes to create payment intents, confirm payments, and handle webhooks according to the provider's docs.
5. For testing, use the provider's test mode and sample card numbers (for Stripe see https://stripe.com/docs/testing).

Replace the example provider and keys with whichever payment gateway you choose.

src/main.tsx
src/App.tsx
