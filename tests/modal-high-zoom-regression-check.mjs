import { readFileSync } from 'node:fs';

const hbStep5Html = readFileSync('HB-step5.html', 'utf8');
const riskStep3Html = readFileSync('risk-step3.html', 'utf8');

function assertPattern(html, pattern, message) {
  if (!pattern.test(html)) {
    throw new Error(message);
  }
}

function assertNoPattern(html, pattern, message) {
  if (pattern.test(html)) {
    throw new Error(message);
  }
}

assertPattern(hbStep5Html, /\.modal-overlay\s*\{[\s\S]*?inset:\s*0;[\s\S]*?overflow-y:\s*auto;/, 'Modal overlay must fill the viewport and support vertical scrolling.');
assertPattern(hbStep5Html, /\.modal-card\s*\{[\s\S]*?width:\s*min\(100%\s*-\s*2rem,\s*42rem\);[\s\S]*?max-width:\s*100%;/, 'Modal card must use responsive width constraints.');
assertPattern(hbStep5Html, /\.modal-body,[\s\S]*?overflow-wrap:\s*anywhere;/, 'Modal text must support natural wrapping.');
assertPattern(hbStep5Html, /@media\s*\(max-width:\s*32rem\)[\s\S]*?\.modal-actions\s*\{[\s\S]*?flex-direction:\s*column;/, 'Modal actions must stack vertically on narrow viewports.');
assertPattern(hbStep5Html, /function keepFocusedControlInView\(target\)[\s\S]*?scrollIntoView\(\{ block: 'nearest', inline: 'nearest' \}\);/, 'Focused controls must be scrolled into view with nearest alignment.');
assertPattern(hbStep5Html, /document\.addEventListener\('focusin',[\s\S]*?keepFocusedControlInView\(event\.target\);/, 'Focus-in handler must call keepFocusedControlInView while the modal is open.');
assertPattern(hbStep5Html, /id="feedback-modal"[\s\S]*?role="dialog"[\s\S]*?aria-modal="true"[\s\S]*?aria-labelledby="feedback-modal-title"[\s\S]*?aria-describedby="feedback-modal-message feedback-modal-helper"/, 'Dialog semantics must remain intact.');
assertPattern(hbStep5Html, /id="feedback-modal-continue"/, 'Regression case requires the last action button to exist for keyboard focus traversal.');

assertPattern(riskStep3Html, /#riskDialogBackdrop\s*\{[\s\S]*?display:\s*grid;[\s\S]*?place-items:\s*center;[\s\S]*?padding:\s*1rem;/, 'Risk dialog backdrop must center the modal using stable viewport layout.');
assertPattern(riskStep3Html, /#riskDialog\s*\{[\s\S]*?max-height:\s*calc\(100dvh\s*-\s*2rem\);[\s\S]*?overflow:\s*hidden;/, 'Risk dialog shell must cap viewport height and remain non-scrolling.');
assertPattern(riskStep3Html, /\.risk-dialog-body\s*\{[\s\S]*?flex:\s*1\s+1\s+auto;[\s\S]*?min-height:\s*0;[\s\S]*?overflow-y:\s*auto;/, 'Risk dialog body must be the only scroll owner with flex sizing and min-height guard.');
assertPattern(riskStep3Html, /<section id="riskDialog" role="dialog" aria-modal="true" aria-labelledby="riskDialogHeading" aria-describedby="riskDialogBody" tabindex="-1">/, 'Risk dialog must preserve accessible modal semantics.');
assertPattern(riskStep3Html, /previousBodyOverflow\s*=\s*document\.body\.style\.overflow;[\s\S]*?document\.body\.style\.overflow\s*=\s*'hidden';[\s\S]*?document\.body\.style\.overflow\s*=\s*previousBodyOverflow;/, 'Background scroll lock must be explicit on open and restored on close.');
assertPattern(riskStep3Html, /function openRiskDialog\(key, triggerEl\)[\s\S]*?riskDialogClose\.focus\(\);/, 'Initial focus should move to the close control when opening the modal.');
assertNoPattern(riskStep3Html, /function\s+positionRiskDialog\s*\(/, 'Anchor-based risk dialog positioning function must be removed.');
assertNoPattern(riskStep3Html, /positionRiskDialog\(/, 'Risk dialog open and resize logic must not call anchor positioning.');
assertNoPattern(riskStep3Html, /riskDialogBody\.focus\(\)/, 'Modal open logic must not force-focus the scroll body.');
assertNoPattern(riskStep3Html, /riskDialogScrollRegion/, 'Legacy risk dialog scroll-region element references must be removed.');
assertNoPattern(riskStep3Html, /class="risk-dialog-body"[^>]*tabindex="0"/, 'Risk dialog scroll container must not be inserted into tab order with tabindex=0.');
assertNoPattern(riskStep3Html, /event\.key\s*===\s*'(ArrowUp|ArrowDown|PageUp|PageDown|Home|End|\s)'/, 'Risk dialog keyboard handler must not remap browser-native scroll keys.');
assertNoPattern(riskStep3Html, /scrollTop\s*=\s*0|scrollTo\(/, 'Risk dialog should not reset scroll position programmatically on open/close.');

console.log('Modal high-zoom regression checks passed.');
