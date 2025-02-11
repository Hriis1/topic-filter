//Main script that runs on the loaded page
(() => {

    //Set the initial filter val
    let filterToggleVal = false;
    chrome.storage.sync.get(["filterEnabled"], (data) => {
        if (data.filterEnabled !== undefined) {
            filterToggleVal = data.filterEnabled;
        }
    });

    //shared-feed container for reddit
    let redditFilterCount = 0;
    let redditMainContainer = null;

    chrome.runtime.onMessage.addListener((commandProp, sender, response) => {
        const { type, site, filterAction } = commandProp;

        if (type === "FILTER") {
            if (site == "reddit") {

                if (redditFilterCount++ == 0) { //if its the first time the filter event is called for reddit
                    redditMainContainer = document.querySelector("shreddit-feed"); //set the reddit main container
                }

                if (filterAction == 1) {
                    filterToggleVal = true;
                    filterReddit(filterElement);
                }
                else if (filterAction == 0) {
                    filterToggleVal = false;
                    filterReddit(unfilterElement);
                }
            }
        }
    });

    async function filterReddit(filterFunc) {

        if (filterFunc === filterElement) {
            console.log("FILTERING SITE :))");
        } else {
            console.log("UNFILTERING SITE :)");
        }

        const redditFilters = await fetchFilters("rdFiltersStorage");

        if (redditMainContainer) { //if there is a redditMainContainer
            // Select all article and shreddit-ad-post direct children of feed container
            const elements = document.querySelectorAll("shreddit-feed > article, shreddit-feed > shreddit-ad-post");

            //Filter the elements
            elements.forEach(el => filterFunc(el, redditFilters));

        } else { //if there is no redditMainContainer
            console.warn("No shreddit-feed container found");
        }

        //Filter the side bar
        const sideBar = document.querySelector('div[slot="posts"]');
        if (sideBar) {
            //Select the posts on the side - only direct div children
            const elements = sideBar.querySelectorAll('div[slot="posts"] > div');

            //Filter the elements
            elements.forEach(el => filterFunc(el, redditFilters));

        } else {
            console.warn("No side bar found");
        }

    }

    function filterElement(el, filters) {
        // Get all the text within the element to lower case
        const text = (el.textContent || "").toLowerCase();

        // Check if any of the filter keywords appear in the text
        const hasFilterKeyword = filters.some(keyword => text.includes(keyword));

        if (hasFilterKeyword) {
            // Add the class to hide this element
            el.classList.add("filter-extention-d-none");
        }
    }

    function unfilterElement(el, filters) {
        el.classList.remove("filter-extention-d-none");
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
