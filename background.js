chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "loading" || !tab.url.startsWith("http")) return;

  chrome.storage.local.get(["blockedSites"], (result) => {
    const sites = result.blockedSites || [];
    const matched = sites.find(site => tab.url.includes(site));
    if (matched) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          window.location.href = chrome.runtime.getURL("blocked.html");
        }
      });
    }
  });
});
