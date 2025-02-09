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
export async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}