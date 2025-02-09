//Main script that runs on the loaded page
(() => {
    chrome.runtime.onMessage.addListener((commandProp, sender, response) => {
        const { type, site, filterAction } = commandProp;

        if (type === "FILTER") {
            if (site == "reddit") {
                if (filterAction == 1) {
                    console.log("Filter site: " + site);
                    filterReddit(filterElement);
                }
                else if (filterAction == 0) {
                    console.log("Unfilter site: " + site);
                    filterReddit(unfilterElement);
                }
            }

        }
    });

    async function filterReddit(filterFunc) {
        const redditFilters = await fetchFilters("rdFiltersStorage");

        //Filter the main content of reddit
        const feedContainer = document.querySelector("shreddit-feed");

        if (feedContainer) { //if there is a feedContainer
            // Select all article and shreddit-ad-post elements within the container
            const elements = feedContainer.querySelectorAll(":scope > article, :scope > shreddit-ad-post");

            //Filter the elements
            elements.forEach(el => filterFunc(el, redditFilters));

        } else { //if there is no feedContainer
            console.warn("No shreddit-feed container found");
        }

        //Filter the side bar
        const sideBar = document.querySelector('div[slot="posts"]');
        if (sideBar) {
            //Select the posts on the side
            const elements = sideBar.querySelectorAll(":scope > div");

            //Filter the elements
            elements.forEach(el => filterFunc(el, redditFilters));

        } else {
            console.warn("No side bar found");
        }

    }

    function filterElement(el, filters) {
        console.log(el);
        // Get all the text within the element
        const text = el.textContent || "";

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
