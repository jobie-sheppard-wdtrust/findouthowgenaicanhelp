(function attachHBStep5HostIntegration() {
  const EMBED_CONTEXT_ID = 'hb-step5';
  const RESIZE_EVENT = 'hb-step5:resize';
  const ENSURE_VISIBLE_EVENT = 'hb-step5:ensure-visible';
  const ENSURE_VISIBLE_ACK_EVENT = 'hb-step5:ensure-visible:ack';

  function findStep5Iframe(sourceWindow) {
    const frames = [...document.querySelectorAll('iframe')];
    return frames.find((frame) => frame.contentWindow === sourceWindow)
      || frames.find((frame) => frame.dataset?.embedContext === EMBED_CONTEXT_ID)
      || null;
  }

  function updateFrameHeight(frame, nextHeight) {
    const parsedHeight = Number(nextHeight);
    if (!Number.isFinite(parsedHeight) || parsedHeight <= 0) return;
    frame.style.height = `${Math.ceil(parsedHeight)}px`;
  }

  window.addEventListener('message', (event) => {
    const data = event?.data;
    if (!data || typeof data !== 'object') return;

    const frame = findStep5Iframe(event.source);
    if (!frame) return;

    if (data.type === RESIZE_EVENT && data.context === EMBED_CONTEXT_ID) {
      updateFrameHeight(frame, data.height);
      return;
    }

    if (data.type !== ENSURE_VISIBLE_EVENT || data.context !== EMBED_CONTEXT_ID) {
      return;
    }

    frame.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });

    event.source?.postMessage(
      {
        type: ENSURE_VISIBLE_ACK_EVENT,
        context: EMBED_CONTEXT_ID,
        requestId: data.requestId
      },
      event.origin || '*'
    );
  });
})();
