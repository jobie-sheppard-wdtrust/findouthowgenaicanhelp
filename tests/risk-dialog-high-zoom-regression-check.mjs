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

// Layout and display
assertPattern(/#riskDialogBackdrop\[hidden\]\s*\{[\s\S]*?display:\s*none;/, 'The hidden backdrop state must explicitly collapse display so the dialog is not visible on initial load.');
assertPattern(/#riskDialog\s*\{[\s\S]*?max-height:\s*calc\(100dvh\s*-\s*2rem\);[\s\S]*?overflow:\s*hidden;/, 'The risk dialog shell must remain non-scrolling while clamped to the viewport.');
assertPattern(/#riskDialog\s*\{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-rows:\s*auto\s+minmax\(0,\s*1fr\);/, 'The risk dialog must use CSS Grid with auto/minmax(0,1fr) rows so the body is definitively sized.');
assertPattern(/\.risk-dialog-body\s*\{[\s\S]*?min-height:\s*0;[\s\S]*?overflow-y:\s*auto;/, 'The risk dialog body must be the sole scroll container with min-height:0.');
assertPattern(/#riskDialog\s*\{[\s\S]*?max-height:\s*calc\(100vh\s*-\s*2rem\);/, 'The risk dialog must include a vh fallback for browsers that do not support dvh.');
assertPattern(/overscroll-behavior:\s*contain;/, 'The scroll region must use overscroll-behavior:contain to prevent scroll chaining.');

// Hidden-on-load
assertPattern(/id="riskDialogBackdrop"[^>]*\shidden/, 'The risk dialog backdrop must start hidden in markup to keep the modal closed at load.');

// Accessibility semantics
assertPattern(/id="riskDialog"[\s\S]*?role="dialog"[\s\S]*?aria-modal="true"[\s\S]*?aria-labelledby="riskDialogHeading"[\s\S]*?aria-describedby="riskDialogBody"/, 'Dialog accessibility semantics must remain intact.');
assertPattern(/id="riskDialogScrollRegion"[\s\S]*?role="region"[\s\S]*?aria-label="Risk explanation[^"]*"[\s\S]*?tabindex="0"/, 'The scroll region must be tabbable (tabindex=0) for NVDA focus-mode keyboard scroll support.');

// Dialog open behavior
assertPattern(/function openRiskDialog\([\s\S]*?riskDialogScrollRegion\.scrollTop = 0;[\s\S]*?riskDialogScrollRegion\.focus\(\);/, 'Dialog open must reset body scroll and focus the scroll region.');

// Keyboard handling
assertPattern(/function getRiskDialogScrollCommand\([\s\S]*?ArrowUp[\s\S]*?Up[\s\S]*?keyCode === 38[\s\S]*?PageDown[\s\S]*?keyCode === 34[\s\S]*?function handleRiskDialogScrollKeys\([\s\S]*?event\.preventDefault\(\);/, 'Dialog key handling must include deterministic keyboard scrolling for arrow/page/home/end keys, including legacy key variants.');
assertPattern(/riskDialog\.addEventListener\('keydown',[\s\S]*?event\.key === 'Escape'/, 'The dialog keydown handler must preserve modal focus-trap and Escape close behavior.');
assertPattern(/function routeRiskDialogCaptureKeys\([\s\S]*?handleRiskDialogScrollKeys\(event\);[\s\S]*?window\.addEventListener\('keydown', routeRiskDialogCaptureKeys, true\);/, 'Capture-phase keydown routing must intercept scroll keys for the dialog.');

// Body scroll lock
assertPattern(/document\.body\.style\.overflow = 'hidden';[\s\S]*?document\.body\.style\.overflow = previousBodyOverflow;/, 'Body scroll lock must be explicit and reversible.');

// Focus trap handles non-tabbable active element
assertPattern(/!isInTabbableSet[\s\S]*?event\.shiftKey[\s\S]*?last\.focus\(\)[\s\S]*?first\.focus\(\)/, 'Focus trap must redirect Tab correctly when active element is outside the tabbable set.');

// Removed patterns
assertNoPattern(/function positionRiskDialog\(/, 'Anchor-based modal positioning function should be removed.');
assertNoPattern(/positionRiskDialog\(/, 'Anchor-based modal positioning calls should be removed.');
assertNoPattern(/window\.addEventListener\('resize',[\s\S]*?positionRiskDialog/, 'Resize reposition handlers should be removed with viewport-centered layout.');
assertNoPattern(/riskDialogBody\.focus\(/, 'The dialog body should not be force-focused.');
assertNoPattern(/riskDialogBody\.scrollTop\s*=|riskDialog\.scrollTop\s*=/, 'Scroll reset logic should not target the wrong node or override position after open.');

// Diagnostic overlay should be removed (was temporary)
assertNoPattern(/id="scrollDiag"/, 'Diagnostic telemetry overlay should be removed after debugging is complete.');

const dialogOverflowAutoMatches = html.match(/(#riskDialog|\.risk-dialog-[a-z-]+)\s*\{[\s\S]*?overflow-y:\s*auto;/g) ?? [];
if (dialogOverflowAutoMatches.length !== 1 || !/\.risk-dialog-body\s*\{/.test(dialogOverflowAutoMatches[0])) {
  throw new Error('Exactly one dialog-internal selector should own overflow-y:auto, and it must be .risk-dialog-body.');
}

console.log('Risk dialog high-zoom regression checks passed.');
