# Keystatic in Astro

This template shows how you can use Keystatic in an Astro site.

To setup:

```bash
npm install
```

To run:

```
npm run dev
```

Admin UI: [http://127.0.0.1:4321/keystatic](http://127.0.0.1:4321/keystatic)

Homepage: [http://localhost:4321](http://localhost:4321)

## Analytics

Set `PUBLIC_GA_MEASUREMENT_ID` to the site's GA4 measurement ID in the deployment environment.
Property pages then send `property_view` events and property enquiry/referral click events for
WhatsApp, email, telephone, website, and Google Maps. Each event includes `property_id` and
`property_name`; GA4 also supplies its normal traffic-source attribution, while UTM values and the
referrer are included in the event payload when available.
