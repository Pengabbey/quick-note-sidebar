chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.startsWith("http")) return;

  chrome.tabs.sendMessage(tab.id, {
    action: "toggle"
  });
});