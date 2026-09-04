# ACOSA Launch Readiness Review

## Current status

Based on the current site code and content, the project is close to the refinement brief but still not ready for publication. The major work remaining is not a redesign. It is final compliance and QA work: final contact details, live inventory confirmation, removal of placeholder/demo data, and a final responsive CTA check.

## What is already implemented

Several of the required updates are already present in the codebase and content files:

- Main navigation includes a For Properties path in [src/layouts/Layout.astro](src/layouts/Layout.astro)
- Footer structure includes the expected For Properties and Contact sections in [src/components/custom/footer.tsx](src/components/custom/footer.tsx)
- The Home property-owner section is present in [src/content/pages/home.yaml](src/content/pages/home.yaml)
- The For Properties page structure is largely in place in [src/pages/list-your-property/index.astro](src/pages/list-your-property/index.astro) and [src/content/pages/list-your-property.yaml](src/content/pages/list-your-property.yaml)
- The ACOSA Approved wording is already corrected in the content YAML, including the explanatory copy in [src/content/pages/list-your-property.yaml](src/content/pages/list-your-property.yaml)
- The For Companies flow is mostly following the brief in [src/pages/for-companies/index.astro](src/pages/for-companies/index.astro) and [src/content/pages/for-companies.yaml](src/content/pages/for-companies.yaml)

## Remaining launch blockers

### 1. Final contact details are still placeholders

This is the clearest blocker.

File: [src/content/settings/site.yaml](src/content/settings/site.yaml)

The site still contains placeholder values:

- defaultWhatsapp: [INSERT WHATSAPP LINK]
- enquiryEmail: [INSERT EMAIL]

This means the app is still not using final live contact information for the sitewide CTAs and footer links. The brief explicitly requires final email and WhatsApp details to be confirmed and activated before launch.

### 2. Demo and test property content is still in the repository

This is a serious launch risk because the brief states that no fictional or demo inventory should remain visible in production.

Examples found in content:

- [src/content/properties/new-property.mdoc](src/content/properties/new-property.mdoc)
- [src/content/properties/test2e.mdoc](src/content/properties/test2e.mdoc)
- [src/content/properties/vanessa-test-property.mdoc](src/content/properties/vanessa-test-property.mdoc)

In addition, several property files still contain example-style email values and test-style content, which is not suitable for production.

This means the inventory must be reviewed and cleaned before public launch. The brief specifically says to confirm the approved property inventory with Vanessa and to avoid showing demo stock or placeholder listings.

### 3. The ACOSA Approved trademark wording still appears in source

There is still a remaining trademarked reference in the source comments:

- [src/components/custom/property-detail.tsx](src/components/custom/property-detail.tsx)

The brief is explicit: remove the ™ from ACOSA Approved everywhere. The visible wording on site content is mostly corrected, but a remaining source reference still needs to be removed and a full search should be done to ensure no other occurrences remain.

## Remaining QA work

### 4. Final CTA validation is still required

The brief calls for testing on desktop, tablet, and mobile to confirm:

- all buttons are clickable;
- internal navigation anchors land on the correct section;
- email CTAs resolve to the correct destination;
- WhatsApp CTAs open the correct conversation;
- pre-filled messages work as intended;
- no placeholder links remain.

This is especially important because the project still contains placeholder contact data and all CTA destinations depend on it.

### 5. Responsive review is still required

The brief calls for final image and CTA QA to check:

- faces are not awkwardly cropped;
- luggage and work bags remain visible where relevant;
- hero crops keep useful negative space;
- images do not become excessively tall on mobile;
- the focal subject remains obvious;
- CTA hierarchy remains clear on smaller screens.

This should be treated as a required launch pass, not a final cosmetic check.

### 6. Final factual sign-off is still required

The brief says that all factual property, business-node, and contact information should be confirmed before publication.

This includes:

- approved live inventory;
- final contact details;
- final WhatsApp destination and message;
- any property-level details still awaiting confirmation;
- no duplicate copy or stale content.

## What still needs to happen

### Priority 1 — must be completed before launch

1. Replace the placeholder email and WhatsApp values in [src/content/settings/site.yaml](src/content/settings/site.yaml)
2. Confirm the final live contact details with Vanessa
3. Remove or hide all demo/test property entries from the active inventory
4. Remove the remaining trademark wording reference in [src/components/custom/property-detail.tsx](src/components/custom/property-detail.tsx)
5. Validate all CTA destinations across responsive layouts
6. Confirm the approved property inventory before going live

### Priority 2 — recommended before launch

1. Final review of the For Companies conversion flow in [src/pages/for-companies/index.astro](src/pages/for-companies/index.astro)
2. Final review of the For Properties pacing and visual rhythm in [src/pages/list-your-property/index.astro](src/pages/list-your-property/index.astro)
3. Final mobile/tablet image crop and CTA check
4. Proofread final copy for consistency and duplication

### Priority 3 — final polish

1. Final staging QA
2. Final sign-off from Vanessa on content and inventory
3. Publication-only after all placeholders are removed and validations pass

## Conclusion

The project is close to the brief in structure and direction, but it is not yet launch-ready. The biggest remaining issues are not design changes; they are content hygiene, live contact configuration, property inventory cleanup, and final QA validation. The project should be treated as a final compliance and launch pass before publication.
