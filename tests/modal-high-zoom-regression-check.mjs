import { readFileSync } from 'node:fs';

const html = readFileSync('HB-step5.html', 'utf8');

function assertPattern(pattern, message) {
  if (!pattern.test(html)) {
    throw new Error(message);
  }
}

assertPattern(/\.modal-overlay\s*\{[\s\S]*?inset:\s*0;[\s\S]*?overflow-y:\s*auto;/, 'Modal overlay must fill the viewport and support vertical scrolling.');
assertPattern(/\.modal-card\s*\{[\s\S]*?width:\s*min\(100%\s*-\s*2rem,\s*42rem\);[\s\S]*?max-width:\s*100%;/, 'Modal card must use responsive width constraints.');
assertPattern(/\.modal-body,[\s\S]*?overflow-wrap:\s*anywhere;/, 'Modal text must support natural wrapping.');
assertPattern(/@media\s*\(max-width:\s*32rem\)[\s\S]*?\.modal-actions\s*\{[\s\S]*?flex-direction:\s*column;/, 'Modal actions must stack vertically on narrow viewports.');
assertPattern(/function keepFocusedControlInView\(target\)[\s\S]*?scrollIntoView\(\{ block: 'nearest', inline: 'nearest' \}\);/, 'Focused controls must be scrolled into view with nearest alignment.');
assertPattern(/document\.addEventListener\('focusin',[\s\S]*?keepFocusedControlInView\(event\.target\);/, 'Focus-in handler must call keepFocusedControlInView while the modal is open.');
assertPattern(/id="feedback-modal"[\s\S]*?role="dialog"[\s\S]*?aria-modal="true"[\s\S]*?aria-labelledby="feedback-modal-title"[\s\S]*?aria-describedby="feedback-modal-message feedback-modal-helper"/, 'Dialog semantics must remain intact.');
assertPattern(/id="feedback-modal-continue"/, 'Regression case requires the last action button to exist for keyboard focus traversal.');

console.log('Modal high-zoom regression checks passed.');
