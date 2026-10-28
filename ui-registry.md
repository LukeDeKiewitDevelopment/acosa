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
| Body paragraph       | `type-body`                   | 15px                            |
| Supporting text      | `type-small`                  | 14px                            |
| Eyebrow              | `eyebrow` or `eyebrow-accent` | 12px                            |
| Heading font         | `font-heading`                | Montserrat                      |
| Body font            | `font-sans`                   | Poppins                         |

**Pattern notes:**

- Keep the existing typefaces and visual style; standardize by semantic role
  using the established shared utilities in `src/styles/global.css`.
- Use `type-lead` for hero and section-intro copy, `type-body` for regular
  explanatory paragraphs, and `type-small` for supporting details.
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
