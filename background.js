//Background service worker
//Runs independantly of the page

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only act when the tab is completely loaded
    if (changeInfo.status === 'complete' && tab.url) {
        
        if (tab.url.includes("reddit.com")) { //if its a reddit tab
            chrome.tabs.sendMessage(tabId, {
                type: "FILTER",
                site: "reddit",
            })
                .then(() => {
                    console.log("Message sent successfully to tab:", tabId);
                })
                .catch(err => {
                    console.error("Message failed to send:", err);
                });
        }
    }
});
