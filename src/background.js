let state;

function safeSendMessage(tabId, message) {
  chrome.tabs.sendMessage(tabId,message, () => {
    if (chrome.runtime.lastError) {}
  });
}

function getStateForUrl(url) {
  if (!url) {
    return "idle";
  } else if (url.includes("github.com")) {
    return "focused";
  } else if (url.includes("youtube.com")) {
    return "bored";
  } else {
    return "idle";
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getState") {
    sendResponse({ state: state});
  }
})

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log(tab.url);
    let url = tab.url;

    state = getStateForUrl(url);
    safeSendMessage(activeInfo.tabId, { state: state });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    let url = tab.url;
    state = getStateForUrl(url);
    safeSendMessage(tabId, { state: state });
  }
});
