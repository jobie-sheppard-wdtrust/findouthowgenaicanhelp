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
