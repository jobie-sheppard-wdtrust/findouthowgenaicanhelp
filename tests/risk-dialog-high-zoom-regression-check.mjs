import { readFileSync } from 'node:fs';

const html = readFileSync('risk-step3.html', 'utf8');

function assertPattern(pattern, message) {
  if (!pattern.test(html)) {
    throw new Error(message);
  }
}

function assertNoPattern(pattern, message) {
  if (pattern.test(html)) {
    throw new Error(message);
  }
}

assertPattern(/#riskDialogBackdrop\[hidden\]\s*\{[\s\S]*?display:\s*none;/, 'The hidden backdrop state must explicitly collapse display so the dialog is not visible on initial load.');
assertPattern(/#riskDialog\s*\{[\s\S]*?max-height:\s*calc\(100dvh\s*-\s*2rem\);[\s\S]*?overflow:\s*hidden;/, 'The risk dialog shell must remain non-scrolling while clamped to the viewport.');
assertPattern(/\.risk-dialog-body\s*\{[\s\S]*?flex:\s*1;[\s\S]*?min-height:\s*0;[\s\S]*?overflow-y:\s*auto;/, 'The risk dialog body must be the sole flex scroll container.');
assertPattern(/id="riskDialogBackdrop"[^>]*\shidden/, 'The risk dialog backdrop must start hidden in markup to keep the modal closed at load.');
assertPattern(/id="riskDialog"[\s\S]*?role="dialog"[\s\S]*?aria-modal="true"[\s\S]*?aria-labelledby="riskDialogHeading"[\s\S]*?aria-describedby="riskDialogBody"/, 'Dialog accessibility semantics must remain intact.');
assertPattern(/function openRiskDialog\([\s\S]*?riskDialogClose\.focus\(\);/, 'Initial dialog focus must land on the close control.');
assertPattern(/document\.body\.style\.overflow = 'hidden';[\s\S]*?document\.body\.style\.overflow = previousBodyOverflow;/, 'Body scroll lock must be explicit and reversible.');

assertNoPattern(/function positionRiskDialog\(/, 'Anchor-based modal positioning function should be removed.');
assertNoPattern(/positionRiskDialog\(/, 'Anchor-based modal positioning calls should be removed.');
assertNoPattern(/window\.addEventListener\('resize',[\s\S]*?positionRiskDialog/, 'Resize reposition handlers should be removed with viewport-centered layout.');
assertNoPattern(/event\.key\s*===\s*'ArrowUp'|event\.key\s*===\s*'ArrowDown'|event\.key\s*===\s*'PageUp'|event\.key\s*===\s*'PageDown'|event\.key\s*===\s*'Home'|event\.key\s*===\s*'End'|event\.key\s*===\s*' '/, 'Dialog key remapping for scroll keys must be removed.');
assertNoPattern(/riskDialogBody\.focus\(/, 'The dialog body should not be force-focused.');
assertNoPattern(/risk-dialog-body"[^>]*tabindex="0"|id="riskDialogScrollRegion"[^>]*tabindex="0"/, 'The scroll body must not introduce an inert tab stop with tabindex="0".');
assertNoPattern(/riskDialogBody\.scrollTop\s*=|riskDialog\.scrollTop\s*=/, 'Scroll reset logic should not override user scroll position.');

const dialogOverflowAutoMatches = html.match(/(#riskDialog|\.risk-dialog-[a-z-]+)\s*\{[\s\S]*?overflow-y:\s*auto;/g) ?? [];
if (dialogOverflowAutoMatches.length !== 1 || !/\.risk-dialog-body\s*\{/.test(dialogOverflowAutoMatches[0])) {
  throw new Error('Exactly one dialog-internal selector should own overflow-y:auto, and it must be .risk-dialog-body.');
}

console.log('Risk dialog high-zoom regression checks passed.');
