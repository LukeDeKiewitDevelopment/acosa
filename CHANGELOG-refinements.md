# ACOSA Pre-Launch Refinements — Implementation Notes

This documents what was changed in this pass against the "Pre-Launch Website
Refinements" brief, and what's already correct and how the code enforces
it.

## Already correct, no changes needed
- **Global navigation** (`src/layouts/Layout.astro`): order and links already
  match the brief — Business Nodes | Properties | Why ACOSA? | For Companies
  | For Properties | Contact.
- **ACOSA Approved terminology**: no `™` symbol exists anywhere in the
  codebase already — confirmed by search across all content and components.
- **Home page property-owner section** (`content/pages/home.yaml` →
  `propertyOwnersSection`): copy, image (`ACOSA_14_The_Right_Guest.png`) and
  CTAs already match the brief exactly, and it's rendered full-width/prominent
  in `src/pages/index.astro`.
- **For Companies page**: already ends Teams & Project Stays → Final
  Conversion with no "Have a specific requirement?" section — matches the
  brief's simplified structure.
- **For Properties page** (`content/pages/list-your-property.yaml` +
  `src/pages/list-your-property/index.astro`): section order, anchors
  (`#why-list`, `#whats-included`, `#acosa-review`, `#pricing`, `#apply`) and
  the mapped lifestyle images (`ACOSA_14`, `07`, `08`, `04`, `15`, `16`) were
  already wired up correctly.

## Changes made this pass
1. **Header — added the missing primary nav CTA.** "Find Accommodation" →
   `/business-nodes` is now a visible button in the desktop header and at the
   top of the mobile menu (`components/custom/header.tsx`,
   `components/custom/mobile-menu.tsx`).
2. **Fixed a broken-CTA bug.** `resolveCtaLink()` in `lib/content.ts` had a
   bug where an unconfigured WhatsApp CTA rendered as a literal, non-working
   `href="whatsapp"`. Both email and WhatsApp CTAs now fall back to `/contact`
   until real details are supplied — so no CTA can appear as a button without
   a functioning destination.
3. **Property inventory cleared of fictional/demo data.** Set `published:
   false` on Canal Quarter Guesthouse, Die Eike Gastehuis, Maine Central
   Executive Stay, Menlyn Boutique Hotel, Ridge View Serviced Apartments,
   Sandton Executive Suites, plus the two obvious test entries (`new-property`,
   `test2e`) — all used `@...example` contact emails, confirming they're
   seed/demo data. **The Wild Olive Guesthouse, Centurion** is the only
   complete, real property left published, and is now also `featured: true`
   so it surfaces on the home page.
4. **"Coming soon" fallback copy added** (verbatim from the brief) for any
   property grid that could end up empty — on `/properties` and on business
   node pages — instead of showing a blank section.
5. **Added the missing "View Pricing" CTA** on the For Properties page's
   Promotional Visibility section, linking to `#pricing` (schema + content +
   template).
6. **Footer rebuilt to the exact 5-column structure** from the brief —
   Explore / For Companies / For Properties / Contact / Legal, with the exact
   links and anchors specified (`components/custom/footer.tsx`). The logo,
   description, copyright and social icons remain in the left info column
   (the brief didn't ask for social links to be removed).

## Still needs Vanessa / your input before launch
- **Email and WhatsApp destinations**: `content/settings/site.yaml` still has
  placeholder values (`enquiryEmail`, `defaultWhatsapp`). Every CTA on the
  site correctly falls back to `/contact` until these are filled in — once
  the real values are added there, all mailto/WhatsApp CTAs site-wide will
  activate automatically.
- **Final confirmation of The Wild Olive Guesthouse** as the sole live
  property, and of any other properties that should go live at launch.
- Final responsive/QA pass (section 11 of the brief) — recommend doing this
  once the above two items are confirmed and a dev preview is available to
  click through on desktop, tablet and mobile.
