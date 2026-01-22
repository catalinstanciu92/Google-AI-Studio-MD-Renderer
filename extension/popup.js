const enableToggle = document.getElementById('enableToggle');
const everywhereToggle = document.getElementById('everywhereToggle');

chrome.storage.local.get(['enabled', 'runEverywhere'], (result) => {
  enableToggle.checked = result.enabled !== false;
  everywhereToggle.checked = result.runEverywhere === true;
});

enableToggle.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: enableToggle.checked });
});

everywhereToggle.addEventListener('change', () => {
  chrome.storage.local.set({ runEverywhere: everywhereToggle.checked });
});
