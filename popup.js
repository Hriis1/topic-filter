//Script that runs on the popup html page

import * as Utils from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    const filterTitle = document.getElementById("filter-title");
    const filterInput = document.getElementById("filter-input");
    const addFilterBtn = document.getElementById("add-filter");
    const filterList = document.getElementById("filter-list");
    const tabButtons = document.querySelectorAll(".tab-button");

    let currentSite = "Reddit";
    let filters = {
        Reddit: {
            storageName: "rdFiltersStorage",
            fillterWords: []
        },
        Facebook: {
            storageName: "fbFiltersStorage",
            fillterWords: []
        },
        YouTube: {
            storageName: "ytFiltersStorage",
            fillterWords: []
        },
    };

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

