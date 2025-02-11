//Script that runs on the popup html page

import * as Utils from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const filterTitle = document.getElementById("filter-title");
    const filterInput = document.getElementById("filter-input");
    const addFilterBtn = document.getElementById("add-filter");
    const filterList = document.getElementById("filter-list");
    const tabButtons = document.querySelectorAll(".tab-button");
    const toggleSwitch = document.getElementById("filter-toggle");

    //Get the active tab
    const activeTab = await Utils.getActiveTab();

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
    await updateFilterList();

    // Load saved toggle state and send 
    chrome.storage.sync.get(["filterEnabled"], (data) => {
        if (data.filterEnabled !== undefined) {
            toggleSwitch.checked = data.filterEnabled;
        }
    });

    //When filter/unfilter switch is toggled
    toggleSwitch.addEventListener("change", async () => {

        //Store state
        chrome.storage.sync.set({ filterEnabled: toggleSwitch.checked });

        //Send a filter/unfilter command if site is supported
        const filterVal = toggleSwitch.checked ? 1 : 0; //1 - filter, 0 - unfilter
        Utils.sendFilterCommand(activeTab, filterVal);
    });

    // Change tab
    tabButtons.forEach(button => {
        button.addEventListener("click", async () => {
            currentSite = button.dataset.site;
            filterTitle.textContent = `Filters for ${currentSite}`;
            await updateFilterList();
        });
    });

    // Add filter
    addFilterBtn.addEventListener("click", async () => {
        const filterText = filterInput.value.trim().toLowerCase(); //trim the text and transform it to lower case
        if (filterText) {
            filters[currentSite].fillterWords.push(filterText);
            filterInput.value = "";
            await updateFilterList();
            if (toggleSwitch.checked) { //send a filter command if filtering is on
                Utils.sendFilterCommand(activeTab, 1);
            }
        }
    });

    // Update filter list
    async function updateFilterList() {
        //Sort the array of the curretn site
        filters[currentSite].fillterWords.sort();

        //Store current filters to chrome
        await chrome.storage.sync.set({
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
            deleteBtn.addEventListener("click", async () => {
                filters[currentSite].fillterWords.splice(index, 1);
                await updateFilterList();

                if (toggleSwitch.checked) { //send a filter command if filtering is on
                    Utils.sendFilterCommand(activeTab, 0); //First send unfilter command
                    Utils.sendFilterCommand(activeTab, 1); //Then send a filter command without the deleted element
                }
            });

            listItem.appendChild(deleteBtn);
            filterList.appendChild(listItem);
        });
    }
});

