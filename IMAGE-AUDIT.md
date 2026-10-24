# ACOSA image audit and replacement guide

Generated from `node scripts/image-audit.mjs`. Run it again after you add or replace images. It lists where each file in `src/assets/images` is used, which files are unused, and which files are exact or near duplicates.

## Duplicates on live pages

| Image | Where it appears | Status |
| --- | --- | --- |
| `acosa-library/ACOSA_14_The_Right_Guest.png` | Home, "For accommodation providers" section. For Properties hero. | Kept. The pre-launch addendum specifies ACOSA_14 for both places. Supply a second host image only if the client wants them to differ. |
| `corporate-booker/image.jpg` | Home, "Booking for someone else?" section. For Companies hero. | Needs one new corporate-booker image for Home. |
| `acosa-library/ACOSA_04_Hospitality_Assessment.png` and `why-acosa/curation.png` (the same photo) | For Properties, "Curated, not crowded". Why ACOSA?, "Curated, not crowded". | Needs a second assessment image for Why ACOSA?. |
| `nodes/centurion/heroImage.jpg` | Business node pages for Bryanston, Centurion, Edenvale, Midrand, Pretoria East and Rosslyn. | Needs one photo per node. Centurion keeps the current photo. |
| `end-of-workday/image.jpg` | Was on Home (closing banner) and Why ACOSA? (closing section). | Fixed. Why ACOSA? now uses the unused approved image `ACOSA_12_Practical_Business_Stay.png`. |

## Sections that take a new image

Upload each image in Keystatic. The field is already in the editor.

| Page and section | Keystatic field | Current state |
| --- | --- | --- |
| Contact, header | Contact Page > Hero > Hero Image | Interim: approved, previously unused `ACOSA_11_Independent_Hospitality.png`. |
| For Properties, "Give the right audience more ways to discover you." | List Your Property Page > Promotional Visibility > Section Image (optional) | Empty. Shows the audience-reach graphic until an image is added. |
| For Properties, "Keep your property information current." | List Your Property Page > Listing Updates > Section Image (optional) | Empty. Shows the navy panel until an image is added. |
| Home, "Booking for someone else?" | Home Page > Corporate bookers > Image | Duplicate, see above. |
| Why ACOSA?, "Curated, not crowded" | Why ACOSA Page > Curation > Curation Image | Duplicate, see above. |
| Business node pages | Business Nodes > (node) > Hero Image | Five nodes share the Centurion photo. |

Recommended source size is 1600 x 900 px or larger for full-width and hero images, and 1200 x 900 px for split sections. Astro resizes and compresses every image at build time, so upload the full-quality file.

## Tablet and mobile crops

Heroes accept separate tablet and mobile images (`tabletImage` and `mobileImage` on the `Hero` component). They aren't in Keystatic yet. Send the crops with a filename mapping, and they will be wired in per page.

## Files on disk that no page uses

These are copies of images that are in use, or older versions of them. Nothing references them. They are kept until the final images arrive, and can then be deleted.

- `pages/list-your-property/hero.jpg` (same file as `ACOSA_07_Property_Owner_Pride.png`)
- `pages/property-visibility/image.jpg` (same file as `ACOSA_08_Property_Visibility.png`)
- `pages/hero/image.png` and `pages/heroImage.png` (near-identical to images in use)
- `pages/project-team/image.jpg` (near-identical to `ACOSA_06_Project_Team_Stay.png`)
- `pages/for-companies/heroImage.jpg` and `pages/founderStrip/image.jpg` (legacy placeholders)
- `acosa-library/ACOSA_02`, `ACOSA_05`, `ACOSA_09` and `ACOSA_10` (same photos as the copies in use under `pages/`)

Unused approved images still available: `ACOSA_13_Extended_Project_Stay.png`.
