# Accessibility implementation assumptions

This document captures inferred accessibility implementation details for items **1, 2, 3, 4, 5, and 8** (semantic structure, keyboard map, focus management, name/description mapping, state announcements, and edge cases) across the four interaction specs, incorporating latest clarification decisions.

## 1) Hallucination & Bias (HB)

### Inferred implementation baseline
- **Semantic structure:** `header` + `main` with two `section` regions labelled “Draft generated” and “New message”; post-send view keeps one `main` with two labelled regions (“Draft review”, “Feedback”).
- **Keyboard map:** Draft block receives focus and opens context menu with `Enter`/`Space`; menu uses arrow-key roving, `Enter`/`Space` activates option, `Escape` closes.
- **Focus management:** In post-send feedback view, focus lands on the feedback heading.
- **Accessible names/descriptions:** Draft blocks use visible text as accessible name; contextual actions include block index/context (e.g., “Check content for draft block 2”); send button name is “Send message”.
- **Announcements:** Use one summary announcement when “Check content” applies corrections.
- **Edge-case behaviour:** Draft blocks are deactivated after insertion/check completion and cannot be opened again (no context menu).

## 2) Prompt Drafting (PD)

### Inferred implementation baseline
- **Semantic structure:** `header`, `main` chat transcript region (`role=log`), and footer composer region with prompt presets in a labelled group.
- **Keyboard map:** `Enter` sends when focus is on textarea or send button; keyboard multiline text entry is not accepted; `Shift+Enter` in textarea triggers an error state.
- **Focus management:** No auto-send preset behaviour is assumed.
- **Accessible names/descriptions:** Send button uses explicit `aria-label` if icon-only; preset names are exact button labels; transcript has accessible label like “Conversation”.
- **Announcements:** Typing indicator is announced once per response cycle.
- **Edge-case behaviour:** Locked state prevents duplicate sends; empty/whitespace message blocked with clear programmatic state (`disabled`) and no focus trap.

## 3) Risks of GenAI

### Inferred implementation baseline
- **Semantic structure:** Landmark layout with scenario content in `main`; interactive risk controls grouped in labelled `section`s; spotted-risk panel content is revealed within associated section context.
- **Keyboard map:** Risk options are implemented as radio-button semantics; each option is keyboard activatable and can be re-activated to minimize its revealed hidden-risk panel.
- **Focus management:** On reset/try-again, focus returns to the top scenario heading.
- **Accessible names/descriptions:** Each risk option includes unique name with scenario context and clear selected/expanded state.
- **Announcements:** No dynamic risk-scoring announcements are required.
- **Edge-case behaviour:** Rapid toggles resolve deterministically (last input wins); partially complete states preserve keyboard operability and convey unmet requirements.

## 4) GenAI Can Help (chatbot interaction)

### Inferred implementation baseline
- **Semantic structure:** `header`, `main` conversation container (`role=log`), footer composer; preset prompts as labelled button group.
- **Keyboard map:** Presets and send control are standard buttons; textarea/send shortcut behaviour follows the interaction spec.
- **Focus management:** Initial load places focus in textarea; sending keeps focus in textarea for continued chatting; include a keyboard-accessible “Jump to latest message” control when auto-scroll is paused.
- **Accessible names/descriptions:** Icon-only controls (send, attachment) have explicit names; message bubbles expose sender + message text context.
- **Announcements:** New assistant messages and “assistant typing” status announced politely via conversation log pattern.
- **Edge-case behaviour:** Prevent double-send on rapid Enter; preset prompts are hidden during bot response.
