//Background service worker
//Runs independantly of the page

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only act when the tab is completely loaded
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("reddit.com")) {
        console.log("This is a redit page");
    }
  });
  