//Script that runs on the popup html page

import * as Utils from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const filterTitle = document.getElementById("filter-title");
    const filterInput = document.getElementById("filter-input");
    const addFilterBtn = document.getElementById("add-filter");
    const filterList = document.getElementById("filter-list");
    const tabButtons = document.querySelectorAll(".tab-button");
    const toggleSwitch = document.getElementById("filter-toggle");

    let currentSite = "Reddit";
    //Load the saved filters
    let filters = {
        Reddit: {
            storageName: "rdFiltersStorage",
            fillterWords: await Utils.fetchFilters("rdFiltersStorage")
        },
        Facebook: {
            storageName: "fbFiltersStorage",
            fillterWords: await Utils.fetchFilters("fbFiltersStorage")
        },
        YouTube: {
            storageName: "ytFiltersStorage",
            fillterWords: await Utils.fetchFilters("ytFiltersStorage")
        },
    };
    updateFilterList();

    // Load saved toggle state
    chrome.storage.sync.get(["filterEnabled"], (data) => {
        if (data.filterEnabled !== undefined) {
            toggleSwitch.checked = data.filterEnabled;
        }
    });

    //When filter/unfilter switch is toggled
    toggleSwitch.addEventListener("change", async () => {
        //Store state
        chrome.storage.sync.set({ filterEnabled: toggleSwitch.checked });

        //Get the active tab and check if site is supported
        const tab = await Utils.getActiveTab();
        filterVal = toggleSwitch.checked ? 1 : 0; //1 - filter, 0 - unfilter
        if (tab.url.includes("reddit.com")) { //if its a reddit tab
            chrome.tabs.sendMessage(tab.id, {
                type: "FILTER",
                site: "reddit",
                filterAction: filterVal
            });
        }
    });

    // Change tab
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentSite = button.dataset.site;
            filterTitle.textContent = `Filters for ${currentSite}`;
            updateFilterList();
        });
    });

    // Add filter
    addFilterBtn.addEventListener("click", () => {
        const filterText = filterInput.value.trim();
        if (filterText) {
            filters[currentSite].fillterWords.push(filterText);
            filterInput.value = "";
            updateFilterList();
        }
    });

    // Update filter list
    function updateFilterList() {
        //Sort the array of the curretn site
        filters[currentSite].fillterWords.sort();

        //Store current filters to chrome
        chrome.storage.sync.set({
            [filters[currentSite].storageName]: JSON.stringify(filters[currentSite].fillterWords)
        });

        //Update the list
        filterList.innerHTML = "";
        filters[currentSite].fillterWords.forEach((filter, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = filter;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.classList.add("delete-btn");

            //Delete the filter when clicked
            deleteBtn.addEventListener("click", () => {
                filters[currentSite].fillterWords.splice(index, 1);
                updateFilterList();
            });

            listItem.appendChild(deleteBtn);
            filterList.appendChild(listItem);
        });
    }
});

