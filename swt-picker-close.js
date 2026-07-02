/* ปิด picker ที่โหลดใน iframe จาก swt-doc-finder (SC-1/2/3) */
(function () {
  'use strict';
  function notifyParent() {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'df:close-frame' }, '*');
      }
    } catch (e) { /* noop */ }
  }

  function closeStandaloneOverlay() {
    var ov = document.querySelector('.modal-overlay');
    if (ov) ov.style.display = 'none';
  }

  function dfPickerClose() {
    try {
      if (window.parent && window.parent !== window && typeof window.parent.dfCloseFrame === 'function') {
        window.parent.dfCloseFrame();
        return;
      }
    } catch (e) { /* cross-origin guard */ }
    notifyParent();
    closeStandaloneOverlay();
  }
  window.dfPickerClose = dfPickerClose;

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.classList) return;
    if (t.classList.contains('close-btn') || (t.classList.contains('win-btn') && t.classList.contains('close'))) {
      e.preventDefault();
      dfPickerClose();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      dfPickerClose();
    }
  });
})();
