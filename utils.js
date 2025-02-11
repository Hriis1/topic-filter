//Utility functions, etc

//Get selected site filters
export function fetchFilters(storageName) {
    return new Promise((resolve) => {
        chrome.storage.sync.get([storageName], (obj) => {
            resolve(obj[storageName] ? JSON.parse(obj[storageName]) : []);
        });
    });
}

//Get the active tab
export async function getActiveTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

//Send a filter command to contentscript
export function sendFilterCommand(activeTab, filterVal) {
    if (activeTab.url.includes("reddit.com")) { //if its a reddit tab
        chrome.tabs.sendMessage(activeTab.id, {
            type: "FILTER",
            site: "reddit",
            filterAction: filterVal
        });
    }
}