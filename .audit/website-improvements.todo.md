# Website improvement brief (navigation, imagery, UX)

## Feature playbook
- [x] 1. `how` over the affected subsystem.
- [ ] 2. `architect` for parallel design exploration.
  - skip: changes are presentational slots in existing components, no new cross-module API; data shapes named inline below.
- [x] 3. Throughput checkpoint
  - [ ] Blocking first steps: image-usage audit script + inspection before any image/background decisions.
  - [ ] Independent workstreams: n/a: one owner, edits land in a shared uncommitted working tree.
  - [ ] Shared mutable state: n/a: single writer (this session).
  - [ ] Smallest safe decomposition: one worker. Delegates in worktrees would branch from HEAD and miss the large uncommitted refinement work; the user has not authorised commits.
- [ ] 4. Delegate code-writing to a subagent.
  - skip: same reason as step 3; inline implementation with review separation via verification on the built site.
- [x] 5. Verify on the matching surface (production build, served, Playwright at 390/768/1024/1440).
- [ ] 6. Rebase into small, ordered commits.
  - skip: user commits on request only (global instruction).
- [ ] 7. If the design is contested, `interrogate` before shipping.
  - skip: not contested; visual choices verified on the built site.
- [ ] 8. Run **Opening a PR**.
  - skip: no commit/PR requested.

## Task items
- [x] Nav: Home reachable (logo already links "/"); add Home to mobile menu.
- [x] Footer shared via Layout (confirm), duplicate-image audit (script).
- [x] Map-inspired backgrounds, each a distinct variant, no repeats.
- [x] Why ACOSA "20+" section and Why ACOSA page imagery.
- [x] "Give the right audience more ways to discover you." section.
- [x] "Keep your property information current." section (expandable, uses unused refreshIncludes).
- [x] Optional CMS image slots for those sections + contact hero.
- [x] Contact: hero image, WhatsApp prompt, LinkedIn link cleaned + shown.
- [x] Reveal-on-scroll + hover, reduced-motion safe, no-JS safe.
- [x] Image audit doc: duplicates, needed images, replacement map.
