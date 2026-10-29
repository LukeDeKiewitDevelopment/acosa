# UI Typography Baseline

## Baseline — Established 2026-10-28

Confirmed after a site-wide typography audit. Use the shared type utilities
for matching semantic roles; preserve the existing font families and hierarchy.

| Property             | Correct class                 | Size                            |
| -------------------- | ----------------------------- | ------------------------------- |
| Display heading      | `type-display`                | Responsive display scale        |
| Page heading (H1)    | `type-h1`                     | Responsive H1 scale             |
| Section heading (H2) | `type-h2`                     | Responsive H2 scale             |
| Subheading (H3)      | `type-h3`                     | 18px / 20px from medium screens |
| Lead paragraph       | `type-lead`                   | 16px / 18px from medium screens |
| Body paragraph       | `type-body`                   | 16px / 18px from medium screens |
| Supporting text      | `type-small`                  | 14px                            |
| Eyebrow              | `eyebrow` or `eyebrow-accent` | 12px                            |
| Heading font         | `font-heading`                | Montserrat                      |
| Body font            | `font-sans`                   | Poppins                         |

**Pattern notes:**

- Keep the existing typefaces and visual style; standardize by semantic role
  using the established shared utilities in `src/styles/global.css`.
- Use `type-lead` for hero and section-intro copy, `type-body` for regular
  explanatory paragraphs, and `type-small` for supporting details.
- Lead and body paragraphs share Poppins at 16px / 18px from medium screens;
  use color and semantic role to distinguish hero introductions from regular
  explanatory copy.
- Compact controls, navigation, labels, badges, and metadata may retain their
  role-specific smaller sizes.
- Rich-text paragraph styling should match the shared body or lead scale while
  preserving its heading hierarchy.

### Floating Actions — Back to Top

File: `src/components/custom/floating-actions.tsx`
Last updated: 2026-10-28

| Property       | Class                                                   |
| -------------- | ------------------------------------------------------- |
| Background     | `bg-card`                                               |
| Border         | Outline button border                                   |
| Border radius  | `rounded-lg`                                            |
| Text — primary | `text-foreground`; white arrow on navy hover            |
| Spacing        | `size-11 md:size-12`                                    |
| Hover state    | Transparent tile, border, and shadow over navy sections |
| Shadow         | `shadow-md shadow-black/10`; none on navy hover         |
| Accent usage   | None                                                    |

**Pattern notes:**

- The tile becomes transparent only while hovered over a `.surface-navy`
  section; the white arrow remains visible. Over other backgrounds it keeps
  the normal outline-button hover treatment.

### Property Photo Gallery

File: `src/components/custom/property-gallery.tsx`
Last updated: 2026-10-28

| Property         | Class                                  |
| ---------------- | -------------------------------------- |
| Background       | `bg-muted`                             |
| Border           | None                                   |
| Border radius    | `rounded-xl`                           |
| Text — primary   | Image only                             |
| Text — secondary | `bg-navy/80 text-white` counter        |
| Spacing          | Full-bleed image in aspect-ratio frame |
| Hover state      | `group-hover:scale-[1.03]` on desktop  |
| Shadow           | None                                   |
| Accent usage     | None                                   |

**Pattern notes:**

- Use `object-contain` in gallery slides and property cards so portraits and
  landscape photos remain fully visible on mobile and desktop.
- Use responsive WebP sources at quality 75 and lazy-load noninitial gallery
  photos.

### Shared Responsive Images

File: `src/components/custom/image.tsx`
Last updated: 2026-10-28

| Property         | Class or behavior                   |
| ---------------- | ----------------------------------- |
| Background       | None                                |
| Border           | None                                |
| Border radius    | Context-dependent                   |
| Text — primary   | `text-muted-foreground` placeholder |
| Text — secondary | `text-xs italic` placeholder        |
| Spacing          | `h-auto max-w-full`                 |
| Hover state      | None                                |
| Shadow           | None                                |
| Accent usage     | None                                |

**Pattern notes:**

- Generate responsive WebP candidates at quality 75, with intrinsic dimensions,
  async decoding, and lazy loading unless the image is above the fold.
- Use `object-contain` for property photos that must remain fully visible.
  Full-bleed hero and editorial images may keep art-directed `object-cover`.
- The Why ACOSA closing image uses a top-aligned focal position to keep the
  traveller's head in frame within the wide, full-bleed crop.

### Business Node Google Maps Link

File: `src/components/custom/node-detail.tsx`
Last updated: 2026-10-28

| Property         | Class or behavior                            |
| ---------------- | -------------------------------------------- |
| Background       | None                                         |
| Border           | None                                         |
| Border radius    | Focus-visible rounded outline                |
| Text — primary   | `text-white`                                 |
| Text — secondary | None                                         |
| Spacing          | Inline icon and underlined label             |
| Hover state      | Gold underline changes to current text color |
| Shadow           | None                                         |
| Accent usage     | Gold underline                               |

**Pattern notes:**

- Use the location-pin icon before “View on Google Maps” to clearly identify
  the destination link on every business node page.

### Business Node Map Legend

File: `src/components/custom/business-node-explorer.tsx`
Last updated: 2026-10-28

| Property         | Class                                    |
| ---------------- | ---------------------------------------- |
| Background       | None                                     |
| Border           | None                                     |
| Border radius    | None                                     |
| Text — primary   | `type-emphasis` (navy, semibold Poppins) |
| Text — secondary | None                                     |
| Spacing          | Beneath the map                          |
| Hover state      | None                                     |
| Shadow           | None                                     |
| Accent usage     | Navy emphasis                            |

**Pattern notes:**

- Explain map markers and selection behavior using the shared navy emphasis
  style so the guidance is easy to notice and consistent with other lead copy.

### Why ACOSA Editorial Emphasis

File: `src/pages/why-acosa/index.astro`
Last updated: 2026-10-28

| Property         | Class or behavior                         |
| ---------------- | ----------------------------------------- |
| Background       | Existing section surface                  |
| Border           | `border-gold` callout rule                |
| Border radius    | `rounded-xl` icon tile                    |
| Text — primary   | `text-navy` emphasized lead and callout   |
| Text — secondary | `text-white` experience figure label      |
| Spacing          | Inline icon-and-callout grid              |
| Hover state      | None                                      |
| Shadow           | None                                      |
| Accent usage     | Gold icon, rule, and final-word underline |

**Pattern notes:**

- Only the opening curation statement uses larger navy emphasis; following
  explanatory copy stays at the regular body size.
- The curation callout keeps its badge icon and gold rule aligned in one row
  beneath the image; both headline accents use the existing yellow underline.
- The ACOSA Approved section follows the home-page editorial split: text on the
  left and a full-height supporting photograph on the right, stacked on mobile.
- Its gold badge icon is slightly larger (`size-8`) within the existing
  `size-14` rounded icon tile.
- Supporting editorial paragraphs in the experience and approval sections use
  `type-body` consistently. Body paragraphs share the hero lead's 16px / 18px
  Poppins scale site-wide. Closing images remain full-bleed with `object-cover`
  and use a desktop 16:9 frame with top alignment to keep the photographic
  subjects in frame without changing the existing mobile presentation.
- The lead statements in the experience and curation sections share
  `type-emphasis` (`font-sans`, navy, semibold, 18px/20px).
- The shared gold heading underline should match the highlighted word's width
  without extending beyond its edges and use a consistent 3px thickness at all
  viewport sizes.

### Contact Enquiry Routes

File: `src/pages/contact/index.astro`
Last updated: 2026-10-29

| Property         | Class or behavior                                   |
| ---------------- | --------------------------------------------------- |
| Background       | `bg-card/95` route cards over navy hero             |
| Border           | `border-border` with foreground hover               |
| Border radius    | `rounded-xl`                                        |
| Text — primary   | `text-foreground`                                   |
| Text — secondary | `text-foreground/80` detail lists                   |
| Spacing          | `p-5 sm:p-6 md:p-8`; `gap-6`                        |
| Hover state      | `hover:border-foreground/30 hover:-translate-y-0.5` |
| Shadow           | `shadow-[0_18px_40px_-28px_rgb(5_10_60/0.4)]`       |
| Accent usage     | Gold detail bullets and shared route icons          |

**Pattern notes:**

- Keep route titles and descriptions, then show relevant enquiry details as
  concise bullets.
- Place booking, property-application, and WhatsApp actions together beneath
  all route cards; the property route may include a contextual learn-more link.
- On the navy contact surface, use a `type-h2` for the final contact prompt,
  `type-emphasis text-white` for its supporting sentence, and white-filled
  secondary buttons with navy text for high-priority property and social CTAs.

### Home Corporate Booker Image Pair

File: `src/pages/index.astro`
Last updated: 2026-10-29

| Property         | Class or behavior                           |
| ---------------- | ------------------------------------------- |
| Background       | Primary photo with `ring-background` inset  |
| Border           | None                                        |
| Border radius    | `rounded-xl`                                |
| Text — primary   | None                                        |
| Text — secondary | None                                        |
| Spacing          | 42%-width overlay below the lower-left edge |
| Hover state      | None                                        |
| Shadow           | None                                        |
| Accent usage     | Background-colored ring around inset photo  |

**Pattern notes:**

- The corporate-booker section pairs its main image with supplied image 2.5 in
  a 42%-width, 4:3 inset positioned below the lower-left edge, matching the
  site's existing editorial image overlays.

### Who We Help Banner

File: `src/pages/for-companies/index.astro`
Last updated: 2026-10-29

| Property         | Class                                    |
| ---------------- | ---------------------------------------- |
| Background       | `bg-background`                          |
| Border           | None                                     |
| Border radius    | `rounded-xl`                             |
| Text — primary   | `text-foreground`                        |
| Text — secondary | `text-foreground text-sm font-semibold`  |
| Spacing          | `px-6 py-7 sm:px-8 lg:px-10`             |
| Hover state      | `hover:border-gold hover:-translate-y-1` |
| Shadow           | None                                     |
| Accent usage     | Gold heading underline and role icons    |

**Pattern notes:**

- Keep the heading and role list together on the left of the wide photo banner.
- On small screens, stack the text panel above the image to preserve legibility.
- Retain the existing role icons and shared heading treatment.
- Role items reuse the For Properties visibility-network hover: lift slightly,
  shift the top border to gold, and highlight the icon tile.

### Assisted Enquiry Card

File: `src/pages/for-companies/index.astro`
Last updated: 2026-10-29

| Property         | Class or behavior                    |
| ---------------- | ------------------------------------ |
| Background       | `surface-navy bg-navy/60`            |
| Border           | None                                 |
| Border radius    | `rounded-xl`                         |
| Text — primary   | `text-white` via `surface-navy`      |
| Text — secondary | Muted foreground from `surface-navy` |
| Spacing          | `p-7 md:p-9`                         |
| Hover state      | None                                 |
| Shadow           | None                                 |
| Accent usage     | Gold icon and eyebrow                |

**Pattern notes:**

- Keep the panel translucent over the discovery background so the photograph
  remains visible without sacrificing contrast for the assisted-enquiry copy.

### Property Owner Photo Collage

File: `src/pages/list-your-property/index.astro`
Last updated: 2026-10-29

| Property         | Class or behavior                          |
| ---------------- | ------------------------------------------ |
| Background       | `bg-muted` behind the contained main photo |
| Border           | None                                       |
| Border radius    | `rounded-xl`                               |
| Text — primary   | Image alt text                             |
| Text — secondary | None                                       |
| Spacing          | Main photo with lower inset-photo overlaps |
| Hover state      | None                                       |
| Shadow           | None                                       |
| Accent usage     | `ring-background` around inset photos      |

**Pattern notes:**

- Contain the qualification image so its full composition remains visible.
- Use supplied image 2.14 as its only inset photo, overlapping the lower-left
  corner with a background-colored ring.
- Use supplied image 2.10 as a lower-right inset only on the listing-updates
  property photo.
- Pair the acceptance note with the ACOSA Approved badge and link to the
  “Why ACOSA?” page using the shared `TextLink` treatment.
- Keep “JOIN ACOSA” above the dark ACOSA logo, followed by the “How to join
  ACOSA” heading and application steps.
- Add the application-form reassurance immediately beneath both application
  actions.
