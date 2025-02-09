//Background service worker
//Runs independantly of the page

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Only act when the tab is completely loaded
    if (changeInfo.status === 'complete' && tab.url) {

        // Load saved toggle state
        const data = await new Promise((resolve) =>
            chrome.storage.sync.get(['filterEnabled'], resolve)
        );

        if (data.filterEnabled) { //if filtering is enabled
            if (tab.url.includes("reddit.com")) { //if its a reddit tab
                chrome.tabs.sendMessage(tabId, {
                    type: "FILTER",
                    site: "reddit",
                    filterAction: 1
                });
            } else {
                console.log("No msg sent");
            }
        } else {
            console.log("NO filters");
        }
    }
});
