//Utility functions, etc

//Get selected site
export function fetchFilters(storageName) {
    return new Promise((resolve) => {
        chrome.storage.sync.get([storageName], (obj) => {
            resolve(obj[storageName] ? JSON.parse(obj[storageName]) : []);
        });
    });
}