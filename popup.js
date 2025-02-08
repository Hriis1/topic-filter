//Script that runs on the popup html page

import * as Utils from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const filterTitle = document.getElementById("filter-title");
  const filterInput = document.getElementById("filter-input");
  const addFilterBtn = document.getElementById("add-filter");
  const filterList = document.getElementById("filter-list");
  const tabButtons = document.querySelectorAll(".tab-button");

  let currentSite = "Reddit";
  let filters = { Reddit: [], Facebook: [], YouTube: [] };

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
      filters[currentSite].push(filterText);
      filterInput.value = "";
      updateFilterList();
    }
  });

  // Update filter list
  function updateFilterList() {
    filterList.innerHTML = "";
    filters[currentSite].forEach((filter, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = filter;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", () => {
        filters[currentSite].splice(index, 1);
        updateFilterList();
      });

      listItem.appendChild(deleteBtn);
      filterList.appendChild(listItem);
    });
  }
});

