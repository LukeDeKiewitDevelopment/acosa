# ACOSA image audit and replacement guide

Generated from `node scripts/image-audit.mjs`. Run it again after you add or replace images. It lists where each file in `src/assets/images` is used, which files are unused, and which files are exact or near duplicates.

## Duplicates on live pages

| Image                                        | Where it appears                                               | Status                                                                                                           |
| -------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `acosa-library/ACOSA_14_The_Right_Guest.png` | For Properties hero.                                           | Kept as specified by the pre-launch addendum. Home, "For accommodation providers," now uses supplied image 2.11. |
| `corporate-booker/image.jpg`                 | Home, "Booking for someone else?" section. For Companies hero. | Needs one new corporate-booker image for Home.                                                                   |
| `nodes/centurion/heroImage.jpg`              | Pretoria East business node page.                              | Retained for Pretoria East; the supplied location-specific images now serve the other nodes listed below.        |
| `end-of-workday/image.jpg`                   | Was on Home (closing banner) and Why ACOSA? (closing section). | Fixed. Why ACOSA? now uses the unused approved image `ACOSA_12_Practical_Business_Stay.png`.                     |

## Sections that take a new image

Upload each image in Keystatic. The field is already in the editor.

| Page and section                                                     | Keystatic field                                                  | Current state                                                                                                                                |
| -------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Home, hero                                                           | Home Page > Hero > Hero Image                                    | Uses the same supplied doorway image as the Contact page.                                                                                    |
| Home, "Reach the people you actually want to host"                   | Home Page > Property Owners > Image                              | Uses `ACOSA_01_Home_Hero.png`.                                                                                                               |
| Properties and Business Nodes, "ACOSA is growing deliberately"       | Page closing sections                                            | Uses the South Africa image in the shared full-width Home closing layout and navy overlay treatment.                                         |
| Contact, full-page background                                        | Contact Page > Hero > Hero Image                                 | The supplied open-door image sits above the navy base, with a gradient overlay that keeps the welcome copy legible.                          |
| Why ACOSA, header                                                    | Why ACOSA Page > Hero > Hero Image                               | Updated with the supplied guesthouse breakfast image.                                                                                        |
| Why ACOSA, "20+ years" experience                                    | Why ACOSA Page > Experience > Image                              | Added the supplied hospitality professional image.                                                                                           |
| Why ACOSA, "Curated, not crowded"                                    | Why ACOSA Page > Curation > Curation Image                       | Retains its original image; supplied image 2.2 is used in For Properties' standards section.                                                 |
| Why ACOSA, "ACOSA Approved"                                          | Why ACOSA Page > Approved > Image                                | Added the supplied garden courtyard image.                                                                                                   |
| Why ACOSA, outcome section                                           | Closing image section                                            | Uses its existing end-of-workday image in the shared full-width Home closing layout.                                                         |
| For Companies, final CTA                                             | For Companies Page > Final CTA > Image                           | Uses the supplied corporate-travellers image in the shared full-width Home closing layout and navy overlay treatment.                        |
| For Properties, "Give the right audience more ways to discover you." | List Your Property Page > Promotional Visibility > Section Image | Uses supplied image 2.8; reused behind the pricing cards with a navy overlay.                                                                |
| For Properties, "The standard matters because the network matters."  | List Your Property Page > Curation > Section Image               | Replaced the large standards-section image with supplied image 2.2.                                                                          |
| For Properties, "Keep your property information current."            | List Your Property Page > Listing Updates > Section Image        | The supplied guesthouse-room image fills the entire block behind the copy and refresh details with a navy overlay.                           |
| Home, "Booking for someone else?"                                    | Home Page > Corporate bookers > Image                            | Duplicate, see above.                                                                                                                        |
| Business node pages                                                  | Business Nodes > (node) > Hero Image                             | Supplied individual images now serve Bryanston, Centurion, Edenvale, Midrand, Rosslyn and Sandton. Pretoria East retains its existing image. |

Recommended source size is 1600 x 900 px or larger for full-width and hero images, and 1200 x 900 px for split sections. Astro resizes and compresses every image at build time, so upload the full-quality file.

Image 2.11 is stored as `acosa-library/ACOSA_17_Host_Welcome.png` and is used in the Home hero.
The supplied South Africa image is stored as `pages/business-nodes/south-africa-network.png` and is used in the closing network sections on the Properties and Business Nodes pages.

## Tablet and mobile crops

Heroes accept separate tablet and mobile images (`tabletImage` and `mobileImage` on the `Hero` component). They aren't in Keystatic yet. Send the crops with a filename mapping, and they will be wired in per page.

## Files on disk that no page uses

These are copies of images that are in use, or older versions of them. Nothing references them. They are kept until the final images arrive, and can then be deleted.

- `pages/list-your-property/hero.jpg` (same file as `ACOSA_07_Property_Owner_Pride.png`)
- `pages/property-visibility/image.jpg` (same file as `ACOSA_08_Property_Visibility.png`)
- `pages/hero/image.png` and `pages/heroImage.png` (near-identical to images in use)
- `pages/project-team/image.jpg` (near-identical to `ACOSA_06_Project_Team_Stay.png`)
- `pages/for-companies/heroImage.jpg` and `pages/founderStrip/image.jpg` (legacy placeholders)
- `nodes/sandton/heroImage.jpg` (replaced by the supplied Sandton image)
- `acosa-library/ACOSA_02`, `ACOSA_05`, `ACOSA_09` and `ACOSA_10` (same photos as the copies in use under `pages/`)

Unused approved images still available: `ACOSA_13_Extended_Project_Stay.png`.
