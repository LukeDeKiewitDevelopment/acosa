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
