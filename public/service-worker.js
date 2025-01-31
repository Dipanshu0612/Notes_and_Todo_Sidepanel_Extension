chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;

  await chrome.sidePanel.setOptions({
    tabId,
    path: "index.html",
    enabled: true,
  });
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.sidePanel.setOptions({
  enabled: true,
  path: "index.html",
});