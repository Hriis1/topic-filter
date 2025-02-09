//Background service worker
//Runs independantly of the page

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Only act when the tab is completely loaded
    if (changeInfo.status === 'complete' && tab.url) {

        // Load saved toggle state
        const data = await new Promise((resolve) =>
            chrome.storage.sync.get(['filterEnabled'], resolve)
        );

        // Set filterAction based on the retrieved value
        const filterAction = data.filterEnabled ? 1 : 0;

        if (tab.url.includes("reddit.com")) { //if its a reddit tab
            chrome.tabs.sendMessage(tabId, {
                type: "FILTER",
                site: "reddit",
                filterAction: filterAction
            });
        } else {
            chrome.tabs.sendMessage(tabId, {
                type: "DEFAULT",
                site: "",
            });
        }
    }
});
