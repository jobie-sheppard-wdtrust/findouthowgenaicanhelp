SC tested: 1.3.1 Info and Relationships + 4.1.2 Name, Role, Value (landmarks, transcript semantics, accessible names, and state exposure for startup controls)
Result: PASS
EVIDENCE: The document uses semantic `header`, `main`, and `footer` landmarks, includes an `h1` of "GenAI Chatbot", exposes the transcript as a single `role="log"` live region, provides an explicit `<label>` for the textarea (`Message`), marks decorative avatar/send SVGs as `aria-hidden="true"`, and initializes/toggles send button disabled state from trimmed input content in script.
Description: This received a PASS because the startup semantic structure and core programmatic control semantics are explicitly present in the source and can be verified from static code and deterministic script logic.
Testing steps:

SC tested: 1.3.2 Meaningful Sequence + 2.4.3 Focus Order (initial keyboard traversal order in startup state)
Result: PASS
EVIDENCE: The tabbable sequence is determinable from source order and focusability: `main` has `tabindex="0"`, then three prompt `<button>` elements, then the `<textarea>`, then the send `<button>`. No extra positive tabindex values or hidden interactive controls are present.
Description: This received a PASS because the DOM order and explicit focusability produce a predictable, task-aligned keyboard order in the initial state.
Testing steps:

SC tested: 2.4.2 Page Titled
Result: PASS
EVIDENCE: The `<title>` element is set to `GenAI Chatbot`.
Description: This received a PASS because the exact required title string is present in code.
Testing steps:

SC tested: 2.4.7 Focus Visible
Result: PASS
EVIDENCE: A global `:focus-visible` style applies a `3px` solid focus outline with `2px` offset, and no rule removes focus indication from interactive controls.
Description: This received a PASS because explicit visible focus styling is defined for keyboard focus in the code.
Testing steps:

SC tested: 3.3.2 Labels or Instructions (startup instruction text for preset-driven usage)
Result: PASS
EVIDENCE: The page now includes visible startup instruction text, `Click one of the prompts to see examples of how GenAI can help`, in an element with id `message-instruction`, and the textarea references that instruction via `aria-describedby="message-instruction"`.
Description: This received a PASS because the startup instruction is present as persistent visible text and is programmatically associated with the message input so users and assistive technologies receive the same guidance.
Testing steps:
