# ACOSA image audit and replacement guide

Generated from `node scripts/image-audit.mjs`. Run it again after you add or replace images. It lists where each file in `src/assets/images` is used, which files are unused, and which files are exact or near duplicates.

## Duplicates on live pages

| Image                                             | Where it appears                                               | Status                                                                                        |
| ------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `acosa-library/ACOSA_17_Host_Welcome_Updated.png` | For Properties hero.                                           | Supplied image 2.11 replaces the previous hero image.                                         |
| `pages/business-traveller-unpacking.png`          | Home business-travel section.                                  | User-supplied man-unpacking photo is the Home section's overlapping secondary image.          |
| `pages/south-africa-flag-map.png`                 | Home, Business Nodes directory.                                | Supplied image 2.12 appears as a subtle decorative background watermark behind both sections. |
| `corporate-booker/image.jpg`                      | Home, "Booking for someone else?" section. For Companies hero. | Needs one new corporate-booker image for Home.                                                |
| `nodes/pretoria-east/heroImage.png`               | Pretoria East business node page.                              | Uses the supplied Pretoria East location image.                                               |
| `end-of-workday/image.jpg`                        | Was on Home (closing banner) and Why ACOSA? (closing section). | Fixed. Why ACOSA? now uses the unused approved image `ACOSA_12_Practical_Business_Stay.png`.  |

## Sections that take a new image

Upload each image in Keystatic. The field is already in the editor.

| Page and section                                                      | Keystatic field                                                  | Current state                                                                                                                                    |
| --------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home, hero                                                            | Home Page > Hero > Hero Image                                    | Uses the same supplied doorway image as the Contact page.                                                                                        |
| Home, "Reach the people you actually want to host"                    | Home Page > Property Owners > Image                              | Uses `ACOSA_11_Independent_Hospitality.png`.                                                                                                     |
| Home, "Not every place to stay is a good place to stay for business." | Home Page > Business Travel > Image                              | Original workspace image stays primary; the supplied man-unpacking image overlaps on the left near the bed's foot.                               |
| Home, "Stay closer to where business takes you."                      | Home Page > Business Nodes                                       | Supplied image 2.12 is a faint background watermark behind the section content.                                                                  |
| Properties and Business Nodes, "ACOSA is growing deliberately"        | Page closing sections                                            | Uses the South Africa image in the shared full-width Home closing layout and navy overlay treatment.                                             |
| Contact, full-page background                                         | Contact Page > Hero > Hero Image                                 | The supplied open-door image sits above the navy base, with a gradient overlay that keeps the welcome copy legible.                              |
| Why ACOSA, header                                                     | Why ACOSA Page > Hero > Hero Image                               | Updated with the supplied guesthouse breakfast image.                                                                                            |
| Why ACOSA, "20+ years" experience                                     | Why ACOSA Page > Experience > Image                              | Added the supplied hospitality professional image.                                                                                               |
| Why ACOSA, "Curated, not crowded"                                     | Why ACOSA Page > Curation > Curation Image                       | Retains its original image; For Properties' standards section uses the supplied business-traveller unpacking image.                              |
| Why ACOSA, "ACOSA Approved"                                           | Why ACOSA Page > Approved > Image                                | Added the supplied garden courtyard image.                                                                                                       |
| Why ACOSA, outcome section                                            | Closing image section                                            | Uses its existing end-of-workday image in the shared full-width Home closing layout.                                                             |
| For Companies, "Start with a more relevant shortlist."                | For Companies Page > Discovery > Background Image                | Uses supplied image 2.14 with a navy overlay behind the shortlist content.                                                                       |
| For Companies, final CTA                                              | For Companies Page > Final CTA > Image                           | Uses the supplied corporate-travellers image in the shared full-width Home closing layout and navy overlay treatment.                            |
| For Companies, "Built for the people behind the booking"              | For Companies Page > Who We Help > Background Image              | Uses supplied image 2.13 in a wide, rounded banner, with the heading and role list on the left.                                                  |
| For Properties, "Give the right audience more ways to discover you."  | List Your Property Page > Promotional Visibility > Section Image | Restores the ReachRings graphic; supplied image 2.8 remains behind the pricing cards with a navy overlay.                                        |
| For Properties, "The standard matters because the network matters."   | List Your Property Page > Curation > Section Image               | Restores the original standards-review image with the existing hospitality-team overlay.                                                         |
| For Properties, "Keep your property information current."             | List Your Property Page > Listing Updates > Section Image        | The supplied guesthouse-room image fills the entire block behind the copy and refresh details with a navy overlay.                               |
| Home, "Booking for someone else?"                                     | Home Page > Corporate bookers > Image                            | Duplicate, see above.                                                                                                                            |
| Business node pages                                                   | Business Nodes > (node) > Hero Image                             | Supplied individual images serve each node's hero and the background of its "Working in" section. The node-detail assistance block is text-only. |
| Business Nodes overview, "Need assistance finding the right area?"    | Business Nodes > Assistance > Background                         | ACOSA 06 fills the section behind its copy with the shared full-width navy overlay treatment.                                                    |

Recommended source size is 1600 x 900 px or larger for full-width and hero images, and 1200 x 900 px for split sections. Page images are generated as responsive WebP variants at quality 75; keep full-quality source files in the content library.

Property cards and property galleries use contain-fit images so the full property photo remains visible on mobile and desktop. Full-bleed editorial and hero images retain deliberate cover crops with focal positions to preserve the established layouts.

Image 2.11 is stored as `acosa-library/ACOSA_17_Host_Welcome_Updated.png` and is used in the For Properties hero.
The supplied South Africa image is stored as `pages/business-nodes/south-africa-network.png` and is used in the Properties closing section. The 2.12 flag-map artwork is used behind the Home and Business Nodes directory sections.

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
