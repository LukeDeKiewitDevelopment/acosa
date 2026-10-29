# Keystatic CMS and Dynamic Content Audit

**Project:** ACOSA  
**Status:** Implementation completed; CONDITIONAL readiness  
**Purpose:** Evidence-based audit and implementation record. Changes were limited to the confirmed remediation scope; no production credentials, deployment settings, or client production data were changed.

## 1. Audit objectives

- Establish the actual Astro, Keystatic, content, rendering, storage, and deployment architecture.
- Inventory every public route and meaningful customer-facing content section.
- Trace content from Keystatic or its source of truth to the rendered site.
- Verify whether routine client-editable content is genuinely manageable through Keystatic.
- Test saving, persistence, publishing, rendering, caching, assets, references, and failure handling where access permits.
- Identify the smallest safe remediation steps without redesigning the site or performing destructive migrations.
- Produce an accurate client handover guide based on observed behaviour.

## 2. Evidence rules

- Record file paths, symbols, routes, commands, screenshots, and observed results for material conclusions.
- Distinguish **verified**, **not verified**, **blocked**, and **not applicable**.
- Do not claim a CMS or publishing workflow passed unless it was actually executed and observed.
- Do not include credentials, tokens, private URLs, or other secrets in this report.
- Treat existing hardcoded values as findings only after checking whether they are content, configuration, or application logic.
- Do not change application code, schemas, content, tests, deployment settings, credentials, or production data during the audit unless separately approved.
- Use a safe, reversible test entry only when necessary and available; never overwrite real client content or run destructive production tests.

### Assessment statuses

- **PASS:** verified and working.
- **PARTIAL:** some functionality works, but material issues remain.
- **FAIL:** important functionality is broken.
- **BLOCKED:** verification could not be completed because a prerequisite was unavailable.

An overall PASS is not permitted while important tests remain unverified.

## 3. Current-state architecture

| Area | Finding | Evidence | Status |
|---|---|---|---|
| Framework and version | Astro 6.1.8 with React, Markdoc, Keystatic, and Vercel integrations | `package.json`, `astro.config.mjs` | Verified |
| Routes and layouts | Astro SSR with 12 page files and shared `Layout.astro` | `src/pages`, `src/layouts/Layout.astro` | Verified |
| Keystatic configuration | Cloud storage project `acosa/acosa`; admin integration enabled | `keystatic.config.ts:67-86`, `astro.config.mjs` | Configured; save unverified |
| Collections and singletons | Properties, business nodes, testimonials, four tag collections, five page singletons, site settings | `keystatic.config.ts:89-966`, `src/content.config.ts:542-557` | Verified |
| Content storage | Repository content under `src/content`; Keystatic is configured for cloud storage | `keystatic.config.ts:67-70`, `src/content.config.ts:54-508` | Verified; cloud persistence unverified |
| Content loading/data access | Astro collections and typed helper functions feed pages and components | `src/lib/content.ts:39-320` | Verified |
| Rendering and caching | Server output in Astro/Vercel; selected dynamic routes use `prerender = true` and static paths | `astro.config.mjs`, page route modules | Verified; production invalidation unverified |
| Assets and image handling | Astro image transforms resolve CMS image fields and galleries | `src/lib/content.ts:105-142`, route modules | Verified on rendered routes |
| Authentication and admin access | Keystatic endpoint responds locally; authenticated cloud editing not tested | `/keystatic`, `keystatic.config.ts:67-70` | Blocked |
| Deployment and publishing | Vercel adapter configured; no executed cloud save/deploy cycle | `astro.config.mjs:10-22` | Blocked |

### Content flow

```text
Keystatic edit
  -> persistence/storage
  -> build, preview, or publishing trigger
  -> content loader
  -> page/layout/component
  -> rendered route
```

Document the real flow, including any branches, fallbacks, cache boundaries, and manual steps.

## 4. Sitewide content inventory

Complete one row for every public route and meaningful section. Add rows rather than summarising multiple unrelated sections.

| Route | Section or content item | Current source | Keystatic collection/singleton | Client editable? | Propagation evidence | Required action | Status |
|---|---|---|---|---|---|---|---|
| `/` | Hero, marketing sections, featured properties, nodes, CTAs | `homePage` singleton, collections, site settings | `home`, properties, nodes, tags | Yes for page copy/images; some labels remain code-owned | Rendered locally with 200 | Review hardcoded labels and CTA defaults | Verified |
| `/why-acosa` | Hero, experience, curation, approval, outcomes | `whyAcosaPage` singleton | `whyAcosa` | Yes | Rendered locally with 200 | None identified | Verified |
| `/for-companies` | Hero, audience, features, teams/projects, final CTA | `forCompaniesPage` singleton | `forCompanies` | Yes | Rendered locally with 200 | None identified | Verified |
| `/list-your-property` | Onboarding, value, curation, pricing, updates, joining, form intro | `listYourPropertyPage` singleton and site settings | `listYourProperty` | Yes | Rendered locally with 200 | None identified | Verified |
| `/contact` | Hero, contact routes, links, settings-driven contact actions | `contactPage` and `siteSettings` | `contact`, `siteSettings` | Yes for configured fields | Rendered locally with 200 | Test actual cloud save and form delivery | Partial |
| `/properties` | Published property directory, search, map, filters | `properties`, `businessNodes`, tags | `properties`, `businessNodes`, tag collections | Yes, subject to publishing and allowlist | Rendered locally with 200 | Remove or CMS-manage node allowlist | Partial |
| `/properties/[slug]` | Property detail, gallery, tags, testimonials, contact links, SEO | Published property entry and references | `properties`, `testimonials`, tags | Yes for published entries | Both currently published routes returned 200 | Confirm newly published entries after deployment | Partial |
| `/business-nodes` | Node directory, property map/list, assistance CTA | Published nodes/properties and site settings | `businessNodes`, `properties`, `siteSettings` | Only for allowlisted nodes | Rendered locally with 200 | Make published nodes discoverable without code | Partial |
| `/business-nodes/[province]` | Province node and property listing | Published nodes/properties | `businessNodes`, `properties` | Only for allowlisted nodes | `/business-nodes/gauteng` returned 200 | Validate unknown/empty provinces | Verified |
| `/business-nodes/[province]/[node]` | Node hero, description, highlights, properties, nearby tags | Business node and related collections | `businessNodes`, `properties`, tags | Yes for existing allowlisted nodes | Centurion and Pretoria East returned 200 | Allow CMS-created nodes to generate routes | Partial |
| `/privacy` | Legal policy copy | Hardcoded page source | None | No | Rendered locally with 200 | Decide whether legal copy should be CMS-managed | Finding |
| `/terms` | Terms copy | Hardcoded page source | None | No | Rendered locally with 200 | Decide whether legal copy should be CMS-managed | Finding |

Include, where present:

- Homepage
- About and company information
- Services, products, listings, and detail pages
- Landing and marketing sections
- Navigation, menus, dropdowns, and footer
- Contact details and forms
- FAQs, testimonials, trust indicators, and announcements
- Blog or article collections
- SEO metadata, Open Graph data, and social images
- Legal, delivery, returns, and policy pages
- Error pages, empty states, and unpublished states
- Reusable cards, buttons, badges, headings, and supporting text

## 5. CMS integration findings

| ID | Severity | Finding | File/symbol evidence | Reproduction or observation | Impact | Recommendation | Status |
|---|---|---|---|---|---|---|---|
| CMS-001 | High | Published nodes/properties are restricted by a hardcoded allowlist | `src/lib/content.ts:14-26,39-83,156-183` | A CMS editor can create/publish a new business node, but it will not appear in public listings or generate routes unless a developer adds its ID | Routine publishing is not fully client-editable | Filter by CMS `published` state and valid references, or make the allowlist an explicit CMS setting | Open |
| TYPE-001 | High | Astro type check fails in shared section header | `src/components/custom/section-header.tsx:53` | `npx astro check` reports `lead` possibly null/undefined | Type safety gate is red despite a successful production build | Apply a narrow null guard/refinement and rerun checks | Open |
| CMS-002 | Medium | CMS cloud save, persistence, and publishing cycle was not executable in this environment | Cloud/auth credentials were unavailable | `/keystatic` loaded locally, but no edit/save/production propagation was observed | Live editability and deployment delay remain unverified | Run a reversible authenticated cloud workflow | Blocked |
| CONTENT-001 | Low | Directory and legal page metadata/copy include code-owned defaults or hardcoded text | `src/pages/business-nodes/index.astro:45-59`, `src/pages/properties/index.astro:35-40`, `src/pages/privacy/index.astro`, `src/pages/terms/index.astro` | Values are present in route source rather than CMS fields | Routine copy/SEO changes require code edits for these routes | Add only if client ownership of these pages is required | Open |

Check:

- Storage mode, environment variables, admin routes, authentication, and production configuration.
- Collection/singleton fields, validation, defaults, slugs, references, assets, and rich text.
- Content loaders, path resolution, missing-document handling, optional fields, and fallbacks.
- Duplicate sources of truth, stale imports, obsolete files, and silent hardcoded fallbacks.
- Package compatibility and deprecated or incomplete integration patterns.

## 6. Client editability matrix

| Content type | Client can edit? | Where edited | Code change required? | Rebuild/deploy required? | Preview available? | Limitations or improvement |
|---|---|---|---|---|---|---|
| Marketing page singletons | Yes | Keystatic Pages navigation | No for modeled fields | Likely build/deploy or cloud trigger; unverified | No authenticated preview tested | Confirm deployment trigger and document workflow |
| Properties | Yes, after validation and publishing | Keystatic Properties | No for modeled fields; new node may require code | Publishing/rebuild behaviour unverified | No authenticated preview tested | Remove hardcoded node allowlist |
| Business nodes | Partially | Keystatic Business Nodes | Yes for nodes not in `PUBLIC_BUSINESS_NODE_IDS` | Publishing/rebuild behaviour unverified | No authenticated preview tested | Make public visibility data-driven |
| Testimonials and tags | Yes | Keystatic Content/Tags | No | Unverified | Not tested | Verify reference and unpublish workflow |
| Navigation/footer | Partially | Header/footer code and site settings | Yes for several labels/links | Deployment required | No | Decide which shared links should be structured CMS data |
| Legal pages | No | Source files | Yes | Deployment required | No | CMS-manage only if client ownership is required |

Evaluate field names, descriptions, grouping, required fields, defaults, validation, image replacement, rich text, ordering, shared content, entry creation/removal, preview, publishing expectations, error recovery, and layout safety.

## 7. Rendering, caching, and publishing verification

| Workflow | Steps executed | Expected result | Observed result | Evidence | Status |
|---|---|---|---|---|---|
| Edit existing entry | CMS route opened only; no authenticated edit | Cloud/auth prerequisite unavailable | Not observed | `/keystatic` returned 200 locally | Blocked |
| Save and persist | Not executed | Cloud/auth prerequisite unavailable | Not observed | No safe authenticated session | Blocked |
| Frontend retrieval | Existing repository content loaded | Collection sync and route rendering | Existing content rendered | Build and route checks | Verified |
| Production-style build | `npm run build` | Exit 0 | Build completed with Vercel server output | Astro build output | Verified |
| Image replacement | Not executed | Cloud/auth prerequisite unavailable | Not observed | No authenticated session | Blocked |
| Rich text and optional fields | Existing Markdoc/optional fields rendered | Repository content | Existing routes rendered | Build/runtime checks | Partial |
| Create entry | Not executed | Cloud/auth prerequisite unavailable | Not observed | No authenticated session | Blocked |
| Delete/unpublish entry | Existing unpublished property correctly absent from static route | `published: false` excluded by `getPublishedProperties()` | `/properties/menlyn-boutique-hotel` returned 404 | Route request and source content | Verified for local unpublished behaviour |

Record the actual delay between saving and live visibility. Explain whether a change requires a commit, webhook, deployment, rebuild, revalidation, or another action. Never assume a configured CMS automatically updates production.

## 8. Dynamic content classification

Classify each customer-facing value as one of:

- **CMS-managed:** marketing copy, headings, descriptions, FAQs, testimonials, service information, and reusable sections.
- **Structured CMS data:** navigation, footer links, repeatable cards, products, services, banners, and ordered lists.
- **Application configuration:** technical identifiers, integration settings, feature flags, and developer-controlled settings.
- **Application logic:** behaviour, permissions, validation, calculations, and technical defaults.

| Value or content pattern | Location | Classification | Reason | Duplicate sources? | Action |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 9. Reliability, security, and data integrity

Check route protection, secret handling, rich-text and URL safety, broken references, missing assets, invalid slugs, conflicting routes, malformed content, CMS/storage outages, incomplete publishing, backups, Git history, and recovery procedures.

| ID | Severity | Area | Evidence | Impact | Status |
|---|---|---|---|---|---|
|  |  |  |  |  | Pending |

## 10. Tests and verification

| Check | Command or workflow | Result | Evidence | Status |
|---|---|---|---|---|
| Public routes render |  |  |  | Pending |
| CMS-managed content appears |  |  |  | Pending |
| Navigation and internal links |  |  |  | Pending |
| Images and assets load |  |  |  | Pending |
| Missing optional content |  |  |  | Pending |
| Empty collections |  |  |  | Pending |
| Content references |  |  |  | Pending |
| SEO metadata |  |  |  | Pending |
| Long content layout |  |  |  | Pending |
| Type checking |  |  |  | Pending |
| Linting |  |  |  | Pending |
| Production build |  |  |  | Pending |

Blocked checks must state the missing access, credential, environment, or prerequisite.

## 11. Executive audit report

### Overall status

**PARTIAL — core repository content flow and local routes work, but type checking is failing, new business nodes are not fully client-publishable, and authenticated cloud publishing was not verified.**

Use PASS, PARTIAL, FAIL, or BLOCKED after evidence has been recorded. Include the reasons and the remaining blockers.

### Architecture summary

Astro 6.1.8 is configured for Vercel server output. Keystatic 5.1.0 uses cloud storage for project `acosa/acosa`, while Astro content loaders read repository-backed YAML/MDOC files under `src/content`. Page singletons feed the main marketing routes, collections feed properties/nodes/testimonials/tags, and `Layout.astro` resolves site settings, navigation, contact actions, metadata, and JSON-LD.

### Critical and high-priority issues

- **High:** `PUBLIC_BUSINESS_NODE_IDS` makes node/property publishing only partially dynamic.
- **High:** `npx astro check` fails at `section-header.tsx:53`.
- **Blocked:** authenticated Keystatic save/persistence/publishing and production propagation were not testable.

### Client-editability conclusion

Marketing singleton content and existing property/node records are modeled for CMS editing. The site is not fully client-editable because newly created business nodes require a code change to enter the public allowlist, and navigation/footer/legal/directory copy contains code-owned content.

### Publishing and deployment limitations

The repository is configured for Vercel server output, but the cloud save-to-live path was not observed. The live delay, webhook/deployment trigger, cache invalidation, and authenticated preview workflow remain blocked.

### Client handover recommendation

Do not hand over as fully ready yet. Resolve the node allowlist and type-check failure, then run one reversible authenticated cloud edit through production-style publishing before handover.

### Final readiness decision

**Not ready for unconditional client handover.** Existing local content renders correctly, but the dynamic publishing guarantee and complete client editability are not verified.

## 15. Implementation update

### A. Implementation summary

- Removed the hardcoded business-node publication allowlist. Published business nodes now drive public node directories and routes; published properties are additionally filtered through their referenced node's published state.
- Fixed the `SectionHeader` nullability issue without assertions or suppression.
- Added backward-compatible CMS fields in `siteSettings` for directory copy, main navigation, and footer columns.
- Seeded those fields with the existing navigation/footer/directory values and connected them to the shared layout.
- Preserved Privacy and Terms as code-owned content, as requested.
- Preserved existing navigation dropdown behaviour for business nodes, including dynamically generated node subitems when no explicit subitems are configured.

### B. Hardcoded content audit after implementation

| Location | Remaining content | Decision |
|---|---|---|
| `src/pages/privacy/index.astro` | Privacy policy copy | Intentionally code-owned per confirmed scope |
| `src/pages/terms/index.astro` | Terms and conditions copy | Intentionally code-owned per confirmed scope |
| `src/layouts/Layout.astro` | Fixed technical labels such as the header accommodation action and schema.org organisation name | Remains code-owned interface/technical content |
| `src/pages/business-nodes/[province]/index.astro` | Province-derived headings and empty-state labels | Remains code-owned because it is generated from route/data state |
| `src/pages/business-nodes/[province]/[node].astro` | Route-derived fallback metadata and technical map URL fallback | Remains code-owned because it is generated or technical |
| `src/lib/content.ts` | WhatsApp/email message templates and property-type/province mappings | Remains code-owned application behaviour/configuration |

No hardcoded publication allowlist remains.

### C. Keystatic schema changes

Modified the existing `siteSettings` singleton with:

- `directoryCopy.businessNodes` and `directoryCopy.properties`
- `navigation[]` with optional dropdown `subItems[]`
- `footerColumns[]` with ordered columns and links

Existing content remains compatible because these fields have schema defaults, and the repository content file is seeded with the previous values. No existing keys were renamed or removed.

### D. Files changed

| File | Purpose |
|---|---|
| `src/lib/content.ts` | Remove node allowlist and filter published properties through published referenced nodes |
| `src/content.config.ts` | Add typed site-settings schema for directory copy and shared links |
| `keystatic.config.ts` | Add editor-facing fields and descriptions for the new site-settings content |
| `src/content/settings/site.yaml` | Seed the new CMS fields with existing values |
| `src/layouts/Layout.astro` | Read shared navigation/footer/directory settings and preserve link actions/icons |
| `src/components/custom/footer.tsx` | Accept CMS-provided footer columns |
| `src/components/custom/section-header.tsx` | Fix null-safe lead rendering |
| `src/pages/business-nodes/index.astro` | Read directory title, metadata, and hero copy from site settings |
| `src/pages/properties/index.astro` | Read directory title, metadata, heading, and introduction from site settings |
| `.audit/keystatic-cms-audit.md` | Record implementation results and remaining blockers |

### E. Test report

- `npx astro check` — **PASS**, 0 errors, 0 warnings, 0 hints.
- `npm run build` — **PASS**, Astro server build completed with the Vercel adapter.
- `npm run test:property-search` — **PASS**, 9/9 tests.
- Prettier check for all changed implementation files — **PASS**.
- Runtime route checks — **PASS** for homepage, marketing pages, directory pages, legal pages, `/keystatic`, two published property routes, and two dynamic node routes.
- Unpublished property route — **PASS**, `/properties/menlyn-boutique-hotel` returned 404 while its content remained unpublished.

### F. Remaining blockers

Authenticated Keystatic cloud editing, cloud persistence, deployment/webhook propagation, production cache invalidation, image replacement, and preview remain unverified because external cloud access was not available. The implementation does not claim those workflows passed.

### G. Client-readiness verdict

**CONDITIONALLY READY** — local content loading, dynamic publication filtering, shared CMS-backed navigation/footer/directory content, type checking, build, tests, formatting, and route regressions pass. A reversible authenticated cloud edit and production publishing check are still required before unconditional handover.

## 16. Responsive imagery refinement

- Shortened the For Properties hero image zoom animation from 18 seconds to 15 seconds while retaining `motion-safe` reduced-motion behaviour.
- Adjusted the South Africa map overlay beside the value-section image to use a larger mobile width, responsive padding, and smaller mobile ring treatment so it remains legible without overflowing.
- The shared `Hero`, Astro image fields, and `SaMap` graphic continue to use responsive aspect-ratio containers, `object-cover`/`object-contain`, responsive source widths, and `h-auto w-full` SVG sizing.
- Verified the `/list-your-property` page at 390px, 768px, and 1440px viewport widths through the local browser runtime. No application diagnostics or production-build regressions were introduced.

## 12. Remediation checklist

Only add remediation tasks after the initial findings are recorded. Each task must include a root cause, affected files, smallest safe change, acceptance criteria, dependencies, verification result, and remaining risks.

| Priority | Task | Root cause/files | Acceptance criteria | Dependencies | Verification | Status |
|---|---|---|---|---|---|---|
| High | Remove hardcoded node publication gate | `src/lib/content.ts:14-183` | A newly published CMS node appears in node lists, province routes, related property filters, and generated node routes without code changes | Content visibility rules | Runtime + production workflow | Not started |
| High | Resolve section header type error | `src/components/custom/section-header.tsx:53` | `npx astro check` exits 0 with no errors | None | Astro check | Not started |
| Medium | Verify authenticated cloud publishing | Keystatic cloud project and Vercel deployment | Reversible edit persists, reaches frontend, and observed delay is documented | Credentials/access | Browser and production-style build | Blocked |

Severity definitions:

- **Critical:** broken persistence, data loss, exposed credentials, inaccessible content management, or serious production failure.
- **High:** expected content cannot be updated, major routes use the wrong source, or publishing fails.
- **Medium:** significant hardcoded client content, duplicate models, confusing workflows, or caching defects.
- **Low:** field-label improvements, documentation gaps, or small maintainability issues.

## 13. Client handover guide

Write this section only from the verified implementation. Cover:

1. How to access Keystatic.
2. How to edit existing content.
3. How to add, remove, and reorder repeatable content.
4. How to replace images and provide alt text.
5. How to save and publish.
6. When changes become visible on the live site.
7. What the client must not change without assistance.
8. What to do if content does not appear.

Do not invent admin buttons, routes, publishing steps, or preview behaviour.

## 14. Final verification report

### Tests executed

- `npm run build` — **PASS**, Astro server build completed with Vercel adapter.
- `npm run test:property-search` — **PASS**, 9/9 tests.
- `npx astro check` — **FAIL**, one error at `src/components/custom/section-header.tsx:53`.
- `npx prettier --check ...` — **FAIL**, existing formatting drift across audited files; also reports a parser issue in `Layout.astro` around inline JavaScript braces.
- Local runtime route checks — **PASS** for homepage, marketing pages, directory pages, legal pages, `/keystatic`, two published property routes, and two dynamic node routes.
- Unpublished route check — **PASS**, unpublished `menlyn-boutique-hotel` returned 404.

### Routes and workflows verified

Verified locally: `/`, `/why-acosa`, `/for-companies`, `/list-your-property`, `/contact`, `/properties`, `/business-nodes`, `/privacy`, `/terms`, `/business-nodes/gauteng`, `/business-nodes/gauteng/centurion`, `/business-nodes/gauteng/pretoria-east`, `/properties/cornerhouse-on-conan`, `/properties/the-wild-olive-guesthouse`, and `/keystatic`.

### Build and type-check status

Production build: PASS. Focused tests: PASS. Astro diagnostics: FAIL due to one type error. Formatting check: FAIL.

### Fixes implemented

The node publication gate, shared CMS content gaps, directory hardcoding, and SectionHeader type error were fixed. See the implementation update below.

### Blocked tests

Authenticated Keystatic edit/save, cloud persistence, image replacement, entry creation/deletion, production deployment propagation, cache invalidation, and preview require the relevant cloud credentials/access and a safe reversible test workflow.

### Outstanding issues and limitations

Authenticated cloud save/publish and production propagation remain unverified. Legal pages and technical fallback/interface values remain code-owned by decision. No browser interaction beyond HTTP route checks was performed.

### Final readiness decision

**CONDITIONALLY READY.** Local functionality and code quality checks pass; authenticated cloud publishing and production propagation still require external verification.

### Acceptance criteria

| Criterion | Evidence | Status |
|---|---|---|
| Every public route and meaningful section inventoried | Route files and runtime checks recorded above | Partial |
| Significant customer-facing content has a source of truth | Collections/singletons mapped; code-owned items listed | Partial |
| Routine client-editable content is available through CMS | Main content, directory copy, navigation, footer, nodes, and properties are modeled; cloud workflow remains unverified | Partial |
| Shared content is not unnecessarily duplicated | Shared navigation/footer/directory values use `siteSettings` | Verified locally |
| Schemas are understandable and safe for non-technical editors | Labels/descriptions/validation are substantial | Verified locally |
| Saving, persistence, and publishing are documented and tested | Cloud workflow unavailable | Blocked |
| CMS updates reach the intended frontend locations | Existing repository content verified; live propagation unverified | Blocked |
| Caching does not leave the site unexpectedly stale | Server/static-path behaviour inspected; invalidation unverified | Blocked |
| Images, slugs, references, and metadata work correctly | Existing routes/build pass; full edit matrix unverified | Partial |
| Existing design and functionality are preserved | Route checks and focused tests pass; no redesign performed | Verified locally |
| Relevant tests and production build are recorded | Build, tests, diagnostics, formatting, and routes recorded | Verified |
| Handover guide reflects the actual system | Workflow cannot be completed without cloud access | Blocked |
| Unresolved issues are listed honestly | Findings and blockers recorded | Verified |
