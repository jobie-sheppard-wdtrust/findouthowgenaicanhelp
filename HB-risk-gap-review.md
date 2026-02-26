# HB WCAG 2.2 AA Risk Gap Review

## Scope checked
- `HB-spec-v2`
- `HB-risks`

## Conclusion
The current risk sheet is **not fully aligned** with the latest `HB-spec-v2`. Most listed risks are now directly mitigated by Section 10 (Accessibility Requirements), so they are now false positives. There is still a medium-severity gap not currently captured in the risk sheet.

## Additional medium/serious risk missing from `HB-risks`

### N-01 — Focus appearance minimum is not explicitly specified
- **Why this is a risk:** The spec requires a “clearly visible focus indicator,” but does not require WCAG 2.2 focus appearance minimum characteristics (minimum contrast and indicator area/thickness/change).
- **WCAG mapping:** 2.4.13 (AA) Focus Appearance.
- **Severity:** Medium.
- **Spec evidence:** Section 10 says focus must be “clearly visible,” but does not define measurable minimum appearance criteria.
- **Task to resolve (spec update):**
  - Add an explicit focus appearance rule in `HB-spec-v2` Section 10, e.g.:
    - Focus indicator contrast ratio >= 3:1 against adjacent colours.
    - Indicator area/thickness meets WCAG 2.4.13 minimum.
    - Focus style must not rely solely on subtle colour wash/glow.

## False positives in `HB-risks`
These risks are now contradicted by explicit requirements in Section 10 of `HB-spec-v2` and should be downgraded/closed as “covered by spec”:

- **R-001, R-002, R-003, R-004** (keyboard/menu/modal/hover parity concerns now explicitly specified).
- **R-005, R-006** (focus visibility and focus-not-obscured now explicitly specified).
- **R-007, R-008, R-009, R-010, R-011, R-021** (name/role/state, landmarks/headings, status announcements, sequence/focus order, language, and draft↔feedback programmatic association now explicitly specified).
- **R-012, R-013, R-019** (reflow/text-spacing requirements now explicitly specified).
- **R-014** (reduced-motion requirement now explicitly specified; keep animation timing risk under R-022 instead).
- **R-015** (use-of-colour explicitly addressed with emoji + accessible text equivalent requirement).
- **R-016, R-018** (target size and pointer cancellation are now explicitly specified).
- **R-020** (focus destination on view transitions now explicitly specified).

## Risks that should remain open in `HB-risks`
- **R-017** (modal outside-click/Escape causing action rather than neutral dismiss remains potentially problematic; keep under review).
- **R-022** (long auto-updating correction sequence still lacks explicit pause/stop/hide or user skip control requirement for users without reduced-motion preference).

## Tasks to adjust the risk sheet (`HB-risks`)
1. Close or mark as resolved by spec update: `R-001, R-002, R-003, R-004, R-005, R-006, R-007, R-008, R-009, R-010, R-011, R-012, R-013, R-014, R-015, R-016, R-018, R-019, R-020, R-021`.
2. Keep `R-017` and `R-022` open.
3. Add new risk `N-01` above.
4. For each retained/open risk, point evidence to current Section 10 and any conflicting interaction rules so the sheet stays in sync with the spec.
