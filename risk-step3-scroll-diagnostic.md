# risk-step3.html — Scroll Bug: Root Cause Confirmed

## Confirmed Root Cause
**NVDA browse mode intercepts keyboard events before they reach the page's JavaScript.**

When NVDA is active in browse mode, it captures Arrow, PageUp/PageDown, Home/End keys for its own virtual buffer navigation. These events never reach the DOM, so no amount of JavaScript key handling or CSS layout changes could fix the problem.

## Evidence
| Test | Result |
|------|--------|
| NVDA off, 400% zoom, html.onlineviewer.net | Scrolling works perfectly |
| NVDA on, press NVDA+Space (toggle focus mode), then scroll | Scrolling works perfectly |
| NVDA on, browse mode (default) | Arrow keys delayed 3-4 presses, Home/End/PgUp/PgDn don't work |

## Why This Is Not a WCAG 2.2 AA Failure
The dialog already implements the correct ARIA patterns:
- `role="dialog"` + `aria-modal="true"` — signals to NVDA that it should switch to focus mode
- `tabindex="0"` on the scroll region — makes it a recognized interactive element for NVDA
- Scroll region has `role="region"` with `aria-label` — gives NVDA semantic context
- Focus trap with Tab cycling — standard modal keyboard pattern
- Escape closes the dialog — standard modal keyboard pattern

NVDA's browse/focus mode switching is assistive technology behavior, not a page defect. NVDA users routinely toggle modes with NVDA+Space. WCAG SC 2.1.1 (Keyboard) requires functionality to be operable through a keyboard interface; it does not require specific screen reader mode compatibility.

## Testing Environment
- **Browser**: Microsoft Edge (Chromium)
- **Screen reader**: NVDA
- **Zoom**: 400% via Ctrl+scroll
- **Hosting**: html.onlineviewer.net (iframe-embedded)

## Root Causes Investigated and Ruled Out
1. Flex layout ambiguity (`flex: 1; min-height: 0`) — Switched to CSS Grid, no change
2. Focus target (close button vs scroll region) — Changed focus target, no change
3. Custom JS scroll key handling — Multiple capture/bubble phase approaches, no change
4. `dvh` unit support — Added `vh` fallback, no change
5. Anchor-based positioning — Removed in favor of viewport-centered, no change

## Final State of the Code
- `#riskDialog` uses CSS Grid with `grid-template-rows: auto minmax(0, 1fr)`
- `.risk-dialog-body` has `overflow-y: auto; overscroll-behavior: contain; min-height: 0`
- Scroll region has `tabindex="0"`, `role="region"`, `aria-label="Risk explanation, use arrow keys to scroll"`
- Focus goes to scroll region on open (enables native keyboard scroll in focus mode)
- Custom scroll key handler retained as fallback (capture + bubble phase)
- `vh` fallback before `dvh` for browser compatibility
- Diagnostic overlay removed (was temporary for debugging)
