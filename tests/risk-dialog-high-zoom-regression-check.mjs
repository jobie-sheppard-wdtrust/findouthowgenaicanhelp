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
assertPattern(/id="riskDialogScrollRegion"[\s\S]*?role="region"[\s\S]*?aria-labelledby="riskDialogTitle"[\s\S]*?tabindex="-1"/, 'The scroll region must be programmatically focusable without adding a redundant tab stop.');
assertPattern(/function openRiskDialog\([\s\S]*?riskDialogScrollRegion\.scrollTop = 0;[\s\S]*?riskDialogClose\.focus\(\);/, 'Dialog open must reset body scroll once and place initial focus on the close control.');
assertPattern(/function handleRiskDialogScrollKeys\([\s\S]*?ArrowUp[\s\S]*?ArrowDown[\s\S]*?PageUp[\s\S]*?PageDown[\s\S]*?Home[\s\S]*?End[\s\S]*?event\.preventDefault\(\);/, 'Dialog key handling must include deterministic keyboard scrolling for arrow/page/home/end keys.');
assertPattern(/riskDialog\.addEventListener\('keydown',[\s\S]*?handleRiskDialogScrollKeys\(event\);[\s\S]*?event\.key === 'Escape'/, 'The dialog keydown handler must combine scroll-key support with Escape close behavior.');
assertPattern(/document\.body\.style\.overflow = 'hidden';[\s\S]*?document\.body\.style\.overflow = previousBodyOverflow;/, 'Body scroll lock must be explicit and reversible.');

assertNoPattern(/function positionRiskDialog\(/, 'Anchor-based modal positioning function should be removed.');
assertNoPattern(/positionRiskDialog\(/, 'Anchor-based modal positioning calls should be removed.');
assertNoPattern(/window\.addEventListener\('resize',[\s\S]*?positionRiskDialog/, 'Resize reposition handlers should be removed with viewport-centered layout.');
assertNoPattern(/riskDialogBody\.focus\(/, 'The dialog body should not be force-focused.');
assertNoPattern(/riskDialogBody\.scrollTop\s*=|riskDialog\.scrollTop\s*=/, 'Scroll reset logic should not target the wrong node or override position after open.');

const dialogOverflowAutoMatches = html.match(/(#riskDialog|\.risk-dialog-[a-z-]+)\s*\{[\s\S]*?overflow-y:\s*auto;/g) ?? [];
if (dialogOverflowAutoMatches.length !== 1 || !/\.risk-dialog-body\s*\{/.test(dialogOverflowAutoMatches[0])) {
  throw new Error('Exactly one dialog-internal selector should own overflow-y:auto, and it must be .risk-dialog-body.');
}

console.log('Risk dialog high-zoom regression checks passed.');
