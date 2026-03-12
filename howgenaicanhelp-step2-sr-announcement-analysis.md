# howgenaicanhelp-step2: SR announcement-flow analysis (NVDA)

This note analyses the current announcement pipeline in `seehowgenaicanhelp-step2.html` and proposes alternative screen-reader flows that reduce chatter while preserving key state changes.

## Current interlocking announcement flows

1. **Transcript live region (`role="log"`) announces new messages.**
   - The transcript list uses `role="log"`, `aria-live="polite"`, and `aria-relevant="additions"`.
   - Every appended message item can be announced by screen readers as a conversational update.

2. **Separate status live region (`role="status"`) announces operational states.**
   - `#status-announcer` is a second polite live region (`aria-atomic="true"`) for explicit status messages.
   - The queue system serializes these announcements to avoid overlap and uses clear-then-reinsert timing to force re-announcement.

3. **Prompt insertion and send are independently announced.**
   - Selecting a preset announces `Prompt added.`
   - Sending then announces `Prompt sent. GenAI is typing.` (or `Message sent...` for non-preset text).
   - This creates a two-step status sequence before response content arrives.

4. **Typing indicator is visual-only, while status region carries “typing” text.**
   - A typing indicator element is inserted into transcript, but marked `aria-hidden="true"` on bubble visuals.
   - The real SR typing cue comes from status text (`...GenAI is typing.`), not from the indicator itself.

5. **Bot response is typewritten into a message bubble.**
   - The bot message node is appended first, then text is incrementally injected character-by-character unless reduced-motion is enabled.
   - Depending on SR/browser behavior, this can produce partial or repeated fragments during live updates.

6. **Completion and scroll-awareness add additional status text.**
   - If user is scrolled away from the bottom, status announces `New message received. Scroll down to view.`
   - A final `Response finished.` is always queued.

## Why your NVDA log sounds busy

The log reflects **multiple polite live regions and multiple event moments** that are all valid in isolation but cumulative in practice:

- Structure and focus context are read.
- `Prompt added.` comes from status region after prompt click.
- `Prompt sent. GenAI is typing.` comes from status region on send.
- Partial bot text (`Bot:Su`) likely appears because the bot bubble is being updated while inside a live log.
- Final `Response finished.` arrives from status region.

So you get a layered stack: **UI context + status updates + transcript updates + completion marker**.

## WCAG 2.2 AA-aligned design goals for this component

A practical target is:

- Keep users informed about send/start/finish states.
- Avoid duplicate announcements for the same state.
- Preserve conversation discoverability and orientation.
- Ensure non-visual users know when new content is off-screen.
- Avoid chatty per-character announcements.

## Suggested SR flow options

### Option A: “Transcript-led” (minimal status channel)

Use the transcript as the primary announcement source, and keep status region for only edge cases.

- Keep `role="log"` for transcript additions.
- Remove `Prompt added.` and `Response finished.` status announcements.
- Keep one explicit status only when needed:
  - `New message received. Scroll down to view.` when user is away from bottom.
- Stop typewriter updates for SR output (render full final message in one insertion for assistive tech).

**Pros:** quiet, natural chat cadence, low duplication.
**Tradeoff:** less explicit process narration (“typing”, “done”).

### Option B: “State-led” (status region is authoritative)

Treat status-announcer as the single source for process state; keep transcript mostly passive.

- Keep one concise lifecycle sequence:
  - `Prompt ready.` (optional, only after preset selection)
  - `Sending prompt.`
  - `GenAI is typing.`
  - `Response ready.`
- Ensure transcript insertions are not progressively announced (avoid per-character live churn).
- Keep off-screen cue only when needed:
  - `Response ready. New message below.` or `Scroll down to view.`

**Pros:** highly predictable and teachable.
**Tradeoff:** potentially more “system-like” than conversational.

### Option C: “Hybrid adaptive” (recommended)

Blend A and B with dynamic verbosity rules.

- Default concise flow:
  - On preset selection: no announcement unless user requests confirmation mode.
  - On send: `Message sent.`
  - On response completion: no explicit “finished” if transcript auto-scroll is at bottom (the new bot message is enough).
- Conditional announcements:
  - If away from bottom: `New response received. Scroll down to view.`
  - If response takes > N seconds: delayed `Still working...` reassurance.
  - If errors/timeouts occur: assertive error announcement.
- Use full-message insertion for SR, while visually keeping typing animation if desired.

**Pros:** best balance of reassurance and low-noise behavior.
**Tradeoff:** requires slightly more branching logic.

## Practical anti-spam rules you can implement quickly

1. **No duplicate semantics in same phase.**
   - If transcript will announce new bot message, skip `Response finished.`.
2. **No per-character live updates.**
   - Build full bot text off-screen or in a non-live buffer, then insert once.
3. **Announce only transitions users cannot infer visually.**
   - Off-screen new content, long waits, failures.
4. **Use a simple event gate.**
   - Do not enqueue a new status if it repeats the previous phrase family (`sent`, `typing`, `done`) within a short window.

## Suggested “first pass” implementation strategy

If you want a low-risk first change:

- Keep current structure.
- Remove `Prompt added.` and `Response finished.` announcements.
- Keep `Message/Prompt sent.` and conditional `New message received. Scroll down to view.`.
- Change bot text rendering so SR receives one complete message rather than incremental fragments.

This should cut announcement volume significantly without changing layout or interaction model.
