# ACOSA analytics (GA4)

Tracking runs only when `PUBLIC_GA_MEASUREMENT_ID` holds a valid `G-` ID at build time. Without it, the site renders no Google script, no consent banner and no tracking code.

- Bootstrap: `src/layouts/Layout.astro`. It sets consent defaults, then `config`. GA's automatic `page_view` is the only page view.
- Events and consent: `src/scripts/analytics.ts`.
- Banner: `src/components/custom/consent-banner.astro`.
- ID validation: `src/lib/analytics.ts`.

Consent: `analytics_storage` starts as `denied` and becomes `granted` only after the visitor clicks Accept. The choice is stored in `localStorage` under `acosa_consent`. `ad_storage`, `ad_user_data` and `ad_personalization` stay `denied` permanently. "Change your cookie choice" on `/privacy` clears the stored choice and shows the banner again.

## 1. Events

### Client events (per property)

| Event | Fires when | Parameters |
| --- | --- | --- |
| `property_view` | Once per load of a property detail page | `property_id`, `property_name`, `business_node`, `province`, `property_type` |
| `property_whatsapp_click` | WhatsApp button on a property page is clicked | the five property params plus `link_type=whatsapp` |
| `property_email_click` | Email button on a property page is clicked | the five property params plus `link_type=email` |
| `property_phone_click` | Call button on a property page is clicked | the five property params plus `link_type=phone` |
| `property_website_click` | Website button on a property page is clicked | the five property params plus `link_type=website`, `link_domain` |
| `property_maps_click` | Google Maps link on a property page is clicked | the five property params plus `link_type=maps`, `link_domain` |

A button renders only when the property has that field (email, phone, WhatsApp, website, map URL) in Keystatic. If the button is absent, its event cannot fire. New properties are tracked automatically and need no code or configuration.

### Supporting events

| Event | Fires when | Parameters |
| --- | --- | --- |
| `property_ask_acosa_click` | "Ask ACOSA" link on a property page | five property params, `link_type` (and `link_domain` if external) |
| `property_card_click` | Property card title (listings, featured) | five property params of that card, `link_type=internal` |
| `floating_whatsapp_click` | Floating WhatsApp button (every page) | `link_type` |
| `business_node_click` | Business node link in the node explorer or chooser | `link_type` |
| `header_find_accommodation` | "Find accommodation" in the header | `link_type` |
| `menu_find_accommodation` | "Find accommodation" in the mobile menu | `link_type` |
| `properties_map_node_click` | Node marker link on the properties map | `link_type` |
| `cta_click` | Any `CtaLink` without its own tracking key | `link_type`, `link_domain` if external |
| `text_link_click` | Any `TextLink` without its own tracking key | `link_type`, `link_domain` if external |

Other page CTAs send their own key with the same parameters as `cta_click`. Examples include `hero_primary_click`, `home_*`, `companies_*`, `contact_*`, `listing_*`, `node_assistance_click` and `business_node_maps_click`. All clicks also carry `transport_type=beacon`, which is a delivery setting and not a reporting dimension.

Non-property CTAs never carry `property_id` or `property_name`.

## 2. Parameters

| Parameter | Source | Example |
| --- | --- | --- |
| `property_id` | Property slug | `the-wild-olive-guesthouse` |
| `property_name` | Property name | `The Wild Olive Guesthouse` |
| `business_node` | Business node name | `Centurion` |
| `province` | Province name | `Gauteng` |
| `property_type` | Property type label | `Guesthouse` |
| `link_type` | Derived from the link | `email`, `phone`, `whatsapp`, `website`, `maps`, `internal` |
| `link_domain` | Host of an external link (website and maps only) | `www.wildoliveguesthouse.co.za` |

No visitor personal data is sent. Full link URLs are not sent.

## 3. GA admin checklist (client)

1. In GA4, create a web data stream for `https://www.acosa.co.za` and copy its `G-` measurement ID.
2. **Before launch**, register event-scoped custom dimensions under Admin, Custom definitions: `property_id`, `property_name`, `business_node`, `province`, `property_type`, `link_type`. A dimension applies only to events collected after it is registered.
3. Under Admin, Data retention, set event data retention to 14 months.
4. In Vercel, add `PUBLIC_GA_MEASUREMENT_ID` for the **Production** environment only, then redeploy. Pages are prerendered, so the ID is baked in at build time and a redeploy is required.

## 4. Property snapshot

GA4, Explore, Free form:

- Rows: `property_name`
- Columns: `Event name`
- Values: `Event count`
- Filter: `Event name` exactly matches one of `property_view`, `property_whatsapp_click`, `property_email_click`, `property_phone_click`, `property_website_click`, `property_maps_click`

The result shows each property with its views, WhatsApps, emails, calls, website clicks and map clicks. Only visitors who accepted analytics cookies are counted in full.
