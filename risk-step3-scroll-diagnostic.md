# risk-step3.html — Scroll Bug Diagnostic Log

## User's Testing Environment (confirmed)
- **Browser**: Microsoft Edge (Chromium)
- **Screen reader**: NVDA (active during testing)
- **Zoom**: 400% via Ctrl+scroll (browser zoom)
- **Hosting**: html.onlineviewer.net (page rendered inside an iframe)

## Symptoms (persistent across all attempts)
1. Arrow keys take 3–4 presses before any visible scrolling occurs
2. Scrolling stops before reaching the bottom of the content (last 1–2 lines cut off)
3. Home / End / PageUp / PageDown have no effect
4. Escape to close the dialog DOES work

## Root Causes Investigated and Ruled Out

### 1. Flex layout ambiguity (RULED OUT)
**Hypothesis**: `flex: 1; min-height: 0` on `.risk-dialog-body` inside a `max-height`-constrained flex parent doesn't reliably resolve the body's height, causing `overflow: hidden` on the dialog to clip content beyond the scroll range.
**Change**: Switched `#riskDialog` from `display: flex` to `display: grid` with `grid-template-rows: auto minmax(0, 1fr)`.
**Result**: No change in behavior. Grid layout is equally robust, so this wasn't the cause.
**Conclusion**: The scroll body IS correctly sized by CSS — the issue is not in how the browser resolves the layout.

### 2. Focus target (close button vs scroll region) (RULED OUT as sole cause)
**Hypothesis**: Native keyboard scrolling only works on the focused scrollable element; focusing the close button prevents native scroll.
**Change**: Changed `openRiskDialog()` to focus `riskDialogScrollRegion` instead of `riskDialogClose`.
**Result**: No change in behavior.
**Conclusion**: With NVDA active, native browser keyboard scrolling may not apply normally. NVDA intercepts keys before the browser's native scroll handler. The custom JS `scrollBy` handler is the actual mechanism, but NVDA may be consuming events before they reach JS.

### 3. Custom JS scroll key handling (RULED OUT as sole cause)
**Hypothesis**: Custom `handleRiskDialogScrollKeys()` with `scrollBy()` and `preventDefault()` should handle scrolling regardless of focus.
**Changes across multiple attempts**: Dialog-level keydown handler, capture-phase routing on window+document, legacy key aliases, keyCode fallbacks.
**Result**: No change in behavior.
**Conclusion**: If events reach JS, the handler works correctly (confirmed by automated tests). The issue is upstream — events may not reach JS, or the scroll values themselves may be wrong.

### 4. dvh unit support (RULED OUT)
**Change**: Added `max-height: calc(100vh - 2rem)` fallback before the `dvh` line.
**Result**: No change. Edge supports `dvh`, and the vh fallback matches anyway.

## Active Hypotheses (not yet confirmed or ruled out)

### A. NVDA browse mode intercepting keyboard events (HIGH probability)
**Theory**: NVDA in browse mode intercepts Arrow, PageUp/PageDown, Home/End for virtual buffer navigation. These events never reach the page's JavaScript. `aria-modal="true"` should trigger focus mode, but:
- The scroll region had `tabindex="-1"` — NVDA may not recognize non-tabbable elements as interactive
- NVDA's mode switching between browse/focus may be inconsistent inside iframes
- The "3–4 presses before scrolling" could be NVDA initially processing keys in browse mode before eventually passing them through

**Test added**: Changed scroll region to `tabindex="0"` so NVDA should treat it as a tabbable form control and pass keys through in focus mode.

**What to observe**: Does the diagnostic panel (Ctrl+Shift+D) show events arriving? If `events captured` stays at 0 when pressing arrows, NVDA is consuming them.

### B. iframe containment on html.onlineviewer.net (MEDIUM probability)
**Theory**: The host site wraps the HTML in an iframe. This could:
- Add its own keyboard event handlers that intercept keys
- Constrain the iframe viewport such that `100dvh` resolves to the iframe size (not screen)
- Have `overflow: hidden` or `height` constraints that affect the dialog's available space
- Interfere with `position: fixed` on the backdrop (fixed positioning inside iframes resolves relative to the iframe viewport)

**Not yet tested**: Opening the HTML directly via file:// or localhost to compare behavior.

### C. NVDA + iframe combined interaction (MEDIUM-HIGH probability)
**Theory**: NVDA's virtual buffer may behave differently inside iframes. Modal focus trapping (`aria-modal`, `inert`) inside an iframe may not be recognized by NVDA, leaving it in browse mode where it captures navigation keys.

**Not yet tested**: Testing with NVDA off to isolate screen reader vs CSS/iframe issue.

### D. Scroll range off by small amount (LOW-MEDIUM probability, independent of A/B/C)
**Theory**: The screenshot shows the last line partially cut off, suggesting `scrollHeight - clientHeight` is slightly less than needed. Could be caused by:
- Bottom padding not included in scroll range (known browser inconsistency)
- Dialog border (3px) consuming space within `box-sizing: border-box`
- Subpixel rounding at high zoom

**Diagnostic**: The telemetry overlay shows scrollTop, scrollHeight, clientHeight, and max scroll. If scrollTop equals max but content is still cut off, this confirms a scroll range deficit.

## Diagnostic Telemetry Added
A toggleable overlay has been added to the page (Ctrl+Shift+D to show/hide). When the dialog is open, it displays:
- `dialog open`: Whether the modal is currently shown
- `activeElement`: Which element has focus
- `scrollTop / max`: Current scroll position vs maximum
- `scrollHeight / clientHeight`: The scroll region's full content height vs visible height
- `last key event`: The most recent keydown's key, code, keyCode, target, and defaultPrevented
- `handler fired`: Whether the custom scroll handler ran for the last event
- `events captured`: Total number of keydown events received while dialog was open
- `viewport / dpr`: Window dimensions and device pixel ratio

## Recommended Test Matrix for Next Session

| Test | NVDA | Viewer | Expected insight |
|------|------|--------|-----------------|
| 1. Current build with diag overlay | ON | html.onlineviewer.net | Baseline — are events reaching JS at all? |
| 2. Same but press NVDA+Space first | ON | html.onlineviewer.net | Force NVDA into focus mode — do keys then pass through? |
| 3. Turn NVDA off, test at 400% zoom | OFF | html.onlineviewer.net | Isolate: is the bug NVDA-specific or CSS-specific? |
| 4. Open HTML as file:// at 400% zoom | ON | file:// | Isolate: is the bug iframe-specific? |
| 5. Open HTML as file://, NVDA off | OFF | file:// | Baseline: does scroll work at all without confounders? |

The most diagnostic single test is **#3** (NVDA off, same viewer). If scrolling works perfectly with NVDA off, the root cause is confirmed as NVDA event interception.

## Changes in Current Build
1. `#riskDialog` uses CSS Grid (from previous commit, kept as it's equally robust)
2. Scroll region changed from `tabindex="-1"` to `tabindex="0"` with `aria-label="Risk explanation, use arrow keys to scroll"`
3. Diagnostic telemetry overlay added (Ctrl+Shift+D)
4. Capture-phase handler restored to always run custom scroll (not bypassing when scroll region has focus)
5. `vh` fallback added before `dvh` value
6. `overscroll-behavior: contain` on scroll body
