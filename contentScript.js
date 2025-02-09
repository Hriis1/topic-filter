//Main script that runs on the loaded page
(() => {
    chrome.runtime.onMessage.addListener((commandProp, sender, response) => {
        const { type, site, filterAction } = commandProp;

        if (type === "FILTER") {
            if (site == "reddit") {
                if (filterAction == 1) {
                    console.log("Filter site: " + site);
                    filterReddit(1);
                }
                else if (filterAction == 0) {
                    console.log("Unfilter site: " + site);
                }
            }

        }
    });

    async function filterReddit(filterAction) {
        const redditFilters = await fetchFilters("rdFiltersStorage");

        //Filter the main content of reddit
        const feedContainer = document.querySelector("shreddit-feed");
        if (!feedContainer) {
            console.warn("No shreddit-feed container found");
            return;
        }

        // Select all article and shreddit-ad-post elements within the container
        const elements = feedContainer.querySelectorAll("article, shreddit-ad-post");

        elements.forEach(el => {
            // Get all the text within the element
            const text = el.textContent || "";

            // Check if any of the filter keywords appear in the text
            const hasFilterKeyword = redditFilters.some(keyword => text.includes(keyword));

            if (hasFilterKeyword) {
                // Add the class to hide this element
                el.classList.add("filter-extention-d-none");
            }
        });

        //Filter the side bar
    }


    //Get selected site filters
    function fetchFilters(storageName) {
        return new Promise((resolve) => {
            chrome.storage.sync.get([storageName], (obj) => {
                resolve(obj[storageName] ? JSON.parse(obj[storageName]) : []);
            });
        });
    }

})();
