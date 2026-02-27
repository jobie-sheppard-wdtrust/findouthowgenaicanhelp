# WCAG 2.2 AA Testing Plan

Source of truth used for WCAG mapping: `wcag-guide` (WCAG 2.2 Quick Reference content and success criteria list). This guide applies those WCAG 2.2 AA success criteria to three specs in this repo: `HB-spec-v2`, `PD-spec-v2`, and `RisksofGenAI-Spec`.

---

## Name: HB-spec-v2 — HITL defend against hallucination and bias

### Build step: Step 1

Interaction state(s): Initial / Draft + empty email state; two-panel layout, helper text visible, Send disabled.

WCAG 2.2 AA SCs: 1.3.1 Info and Relationships; 1.3.2 Meaningful Sequence; 1.4.10 Reflow; 2.4.2 Page Titled; 2.4.3 Focus Order; 2.4.7 Focus Visible; 3.3.2 Labels or Instructions

Why these SCs apply: In this first state, users need to understand page structure, what each section is for, and how to start. If structure, order, labels, or instructions are unclear, users can fail before the learning interaction even begins.

Step-by-step instructions to test 1.3.1 Info and Relationships:
- Preconditions (state/setup required before testing)
  - Open the page in a fresh browser tab.
  - Make sure no draft block has been selected yet.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - 1280×800 viewport, 100% zoom.
  - Use mouse + keyboard.
  - Open browser accessibility tree/inspector.
- Exact test actions
  - Find the page heading and verify it is exposed as a heading in the accessibility tree.
  - Check that left and right panel content can be understood as separate regions (draft area vs email area).
  - Inspect interactive elements (draft items, context actions if available, Send button) to confirm each has a clear accessible name and role.
  - Verify helper text is clearly connected to the email body purpose (user can understand what to do next from text + control context).
- What to observe (UI + programmatic/accessibility behaviour)
  - Visual grouping and programmatic grouping should match.
  - The page should not look structured visually but be “flat” or ambiguous in the accessibility tree.
- Success if:
  - A screen reader user can identify major page parts and control purpose without guessing.
- Failure if:
  - Controls are unnamed/generic (for example “button” only), or section relationships are only visual.
- Evidence to capture (concise): screenshot of UI + accessibility tree panel showing heading/regions/control names.

Step-by-step instructions to test 1.3.2 Meaningful Sequence:
- Preconditions
  - Initial state only (before any modal is open).
- Environment/settings
  - Keyboard only.
- Exact test actions
  - Press Tab repeatedly from the top of page.
  - Then use Shift+Tab to move backwards.
  - Write down the focus order you observe.
- What to observe
  - The order should follow task logic: understand page → choose draft content → work in email side → send.
- Success if:
  - Focus order supports a sensible reading and action path.
- Failure if:
  - Focus jumps in a way that causes confusion (for example skipping key controls or bouncing unexpectedly).
- Evidence to capture (concise): short recording of full forward/backward tab order.

Step-by-step instructions to test 1.4.10 Reflow:
- Preconditions
  - Page in initial state.
- Environment/settings
  - 320 CSS px width and 400% browser zoom.
- Exact test actions
  - Scroll through the page and attempt to reach all required content.
  - Try to access draft content, helper text, and Send control.
- What to observe
  - Core task content must remain reachable.
  - No critical control should disappear off-screen with no way to reach it.
- Success if:
  - You can complete the start of the task in reflow mode without content loss.
- Failure if:
  - Required controls are clipped, overlap badly, or require problematic two-directional scrolling for normal operation.
- Evidence to capture (concise): screenshots at top/middle/bottom in the 320px + 400% setup.

Step-by-step instructions to test 2.4.2 Page Titled:
- Preconditions
  - Fresh load.
- Environment/settings
  - Any viewport.
- Exact test actions
  - Read browser tab title.
- What to observe
  - Title matches the spec string.
- Success if:
  - The tab title is exactly “HITL Training - Checking for Hallucinations and Bias”.
- Failure if:
  - Missing title, generic title, or wrong text.
- Evidence to capture (concise): screenshot including browser tab.

Step-by-step instructions to test 2.4.3 Focus Order + 2.4.7 Focus Visible:
- Preconditions
  - Initial state.
- Environment/settings
  - Keyboard only.
- Exact test actions
  - Tab through every focusable element.
  - Pause on each element and confirm where focus is shown.
- What to observe
  - Focus indicator should be clearly visible on every focused control.
  - Focus should not get hidden behind layout layers.
- Success if:
  - Every interactive element has visible focus and appears in a logical sequence.
- Failure if:
  - Any focused item has weak/invisible focus style, or focus order is disorienting.
- Evidence to capture (concise): video showing focus ring for each control.

Step-by-step instructions to test 3.3.2 Labels or Instructions:
- Preconditions
  - Email body empty.
- Environment/settings
  - Keyboard + mouse.
- Exact test actions
  - Read helper text before interacting.
  - Try to explain the next action in plain language based only on on-screen instructions.
- What to observe
  - Instructions should clearly tell users to choose Copy-paste or Check content from a draft item.
- Success if:
  - A first-time user can start correctly without trial-and-error.
- Failure if:
  - Instructions are vague, missing, or do not match actual controls.
- Evidence to capture (concise): screenshot with helper text and disabled Send.

### Build step: Step 2

Interaction state(s): Draft block click → context menu open/close; animation lock; completed block lockout.

WCAG 2.2 AA SCs: 2.1.1 Keyboard; 2.5.1 Pointer Gestures; 2.5.2 Pointer Cancellation; 3.2.1 On Focus; 3.2.2 On Input; 4.1.2 Name, Role, Value

Why these SCs apply: This step is where users choose how to insert content. Actions must work for keyboard and pointer users, and state changes must be predictable.

Step-by-step instructions to test 2.1.1 Keyboard:
- Preconditions
  - At least one draft block is available and not completed.
- Environment/settings
  - Keyboard only.
- Exact test actions
  - Navigate to a draft block using Tab or defined keyboard navigation.
  - Open available actions for that block using keyboard.
  - Trigger both actions (Copy-paste and Check content) across separate trials.
- What to observe
  - Keyboard users can fully perform the same workflow as mouse users.
- Success if:
  - No important action is pointer-only.
- Failure if:
  - You can only open or operate the menu with a mouse.
- Evidence to capture (concise): keyboard-only recording with visible keypress overlay if possible.

Step-by-step instructions to test 2.5.1 Pointer Gestures + 2.5.2 Pointer Cancellation:
- Preconditions
  - Draft block available.
- Environment/settings
  - Mouse and touch (if possible).
- Exact test actions
  - Open menu with a simple single click/tap.
  - Click away from menu to cancel.
  - Confirm no action accidentally executes when you cancel.
- What to observe
  - Workflow should not require complex gestures.
  - Users should be able to back out safely before committing.
- Success if:
  - Single-pointer interactions are enough and cancellation works reliably.
- Failure if:
  - Drag/path gesture is required or accidental activation happens during cancellation.
- Evidence to capture (concise): short video showing open, cancel, and no accidental commit.

Step-by-step instructions to test 3.2.1 On Focus + 3.2.2 On Input:
- Preconditions
  - Menu closed.
- Environment/settings
  - Keyboard + mouse.
- Exact test actions
  - Move focus across controls without activating them.
  - Activate one action and observe resulting changes.
- What to observe
  - Focus alone should not trigger disruptive context changes.
  - Input should produce only expected state changes from spec.
- Success if:
  - The interface is predictable; major changes happen only when users intentionally activate a control.
- Failure if:
  - Focusing an item causes unexpected navigation/state changes.
- Evidence to capture (concise): test notes with timestamps and expected vs actual outcomes.

Step-by-step instructions to test 4.1.2 Name, Role, Value:
- Preconditions
  - Open context menu and complete at least one block.
- Environment/settings
  - Screen reader + accessibility inspector.
- Exact test actions
  - Check names/roles for menu buttons.
  - Check completed block state exposure after action is done.
- What to observe
  - Programmatic state must reflect visual state (for example deactivated/inactive block).
- Success if:
  - Screen reader output clearly communicates control name, role, and current state.
- Failure if:
  - Visual state changes are not reflected programmatically.
- Evidence to capture (concise): screen reader announcement notes + accessibility tree snapshot.

### Build step: Step 3

Interaction state(s): Copy-paste and Check content action sequences; highlight/insert/correction timings.

WCAG 2.2 AA SCs: 2.2.1 Timing Adjustable; 2.2.2 Pause, Stop, Hide; 2.3.3 Animation from Interactions; 4.1.3 Status Messages

Why these SCs apply: This step contains multiple timed animations and state transitions. Users must be able to follow what happens, and updates should be perceivable for assistive tech users.

Step-by-step instructions to test 2.2.1 Timing Adjustable:
- Preconditions
  - Choose a draft block that triggers correction sequence via Check content.
- Environment/settings
  - Use a timer overlay or frame-by-frame video review.
- Exact test actions
  - Measure these checkpoints:
    - 500ms initial draft highlight.
    - 1000ms pause before correction highlight.
    - 900ms delete-highlight.
    - 500ms pause before delete.
    - 650ms pause after delete.
    - Typing speed around 80ms/character.
    - Extra 300ms whitespace pause (when condition applies).
    - 900ms pause between correction chunks (if multiple chunks).
- What to observe
  - Timings should match spec and remain consistent.
  - No hidden “respond in X seconds” requirement should be imposed on user input.
- Success if:
  - Sequence timing is stable and as defined.
- Failure if:
  - Timings are missing, random, or alter task meaning.
- Evidence to capture (concise): timestamped recording + simple timing table.

Step-by-step instructions to test 2.2.2 Pause, Stop, Hide:
- Preconditions
  - Correction cursor visible.
- Environment/settings
  - Default motion settings.
- Exact test actions
  - Observe cursor in idle and active typing phases.
- What to observe
  - Cursor blinks while idle, becomes steady while typing, and no unrelated typing indicator appears in this experience.
- Success if:
  - Motion only appears where defined and stops when state ends.
- Failure if:
  - Persistent unnecessary animation continues outside defined states.
- Evidence to capture (concise): short clip comparing idle vs active correction cursor behaviour.

Step-by-step instructions to test 2.3.3 Animation from Interactions:
- Preconditions
  - Run same action path at least twice.
- Environment/settings
  - Reduced motion OFF, then ON.
- Exact test actions
  - Trigger Copy-paste/Check content in each setting and compare.
- What to observe
  - Interaction remains usable in both settings.
- Success if:
  - Motion does not block or confuse task completion; reduced-motion behavior is acceptable where implemented.
- Failure if:
  - Required task cannot be completed due to animation behavior.
- Evidence to capture (concise): paired recordings (normal motion vs reduced motion).

Step-by-step instructions to test 4.1.3 Status Messages:
- Preconditions
  - Run insertion and correction flows.
- Environment/settings
  - Screen reader.
- Exact test actions
  - Listen for announcements when content is added/corrected.
- What to observe
  - Important dynamic updates are communicated without forcing focus jumps.
- Success if:
  - Screen reader user can detect meaningful updates.
- Failure if:
  - Important changes are visual-only.
- Evidence to capture (concise): announcement transcript notes.

### Build step: Step 4

Interaction state(s): Per-block Feedback modal open and dismiss.

WCAG 2.2 AA SCs: 1.3.1 Info and Relationships; 2.1.2 No Keyboard Trap; 2.4.3 Focus Order; 2.4.7 Focus Visible; 2.4.11 Focus Not Obscured (Minimum); 3.2.2 On Input; 4.1.2 Name, Role, Value

Why these SCs apply: The modal is a critical interruption state. Focus handling, semantics, and dismissal behavior must be clear and safe.

Step-by-step instructions to test 2.1.2 No Keyboard Trap + 2.4.3 Focus Order + 2.4.11 Focus Not Obscured:
- Preconditions
  - Open modal from Medical details or Email sign-off.
- Environment/settings
  - Keyboard only.
- Exact test actions
  - Press Tab through all modal controls.
  - Press Shift+Tab to reverse.
  - Dismiss with Escape and with overlay click (if supported by spec).
  - Confirm where focus lands after dismiss.
- What to observe
  - Focus stays in modal while open.
  - Focus returns to a sensible location after close.
  - Focus indicator remains visible and not hidden by overlay/header.
- Success if:
  - Modal can be fully used and exited without trapping keyboard users.
- Failure if:
  - Focus escapes behind modal, disappears, or gets stuck.
- Evidence to capture (concise): keyboard-only video of open, traverse, dismiss, and focus return.

Step-by-step instructions to test 4.1.2 Name, Role, Value:
- Preconditions
  - Modal open.
- Environment/settings
  - Screen reader + accessibility inspector.
- Exact test actions
  - Confirm dialog role/name.
  - Confirm Continue button name/role/state.
- What to observe
  - Dialog and control semantics are explicit and accurate.
- Success if:
  - Screen reader announces modal purpose and available action clearly.
- Failure if:
  - Dialog is not announced as dialog, or control naming/state is unclear.
- Evidence to capture (concise): SR notes + inspector screenshot.

### Build step: Step 5

Interaction state(s): Send evaluation → post-send success/failure feedback view; Try again reset.

WCAG 2.2 AA SCs: 1.3.1 Info and Relationships; 2.4.3 Focus Order; 2.4.6 Headings and Labels; 3.3.1 Error Identification; 3.3.3 Error Suggestion; 4.1.3 Status Messages

Why these SCs apply: This step communicates whether the user made safe/unsafe choices and how to improve. Outcome clarity and corrective guidance are essential.

Step-by-step instructions to test 3.3.1 Error Identification + 3.3.3 Error Suggestion:
- Preconditions
  - Execute one path that should pass and one path that should fail.
- Environment/settings
  - Keyboard + screen reader.
- Exact test actions
  - Click Send in each path.
  - Read each feedback card and compare with action choices made.
- What to observe
  - Failure feedback should explain what was wrong.
  - Guidance should tell user what to change next time.
- Success if:
  - Error messages are specific and helpful, not generic.
- Failure if:
  - Failure is shown but user cannot tell how to improve.
- Evidence to capture (concise): screenshots of success and failure outcomes.

Step-by-step instructions to test 4.1.3 Status Messages:
- Preconditions
  - Ready to send.
- Environment/settings
  - Screen reader.
- Exact test actions
  - Trigger send and listen for announcement of view change/outcome.
- What to observe
  - Outcome appears as perceivable status change to AT users.
- Success if:
  - Screen reader users are informed of result without hunting through page.
- Failure if:
  - View changes silently for AT users.
- Evidence to capture (concise): screen reader notes.

Timing checks included in this interaction:
- Immediate transitions for menu open/close, send enable/disable, modal open/close, send evaluation.
- 300ms fade-in of inserted email blocks.
- 500ms initial highlight for Copy-paste/Check content.
- Correction sequence timing: 900ms highlight, 1000ms pre-highlight pause, 500ms pre-delete pause, 650ms post-delete pause, 80ms/character typing, +300ms whitespace pause rule, +900ms between correction chunks.
- 1s cursor blink cycle when correction cursor is visible and idle.

---

## Name: PD-spec-v2 — Keeping patient data safe chatbot

### Build step: Step 1

Interaction state(s): Initial load; two-column app; header + reset + prompt scaffold + patient data list.

WCAG 2.2 AA SCs: 1.3.1 Info and Relationships; 1.3.4 Orientation; 1.4.10 Reflow; 1.4.12 Text Spacing; 2.4.2 Page Titled; 2.4.6 Headings and Labels

Why these SCs apply: This screen introduces sensitive-data handling. Users must be able to read headings/instructions and access all controls across zoom, orientation, and reflow scenarios.

Step-by-step instructions to test 1.4.10 Reflow + 1.3.4 Orientation:
- Preconditions (state/setup required before testing)
  - Open page in initial state.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - 320 CSS px width and 400% zoom.
  - Test in portrait and landscape orientation.
- Exact test actions
  - Verify stacked layout appears when narrow.
  - Scroll entire page and both panes.
  - Confirm no key control is inaccessible.
- What to observe (UI + programmatic/accessibility behaviour)
  - Page-level scrolling exists (not blocked by global overflow hidden).
  - Required content remains reachable in both orientations.
- Success if:
  - Users can access all required controls and complete the start flow in both orientations.
- Failure if:
  - Content is clipped, hidden behind fixed regions, or unreachable.
- Evidence to capture (concise): screenshots of portrait + landscape at 320/400%.

Step-by-step instructions to test 2.4.2 Page Titled + 2.4.6 Headings and Labels:
- Preconditions
  - Initial load.
- Environment/settings
  - Any viewport.
- Exact test actions
  - Verify page title, H1, subheader, and key control labels.
- What to observe
  - Text matches canonical strings and is descriptive.
- Success if:
  - Title/heading/labels are correct and understandable.
- Failure if:
  - Canonical strings are incorrect or labels are ambiguous.
- Evidence to capture (concise): tab + header + controls screenshot.

### Build step: Step 2

Interaction state(s): Copy/Remove field toggles; prompt updates; send enabled/disabled.

WCAG 2.2 AA SCs: 2.1.1 Keyboard; 2.5.8 Target Size (Minimum); 3.2.2 On Input; 4.1.2 Name, Role, Value

Why these SCs apply: This is the core input workflow. Users need reliable toggle behavior, sufficient target size, and clear state updates across input methods.

Step-by-step instructions to test 2.1.1 Keyboard + 4.1.2 Name, Role, Value:
- Preconditions
  - Patient data list visible.
- Environment/settings
  - Keyboard + screen reader.
- Exact test actions
  - Tab to each copy/remove control.
  - Activate with Enter and Space.
  - Confirm accessible name changes between Copy X and Remove X.
  - Verify prompt content updates accordingly.
- What to observe
  - Keyboard behavior equals pointer behavior.
  - Programmatic names/states match visual toggle state.
- Success if:
  - Every toggle is keyboard-operable and semantically accurate.
- Failure if:
  - Any toggle only works with pointer, or name/state does not update.
- Evidence to capture (concise): SR notes + short keyboard recording.

Step-by-step instructions to test 2.5.8 Target Size (Minimum):
- Preconditions
  - Controls visible in normal and zoomed layout.
- Environment/settings
  - Pointer and touch emulation.
- Exact test actions
  - Check effective hit area for copy/remove controls and send control.
  - Try quick repeated activation attempts to detect precision issues.
- What to observe
  - Controls are easy to activate without needing precise aiming.
- Success if:
  - Target size/spacing supports reliable activation.
- Failure if:
  - Frequent missed taps/clicks from small target area.
- Evidence to capture (concise): annotated screenshot with measured dimensions.

### Build step: Step 3

Interaction state(s): Send → bot thinking/typing → error or referral response.

WCAG 2.2 AA SCs: 2.2.1 Timing Adjustable; 2.2.2 Pause, Stop, Hide; 2.3.3 Animation from Interactions; 4.1.3 Status Messages

Why these SCs apply: The interaction introduces timed bot output and reduced-motion exceptions; dynamic changes must remain perceivable and non-disruptive.

Step-by-step instructions to test 2.2.1 Timing Adjustable + 2.3.3 Animation from Interactions:
- Preconditions
  - Prepare one scenario missing required fields and one scenario with required fields included.
- Environment/settings
  - Reduced motion OFF, then ON.
- Exact test actions
  - Send each scenario.
  - With reduced motion OFF, measure typing duration rule:
    - total = (whitespace-split segments ÷ 16) × 1000ms,
    - per-character interval = total ÷ number of characters.
  - With reduced motion ON, confirm immediate full-message reveal.
- What to observe
  - Timing formula behavior in normal mode.
  - Motion-reduced immediate behavior in reduced-motion mode.
- Success if:
  - Timing logic follows spec and reduced motion is respected.
- Failure if:
  - Formula is not followed or reduced-motion exception is missing.
- Evidence to capture (concise): timing sheet + video + settings screenshot.

Step-by-step instructions to test 4.1.3 Status Messages:
- Preconditions
  - Send operation ready.
- Environment/settings
  - Screen reader.
- Exact test actions
  - Trigger send and listen for updates as bot state changes from waiting/typing to full response.
- What to observe
  - Screen reader users receive meaningful update cues.
- Success if:
  - Dynamic results are communicated without forced focus changes.
- Failure if:
  - Important bot response changes are visual-only.
- Evidence to capture (concise): AT announcement notes.

### Build step: Step 4

Interaction state(s): Feedback modal (“✅ Excellent work!” / “❌ Not quite right”) and Retry reset.

WCAG 2.2 AA SCs: 2.1.2 No Keyboard Trap; 2.4.3 Focus Order; 2.4.7 Focus Visible; 3.3.1 Error Identification; 3.3.3 Error Suggestion; 4.1.2 Name, Role, Value

Why these SCs apply: The feedback modal is the pass/fail checkpoint. Users must understand errors and recover by using Retry without focus problems.

Step-by-step instructions to test 3.3.1 Error Identification + 3.3.3 Error Suggestion:
- Preconditions
  - Trigger both success and failure modal states.
- Environment/settings
  - Keyboard + screen reader.
- Exact test actions
  - Read all modal text.
  - Check whether failure variant clearly states PID risk and next action.
- What to observe
  - Failure content names the issue and gives recovery advice.
- Success if:
  - User can explain what was wrong and what to do next.
- Failure if:
  - Error text is too generic to guide retry.
- Evidence to capture (concise): screenshot of both modal variants.

Step-by-step instructions to test 2.1.2 No Keyboard Trap + 4.1.2 Name, Role, Value:
- Preconditions
  - Modal open.
- Environment/settings
  - Keyboard + screen reader.
- Exact test actions
  - Tab through modal controls.
  - Activate Retry.
  - Confirm focus returns to a useful place in reset state.
- What to observe
  - Dialog semantics announced correctly.
  - No focus trap before or after closing.
- Success if:
  - Keyboard users can complete modal workflow and continue.
- Failure if:
  - Focus is trapped, lost, or dialog semantics are unclear.
- Evidence to capture (concise): keyboard recording + SR notes.

Timing checks included in this interaction:
- Immediate changes for copy/remove toggle state, send enable/disable, modal show/hide, and retry reset.
- Typing duration formula for bot output.
- Reduced-motion immediate reveal override.

---

## Name: RisksofGenAI-Spec — See hidden risks in chatbot output

### Build step: Step 1

Interaction state(s): Initial state, preset prompt button visible, input placeholder, send disabled until text exists.

WCAG 2.2 AA SCs: 1.3.1 Info and Relationships; 1.4.10 Reflow; 2.4.2 Page Titled; 2.4.6 Headings and Labels; 3.3.2 Labels or Instructions

Why these SCs apply: Users must quickly understand what this simulation does, where to begin, and what controls are available in constrained layouts.

Step-by-step instructions to test 1.4.10 Reflow + 2.4.2 Page Titled:
- Preconditions (state/setup required before testing)
  - Fresh page load, no interactions yet.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - 320 CSS px width, 400% zoom.
- Exact test actions
  - Check browser tab title.
  - Verify title bar text, helper text, preset button, input, and send control remain reachable.
- What to observe (UI + programmatic/accessibility behaviour)
  - Content should remain usable in constrained viewport.
- Success if:
  - Required controls are visible/reachable and title is correct (“GenAI Chatbot”).
- Failure if:
  - Essential controls are clipped or title is wrong/missing.
- Evidence to capture (concise): screenshot including tab title + visible controls.

### Build step: Step 2

Interaction state(s): Preset click triggers input auto-fill, auto-send, typing indicator, bot response.

WCAG 2.2 AA SCs: 2.2.1 Timing Adjustable; 2.2.2 Pause, Stop, Hide; 2.3.3 Animation from Interactions; 3.2.2 On Input; 4.1.3 Status Messages

Why these SCs apply: This step has defined timing points and automatic state transitions. Timing and status visibility must be testable and consistent.

Step-by-step instructions to test 2.2.1 Timing Adjustable (timing milestones):
- Preconditions
  - Preset button is visible and enabled.
- Environment/settings
  - Timer overlay or frame-by-frame capture.
- Exact test actions
  - Click preset once and measure:
    - 400ms input auto-fill fade-in.
    - 1400ms delay before send bulge starts.
    - 300ms send bulge animation duration.
    - 2000ms typing-dots bounce cycle while typing indicator is visible.
- What to observe
  - Events happen in the expected order and timing windows.
- Success if:
  - Timing sequence aligns with spec values.
- Failure if:
  - Missing, out-of-order, or significantly incorrect timings.
- Evidence to capture (concise): timestamped recording with timing notes.

Step-by-step instructions to test 2.2.2 Pause, Stop, Hide + 2.3.3 Animation from Interactions:
- Preconditions
  - Repeat the same preset flow.
- Environment/settings
  - Reduced motion OFF, then ON.
- Exact test actions
  - Run once in normal mode and once in reduced-motion mode.
  - Compare whether animations are suppressed as specified when reduced motion is enabled.
- What to observe
  - Infinite and staged animations should not run when reduced-motion rules say they should be disabled.
- Success if:
  - Reduced-motion behavior is clearly different and compliant.
- Failure if:
  - Animations continue unchanged in reduced-motion mode.
- Evidence to capture (concise): paired normal/reduced-motion videos.

Step-by-step instructions to test 4.1.3 Status Messages:
- Preconditions
  - Auto-send flow active.
- Environment/settings
  - Screen reader.
- Exact test actions
  - Listen for updates as user message appears, typing indicator appears/disappears, and bot response appears.
- What to observe
  - Important dynamic events are conveyed to assistive tech.
- Success if:
  - Screen reader users receive enough status information to follow conversation changes.
- Failure if:
  - Dynamic conversation updates are only visible visually.
- Evidence to capture (concise): SR notes.

### Build step: Step 3

Interaction state(s): Highlighted risk phrases appear in staged phases and become clickable.

WCAG 2.2 AA SCs: 1.4.1 Use of Color; 2.1.1 Keyboard; 2.4.7 Focus Visible; 2.5.8 Target Size (Minimum); 4.1.2 Name, Role, Value

Why these SCs apply: Highlighted phrases are central to learning outcomes. They must be discoverable, operable, and understandable without relying only on color.

Step-by-step instructions to test 1.4.1 Use of Color:
- Preconditions
  - Bot message with clickable highlights is visible.
- Environment/settings
  - Normal mode + grayscale/high-contrast check.
- Exact test actions
  - Identify all clickable highlights in normal view.
  - Repeat in grayscale/high-contrast conditions.
- What to observe
  - Interactivity should be signaled by more than color (for example focus style, underline, role, cursor, label).
- Success if:
  - Users can detect clickable highlights without relying only on color.
- Failure if:
  - Color is the only cue for clickability.
- Evidence to capture (concise): side-by-side screenshots (normal vs grayscale/high-contrast).

Step-by-step instructions to test 2.1.1 Keyboard + 4.1.2 Name, Role, Value:
- Preconditions
  - Highlights visible.
- Environment/settings
  - Keyboard + screen reader.
- Exact test actions
  - Tab to each highlight.
  - Activate each with Enter/Space.
  - Check announced label/role.
- What to observe
  - Keyboard activation should match click behavior.
  - Semantics should describe control purpose.
- Success if:
  - All highlights are keyboard accessible with clear programmatic info.
- Failure if:
  - Any highlight is pointer-only or ambiguously announced.
- Evidence to capture (concise): keyboard recording + SR notes.

### Build step: Step 4

Interaction state(s): “Spotting hidden risks” pop-up open; scroll lock; close via “–”; switch between highlights.

WCAG 2.2 AA SCs: 1.3.1 Info and Relationships; 2.1.2 No Keyboard Trap; 2.4.3 Focus Order; 2.4.11 Focus Not Obscured (Minimum); 3.2.2 On Input; 4.1.2 Name, Role, Value

Why these SCs apply: The pop-up is an overlay with controlled dismissal and content switching. Users must keep orientation and control when popup and scroll-lock behavior are active.

Step-by-step instructions to test 2.1.2 No Keyboard Trap + 2.4.3 Focus Order + 2.4.11 Focus Not Obscured:
- Preconditions
  - Open pop-up from one highlighted phrase.
- Environment/settings
  - Keyboard only.
- Exact test actions
  - Tab to close control.
  - Close pop-up.
  - Re-open from another highlight.
  - Confirm focus visibility and logical order each time.
- What to observe
  - Focus remains visible and manageable throughout open/close cycles.
  - User can always exit overlay state.
- Success if:
  - No trap, no hidden focus, and predictable focus order.
- Failure if:
  - Focus disappears, is obscured, or escape path is missing.
- Evidence to capture (concise): short keyboard-only recording.

Step-by-step instructions to test 4.1.2 Name, Role, Value:
- Preconditions
  - Pop-up open.
- Environment/settings
  - Screen reader + accessibility inspector.
- Exact test actions
  - Verify pop-up title is exposed.
  - Verify close control is announced with usable label/role.
- What to observe
  - Programmatic metadata should match visible popup structure and controls.
- Success if:
  - Pop-up and controls are announced clearly.
- Failure if:
  - Missing or unclear role/name/state information.
- Evidence to capture (concise): SR notes + inspector screenshot.

Timing checks included in this interaction:
- 400ms auto-fill fade-in.
- 1400ms trigger delay before send bulge.
- 300ms send bulge duration.
- 2000ms typing-dot bounce cycle.
- Immediate pop-up open/close/switch behavior and immediate scroll-lock/unlock state changes.

---

## Cross-spec execution checklist (apply to every test case above)

- Record browser version, OS version, and assistive technology version in every test run.
- Record viewport width/height, zoom %, and orientation in evidence metadata.
- For each failing test case, log all of the following:
  - Impacted WCAG SC.
  - Exact reproduction steps.
  - Expected behavior.
  - Actual behavior.
  - Severity and user impact.
- Name evidence files consistently (example: `HB-Step3-SC2.2.1-typing-timing.mp4`).

# genaicanhelp WCAG 2.2 AA Testing Guide

Source of truth for WCAG success criteria: `wcag-guide` (WCAG 2.2 Quick Reference extract in this repo).
Implementation source of truth for behaviour, timings, and copy: `genaicanhelp-spec`.

This guide is organized into **4 build-gated steps** so WCAG defects are found early, before later interaction layers depend on them.

---

## Name: GenAI Chatbot shell semantics and startup state

## Build step: Step 1

Interaction state(s): First page load; initial bot message visible; all 3 preset prompt buttons visible; textarea empty; send disabled; no attachment preview; no typing indicator.

WCAG 2.2 AA SCs: 1.3.1 Info and Relationships; 1.3.2 Meaningful Sequence; 2.4.2 Page Titled; 2.4.3 Focus Order; 2.4.7 Focus Visible; 3.3.2 Labels or Instructions; 4.1.2 Name, Role, Value

Why these SCs apply: This state establishes structure, names, and navigation order. If landmarks, labels, and baseline focus behaviour are wrong here, all later dynamic checks become unreliable.

### Step-by-step instructions to test 1.3.1 Info and Relationships

- Preconditions (state/setup required before testing)
  - Load the page fresh (hard refresh) and do not interact yet.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - 1280×800, 100% zoom, landscape.
  - Keyboard + mouse.
  - Browser accessibility tree inspector enabled.
- Exact test actions
  - Verify there is one header landmark, one main landmark, and one footer/contentinfo region.
  - Verify `GenAI Chatbot` is exposed as heading level 1.
  - Verify subtitle text is exposed as descriptive text (not a heading).
  - Inspect textarea and verify accessible name is `Message` (not placeholder-only).
  - Inspect send control and verify role is button and name is `Send`.
  - Verify send icon and bot avatars are decorative/ignored by AT.
  - Verify transcript is exposed as a single log-style live-updating region.
- What to observe (UI + programmatic/accessibility behaviour)
  - Programmatic structure mirrors visual structure.
  - Control names and roles are specific and stable.
- Success if:
  - Landmarks, heading level, transcript semantics, and control labels are all correctly exposed.
- Failure if:
  - Missing/misused landmarks; heading not level 1; unnamed controls; decorative icons announced as meaningful content.
- Evidence to capture (concise): Screenshot of UI + accessibility tree snapshot showing landmarks, h1, textarea name, send button name.

### Step-by-step instructions to test 1.3.2 Meaningful Sequence + 2.4.3 Focus Order

- Preconditions (state/setup required before testing)
  - Initial state with prompts visible.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Keyboard-only.
- Exact test actions
  - Press `Tab` from browser top until focus enters app.
  - Continue tabbing through all focusable elements in the chat UI.
  - Reverse with `Shift+Tab`.
- What to observe (UI + programmatic/accessibility behaviour)
  - Focus order follows spec order: transcript scroll area → visible prompt buttons left-to-right → textarea → send button.
  - No skipped or hidden focus targets.
- Success if:
  - Forward and reverse tab order is predictable and task-aligned.
- Failure if:
  - Focus jumps unexpectedly, loops, or lands on non-interactive decorative elements.
- Evidence to capture (concise): Short screen recording of full forward/backward tab sequence.

### Step-by-step instructions to test 2.4.2 Page Titled

- Preconditions (state/setup required before testing)
  - Fresh page load.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Any viewport.
- Exact test actions
  - Read browser tab title.
- What to observe (UI + programmatic/accessibility behaviour)
  - Title string exactly matches required title.
- Success if:
  - Title is exactly `GenAI Chatbot`.
- Failure if:
  - Missing, generic, or mismatched title text.
- Evidence to capture (concise): Screenshot including browser tab title.

### Step-by-step instructions to test 2.4.7 Focus Visible

- Preconditions (state/setup required before testing)
  - Initial state, all controls visible.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Keyboard-only; optionally run a 3:1 contrast checker for indicator vs adjacent color.
- Exact test actions
  - Tab to each prompt button, textarea, send button, transcript region.
  - If links exist in transcript, tab to links as well.
- What to observe (UI + programmatic/accessibility behaviour)
  - Focus indicator is clearly visible, at least ~2 CSS px equivalent, and not clipped.
- Success if:
  - Every focusable control has persistent visible focus until focus moves.
- Failure if:
  - Any focus ring is missing, too faint, or partly obscured by fixed header/footer.
- Evidence to capture (concise): Video showing focus ring on each interactive element.

### Step-by-step instructions to test 3.3.2 Labels or Instructions

- Preconditions (state/setup required before testing)
  - Initial state with enabled textarea.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Keyboard + mouse.
- Exact test actions
  - Read visible instruction text associated with textarea.
  - Confirm instruction text remains present before first send and whenever textarea is enabled.
- What to observe (UI + programmatic/accessibility behaviour)
  - Required instruction text is present exactly and gives actionable guidance about preset-only behaviour.
- Success if:
  - Users can understand how to successfully submit without trial-and-error.
- Failure if:
  - Instruction is missing, altered, or not associated with message input.
- Evidence to capture (concise): Screenshot showing textarea plus instruction text.

### Step-by-step instructions to test 4.1.2 Name, Role, Value

- Preconditions (state/setup required before testing)
  - Initial state.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Accessibility tree + optional screen reader.
- Exact test actions
  - Inspect prompt buttons, textarea, send button for correct role/name/state.
  - Confirm send starts disabled when input is whitespace/empty.
  - Enter non-space text and verify send enabled state is exposed.
- What to observe (UI + programmatic/accessibility behaviour)
  - Programmatic state updates match visual state updates.
- Success if:
  - Name/role/state are accurate for all primary controls.
- Failure if:
  - AT-reported state differs from visible state or names are ambiguous.
- Evidence to capture (concise): Accessibility tree snapshots before/after send-enable change.

---

## Name: Manual composer and send/response interaction

## Build step: Step 2

Interaction state(s): Typing in textarea; Enter/Shift+Enter handling; click/keyboard send trigger; bot typing indicator lifecycle; response completion and unlock.

WCAG 2.2 AA SCs: 2.1.1 Keyboard; 2.1.2 No Keyboard Trap; 2.5.2 Pointer Cancellation; 3.2.1 On Focus; 3.2.2 On Input; 4.1.3 Status Messages; 3.3.1 Error Identification

Why these SCs apply: This step introduces interaction logic, timed status changes, and error paths. Keyboard parity, predictable state changes, and non-spammy announcements are critical.

### Step-by-step instructions to test 2.1.1 Keyboard + 2.1.2 No Keyboard Trap

- Preconditions (state/setup required before testing)
  - Initial state with no preset clicked.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Keyboard-only.
- Exact test actions
  - Focus textarea and type text.
  - Press `Shift+Enter` and verify newline is inserted.
  - Press `Enter` with non-empty text and verify message send occurs.
  - Continue tabbing during idle state and after response completes.
- What to observe (UI + programmatic/accessibility behaviour)
  - Keyboard alone completes full send-response cycle.
  - Focus is not trapped in textarea or transcript.
- Success if:
  - All required actions are keyboard operable and users can always move focus away.
- Failure if:
  - Sending or navigation requires pointer, or focus becomes trapped.
- Evidence to capture (concise): Keyboard-only recording from typing through completed response.

### Step-by-step instructions to test 2.5.2 Pointer Cancellation (send and prompt activation model)

- Preconditions (state/setup required before testing)
  - At least one visible preset button.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Mouse (and touch if available).
- Exact test actions
  - Press mouse down on a preset, drag off, release outside.
  - Repeat on send button with enabled send.
- What to observe (UI + programmatic/accessibility behaviour)
  - Actions commit on pointer-up on target; release outside cancels.
- Success if:
  - No accidental activation from pointer-down alone.
- Failure if:
  - Activation occurs on pointer-down or after release outside target.
- Evidence to capture (concise): Short video demonstrating cancel-safe pointer behaviour.

### Step-by-step instructions to test 3.2.1 On Focus + 3.2.2 On Input

- Preconditions (state/setup required before testing)
  - Composer enabled.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Keyboard + mouse.
- Exact test actions
  - Move focus across controls without activating them.
  - Type into textarea and observe only expected local changes (autosize/send enable).
  - Trigger send intentionally and observe transition.
- What to observe (UI + programmatic/accessibility behaviour)
  - Focus movement alone does not cause major context changes.
  - Input changes do not unexpectedly send unless explicit Enter/click send conditions are met.
- Success if:
  - State changes are predictable and user-initiated.
- Failure if:
  - Unintended sends/context shifts happen on focus or incidental typing.
- Evidence to capture (concise): Test notes with expected vs actual behaviour.

### Step-by-step instructions to test 4.1.3 Status Messages (including timing checks)

- Preconditions (state/setup required before testing)
  - One manual-send trial and one preset-send trial available.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Screen reader running (NVDA/JAWS/VoiceOver) + timer overlay or timestamped recording.
- Exact test actions
  - Manual send a matching prompt and measure:
    - `t=0ms`: input disables, prompts hide/lock, typing indicator shown.
    - typing indicator delay for manual send is ~`1500ms`.
    - bot text reveal at ~`5ms/char`.
  - Preset send and measure typing indicator delay ~`1000ms`.
  - Scroll up so user is >=10px from bottom; trigger new bot message.
- What to observe (UI + programmatic/accessibility behaviour)
  - Announcements occur once per transition:
    - `Assistant is typing` once.
    - Completed bot message announced once (not per character).
    - `Input disabled while the assistant responds` once.
    - `Input enabled` once when complete.
    - Away-from-bottom message announced once: `New message received. Scroll down to view.`
- Success if:
  - Timings are within practical tolerance and announcements are singular, relevant, and non-repetitive.
- Failure if:
  - Repeated dot/character announcements, missing critical status, or incorrect typing-indicator delay.
- Evidence to capture (concise): Screen reader announcement log + timestamped video clips.

### Step-by-step instructions to test 3.3.1 Error Identification

- Preconditions (state/setup required before testing)
  - Composer enabled and no active bot response.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Keyboard + screen reader.
- Exact test actions
  - Enter a non-matching custom message and send.
  - Confirm bot returns fixed preset-only note.
  - Confirm error/correction guidance is programmatically identifiable and announced once.
- What to observe (UI + programmatic/accessibility behaviour)
  - User gets clear indication why message did not match and how to correct (use exact preset prompt).
- Success if:
  - Non-match path is identified as input error with understandable correction guidance.
- Failure if:
  - Response appears as generic content with no error identification or repeated announcements.
- Evidence to capture (concise): Screenshot of non-match response + SR announcement notes.

---

## Name: Preset automation, cancellation, and attachment lifecycle

## Build step: Step 3

Interaction state(s): Clicking a preset; auto-fill and fade; delayed bulge and auto-send; cancellation before auto-send; attachment preview creation/removal; message attachment pill in transcript.

WCAG 2.2 AA SCs: 2.1.1 Keyboard; 2.5.2 Pointer Cancellation; 2.2.1 Timing Adjustable; 2.2.2 Pause, Stop, Hide; 3.2.2 On Input; 4.1.2 Name, Role, Value; 4.1.3 Status Messages

Why these SCs apply: This step has explicit timing rules and cancellable automation. Users must be able to interrupt pending auto-send and perceive attachment/status transitions accessibly.

### Step-by-step instructions to test 2.2.1 Timing Adjustable + timing checks

- Preconditions (state/setup required before testing)
  - A fresh preset is available.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Keyboard or mouse; use stopwatch/video frame analysis.
- Exact test actions
  - Activate a preset and measure:
    - Immediate: preset marked used/removed; full prompt inserted.
    - Auto-fill text fade duration ~`400ms`.
    - Wait ~`1400ms` before send bulge starts.
    - Bulge lasts ~`300ms`.
    - Auto-send occurs immediately after bulge end.
- What to observe (UI + programmatic/accessibility behaviour)
  - Sequence order and durations match spec and are not skipped/stacked.
- Success if:
  - Timed stages execute in required order and timing window.
- Failure if:
  - Early send, missing bulge, incorrect delays, or no immediate state update.
- Evidence to capture (concise): Timestamped video with on-screen timer annotations.

### Step-by-step instructions to test 2.2.2 Pause, Stop, Hide + 3.2.2 On Input

- Preconditions (state/setup required before testing)
  - Preset selected and pending auto-send in progress (before bulge ends).
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Keyboard + mouse.
- Exact test actions
  - During pending auto-send, press `Escape`.
  - Repeat trial and instead modify textarea content before send.
- What to observe (UI + programmatic/accessibility behaviour)
  - Pending auto-send cancels immediately.
  - Bulge stops/clears and manual send remains available.
  - Message is not auto-sent after cancellation.
- Success if:
  - Both cancellation routes reliably stop automation before send.
- Failure if:
  - Auto-send still fires after Escape/edit, or cancellation leaves UI in broken state.
- Evidence to capture (concise): Two short clips: Escape cancel and content-change cancel.

### Step-by-step instructions to test 2.1.1 Keyboard + 2.5.2 Pointer Cancellation (preset operability)

- Preconditions (state/setup required before testing)
  - At least two unused presets visible.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Keyboard-only then mouse.
- Exact test actions
  - Trigger preset A using `Enter`; preset B using `Space`.
  - Verify behaviour matches click-triggered path.
  - Perform press-down/release-outside on another preset.
- What to observe (UI + programmatic/accessibility behaviour)
  - Keyboard and pointer paths are functionally equivalent.
  - Pointer cancellation prevents accidental activation.
- Success if:
  - Presets are fully keyboard operable with parity to click behaviour.
- Failure if:
  - Keyboard misses timing sequence or pointer-down causes unintended activation.
- Evidence to capture (concise): Keyboard parity clip + pointer cancellation clip.

### Step-by-step instructions to test 4.1.2 Name, Role, Value + 4.1.3 Status Messages (attachments)

- Preconditions (state/setup required before testing)
  - Use preset #2 (attachment case).
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Screen reader + accessibility inspector.
- Exact test actions
  - Activate preset #2 and inspect attachment preview text.
  - Send message and inspect attachment pill in transcript.
  - Verify preview clears after send.
- What to observe (UI + programmatic/accessibility behaviour)
  - Preview accessible text: `Attachment: Patel email complaint.pdf`.
  - Announcement on preview show once: `Attachment added: Patel email complaint.pdf`.
  - Announcement on preview clear once: `Attachment removed`.
  - Transcript attachment is programmatically associated with the user message and exposes `Attachment: <filename>`.
- Success if:
  - Attachment name/state are correctly exposed in composer and transcript with one-time announcements.
- Failure if:
  - Missing attachment semantics, duplicate announcements, or attachment not tied to message context.
- Evidence to capture (concise): SR announcement notes + accessibility tree snapshot of preview and sent message attachment.

---

## Name: Visual robustness, reflow, and cross-state resilience

## Build step: Step 4

Interaction state(s): Any state where content is present (including long messages, links, attachment names, typing/completed responses) under zoom/reflow/orientation/spacing/contrast constraints.

WCAG 2.2 AA SCs: 1.3.4 Orientation; 1.4.1 Use of Color; 1.4.3 Contrast (Minimum); 1.4.10 Reflow; 1.4.11 Non-text Contrast; 1.4.12 Text Spacing; 1.4.4 Resize Text; 2.4.11 Focus Not Obscured (Minimum); 2.5.8 Target Size (Minimum)

Why these SCs apply: The final step validates that complete interaction remains usable under constrained viewports, zoom, spacing overrides, and focus/contrast requirements.

### Step-by-step instructions to test 1.4.10 Reflow + 1.3.4 Orientation

- Preconditions (state/setup required before testing)
  - Populate transcript with several messages (including one long URL-containing response and one attachment message).
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - 320 CSS px width and 400% zoom equivalent.
  - Test both portrait and landscape.
- Exact test actions
  - Navigate full interaction: scroll transcript, access prompt(s), use textarea, send button, links.
  - Verify prompt row wraps and no critical control is clipped.
- What to observe (UI + programmatic/accessibility behaviour)
  - No required horizontal scrolling for reading/sending.
  - No functional loss from fixed-height assumptions.
  - Single usable vertical scrolling experience.
- Success if:
  - Core tasks remain fully operable in both orientations at reflow constraints.
- Failure if:
  - Clipping, overlap, off-screen controls, forced dual-scroll traps, or orientation-dependent breakage.
- Evidence to capture (concise): Screenshots/video in portrait + landscape at reflow settings.

### Step-by-step instructions to test 1.4.4 Resize Text + 1.4.12 Text Spacing

- Preconditions (state/setup required before testing)
  - Messages and controls visible.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Browser text zoom 200%.
  - Apply spacing overrides: line-height 1.5, paragraph 2, letter 0.12em, word 0.16em.
- Exact test actions
  - Re-check header, transcript messages, links, attachment labels, prompt buttons, textarea instruction, and send control.
- What to observe (UI + programmatic/accessibility behaviour)
  - Text wraps and containers expand vertically.
  - No clipped text or hidden control labels.
- Success if:
  - Content/function remains available without overlap or truncation.
- Failure if:
  - Any important text/control becomes unreadable or inaccessible due to spacing/resize.
- Evidence to capture (concise): Before/after screenshots for text resize and spacing override modes.

### Step-by-step instructions to test 1.4.3 Contrast (Minimum) + 1.4.11 Non-text Contrast + 1.4.1 Use of Color

- Preconditions (state/setup required before testing)
  - Show controls in default/hover/focus/disabled states and at least one inline link.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - 100% zoom; use color contrast analyzer.
- Exact test actions
  - Measure text/background contrast for key text elements.
  - Measure non-text contrast for boundaries/indicators (prompt borders, textarea wrapper, send button states, focus indicator, attachment pill boundary, link focus style).
  - Inspect link appearance in default/focus state for non-color cue (underline/persistent distinguishing style).
- What to observe (UI + programmatic/accessibility behaviour)
  - Text meets minimum contrast; UI component boundaries/indicators meet 3:1 where required.
  - Links remain distinguishable without color alone.
- Success if:
  - Contrast thresholds are met and non-color cues are present.
- Failure if:
  - Low-contrast controls/focus styles or color-only link identification.
- Evidence to capture (concise): Contrast tool readouts + screenshots of link/focus states.

### Step-by-step instructions to test 2.4.11 Focus Not Obscured (Minimum) + 2.5.8 Target Size (Minimum)

- Preconditions (state/setup required before testing)
  - Long transcript to force scroll; prompts visible.
- Environment/settings (viewport, zoom, orientation, input method, assistive tech if applicable)
  - Keyboard-only for focus checks.
  - Pointer for target-size checks.
- Exact test actions
  - Tab through elements near sticky/fixed edges (header/footer boundaries).
  - Ensure focused element + full indicator remains visible (aim for >=8px edge gap where applicable).
  - Measure prompt button hit area (>=24×24 CSS px) and verify non-overlap.
- What to observe (UI + programmatic/accessibility behaviour)
  - Focus is never hidden behind fixed UI.
  - All small controls remain easy to hit and do not overlap.
- Success if:
  - Focus visibility and target-size minimums are maintained across responsive states.
- Failure if:
  - Focus ring clipped/covered or tap targets smaller than required minimum.
- Evidence to capture (concise): Video of tabbing near edges + annotated screenshot of measured target sizes.

---

## Regression timing checklist (quick reference)

Use this mini-check in every full run to ensure timing regressions are caught early:

- Immediate (`t=0ms`) after send: input disabled, prompts hidden/locked, user message append, preview clear, send disabled.
- Auto-fill fade: ~`400ms`.
- Preset wait before bulge: ~`1400ms`.
- Bulge duration: ~`300ms`.
- Manual-send typing indicator delay: ~`1500ms`.
- Preset-send typing indicator delay: ~`1000ms`.
- User typed reveal speed (manual send): ~`10ms/char`.
- Bot typed reveal speed: ~`5ms/char`.

Evidence to capture (concise): one timestamped run log or annotated video proving each checkpoint.
