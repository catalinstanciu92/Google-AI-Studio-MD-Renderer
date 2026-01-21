const toggle = document.getElementById('enableToggle');

chrome.storage.local.get(['enabled'], (result) => {
  toggle.checked = result.enabled !== false;
});

toggle.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: toggle.checked });
});
