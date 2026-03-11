import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

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

// 1) Static checks for contract and anti-regressions.
assertPattern(/function trapDialogFocus\(event\)\s*\{[\s\S]*?event\.key !== 'Tab'/, 'trapDialogFocus must remain Tab-only.');
assertPattern(/function openRiskDialog\(key, triggerEl\)[\s\S]*?riskDialogClose\.focus\(\);/, 'openRiskDialog must place initial focus on the close button.');
assertPattern(/riskDialog\.addEventListener\('keydown', \(event\) => \{[\s\S]*?trapDialogFocus\(event\);[\s\S]*?event\.key === 'Escape'[\s\S]*?event\.preventDefault\(\);[\s\S]*?closeRiskDialog\(\);[\s\S]*?\}\);/, 'Dialog keydown listener must keep Escape custom and routed to closeRiskDialog.');
assertPattern(/\.risk-dialog-body\s*\{[\s\S]*?overflow-y:\s*auto;/, '.risk-dialog-body must remain the scrollable region.');

assertNoPattern(/function positionRiskDialog\(/, 'Anchor positioning helper must not return.');
assertNoPattern(/riskDialog\.style\.(left|top)\s*=\s*`/, 'Custom left/top positioning math must not return.');
assertNoPattern(/scrollTop\s*[+\-*/]?=/, 'Custom scroll math must not be introduced into dialog logic.');
assertNoPattern(/event\.key\s*===\s*'(ArrowDown|ArrowUp|PageDown|PageUp|Home|End)'/, 'Native scroll keys must not be custom-handled in the dialog listener.');

// 2) Runtime-like checks by executing the real keydown callback body against event doubles.
const keydownMatch = html.match(/riskDialog\.addEventListener\('keydown', \(event\) => \{([\s\S]*?)\n\s*\}\);/);
if (!keydownMatch) {
  throw new Error('Unable to locate riskDialog keydown callback for runtime checks.');
}

const keydownBody = keydownMatch[1];
const invokeKeydown = new Function('event', 'trapDialogFocus', 'closeRiskDialog', keydownBody);

let closeCount = 0;
function closeRiskDialogMock() {
  closeCount += 1;
}

function trapDialogFocusMock(event) {
  if (event.key === 'Tab') {
    event.preventDefault();
  }
}

function makeEvent(key) {
  return {
    key,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
  };
}

const escapeEvent = makeEvent('Escape');
invokeKeydown(escapeEvent, trapDialogFocusMock, closeRiskDialogMock);
assert.equal(escapeEvent.defaultPrevented, true, 'Escape must still be prevented/custom-handled.');
assert.equal(closeCount, 1, 'Escape must still call closeRiskDialog.');

const pageDownEvent = makeEvent('PageDown');
invokeKeydown(pageDownEvent, trapDialogFocusMock, closeRiskDialogMock);
assert.equal(pageDownEvent.defaultPrevented, false, 'PageDown must remain native (not prevented).');

const endEvent = makeEvent('End');
invokeKeydown(endEvent, trapDialogFocusMock, closeRiskDialogMock);
assert.equal(endEvent.defaultPrevented, false, 'End must remain native (not prevented).');

// Simulate browser-native scrolling behavior only when event is not prevented.
const scroller = {
  clientHeight: 80,
  scrollHeight: 680,
  scrollTop: 0,
};

function pressAndApplyNativeScroll(key) {
  const event = makeEvent(key);
  invokeKeydown(event, trapDialogFocusMock, closeRiskDialogMock);
  if (event.defaultPrevented) {
    return;
  }

  const max = scroller.scrollHeight - scroller.clientHeight;
  if (key === 'PageDown') {
    scroller.scrollTop = Math.min(max, scroller.scrollTop + Math.floor(scroller.clientHeight * 0.9));
  } else if (key === 'End') {
    scroller.scrollTop = max;
  }
}

for (let i = 0; i < 20; i += 1) {
  pressAndApplyNativeScroll('PageDown');
}

const maxScrollTop = scroller.scrollHeight - scroller.clientHeight;
assert.equal(scroller.scrollTop, maxScrollTop, 'Native key intent must be able to reach the true bottom of .risk-dialog-body.');

console.log('Risk dialog keyboard and high-zoom regression checks passed.');
