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

assertPattern(riskStep3Html, /#riskDialog\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?max-height:\s*min\(20rem,\s*calc\(100dvh\s*-\s*1rem\)\);[\s\S]*?overflow:\s*hidden;/, 'Risk detail popup must use fixed anchored geometry with viewport height guard.');
assertPattern(riskStep3Html, /\.risk-dialog-body\s*\{[\s\S]*?flex:\s*1\s+1\s+auto;[\s\S]*?min-height:\s*0;[\s\S]*?overflow-y:\s*auto;/, 'Risk dialog body must be the only scroll owner with flex sizing and min-height guard.');
assertPattern(riskStep3Html, /<section id="riskDialog" role="region" aria-labelledby="riskDialogHeading" aria-describedby="riskDialogBody" hidden>/, 'Risk details should now use an in-page region semantics model.');
assertPattern(riskStep3Html, /function\s+positionRiskDialog\(triggerEl\)\s*\{[\s\S]*?const placeBelow = belowSpace >= dialogHeight \|\| belowSpace >= aboveSpace;[\s\S]*?riskDialog\.classList\.toggle\('risk-dialog-below', placeBelow\);[\s\S]*?riskDialog\.classList\.toggle\('risk-dialog-above', !placeBelow\);/, 'Popup placement should prefer below when possible and otherwise place above.');
assertPattern(riskStep3Html, /function openRiskDialog\(key, triggerEl\)[\s\S]*?riskDialog\.hidden\s*=\s*false;[\s\S]*?positionRiskDialog\(triggerEl\);[\s\S]*?riskDialogHeading\.focus\(\);/, 'Opening risk details should show the popup, position it, and focus the heading.');
assertPattern(riskStep3Html, /setRiskTriggerExpandedState\(activeTrigger = null\)/, 'Trigger expanded-state helper must remain present.');
assertPattern(riskStep3Html, /messagesScroll\.addEventListener\('scroll', onViewPortOrTranscriptScroll, \{ passive: true \}\);/, 'Popup should reposition during transcript scrolling.');
assertPattern(riskStep3Html, /window\.addEventListener\('resize', onViewPortOrTranscriptScroll\);/, 'Popup should reposition during viewport resizing.');
assertPattern(riskStep3Html, /document\.addEventListener\('keydown', \(event\) => \{[\s\S]*?event\.key === 'Escape' && !riskDialog\.hidden[\s\S]*?closeRiskDialog\(\);/, 'Escape key should close risk details while open.');
assertNoPattern(riskStep3Html, /aria-modal="true"/, 'Risk details must no longer expose modal semantics in Model B.');
assertNoPattern(riskStep3Html, /document\.body\.style\.overflow\s*=\s*'hidden'/, 'Model B must not lock background scroll.');
assertNoPattern(riskStep3Html, /appRoot\.inert\s*=\s*true/, 'Model B must not inert the rest of the app.');
assertNoPattern(riskStep3Html, /riskDialogBody\.focus\(\)/, 'Modal open logic must not force-focus the scroll body.');
assertNoPattern(riskStep3Html, /riskDialogScrollRegion/, 'Legacy risk dialog scroll-region element references must be removed.');
assertNoPattern(riskStep3Html, /class="risk-dialog-body"[^>]*tabindex="0"/, 'Risk dialog scroll container must not be inserted into tab order with tabindex=0.');
assertNoPattern(riskStep3Html, /event\.key\s*===\s*'(ArrowUp|ArrowDown|PageUp|PageDown|Home|End|\s)'/, 'Risk dialog keyboard handler must not remap browser-native scroll keys.');

console.log('Modal high-zoom regression checks passed.');
