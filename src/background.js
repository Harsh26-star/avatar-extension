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

let state;

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log(tab.url);
    let url = tab.url;
    
    state = getStateForUrl(url)
    chrome.tabs.sendMessage(activeInfo.tabId, {state: state});
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        let url = tab.url;
        state = getStateForUrl(url)
        chrome.tabs.sendMessage(tabId, {state: state});
    }
});