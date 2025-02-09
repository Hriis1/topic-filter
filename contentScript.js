//Main script that runs on the loaded page
(() => {
    chrome.runtime.onMessage.addListener((commandProp, sender, response) => {
        const { type, site, filterAction } = commandProp;

        if (type === "FILTER") {
            if (filterAction == 1)
                console.log("Filter site: " + site);
            else if (filterAction == 0)
                console.log("Unfilter site: " + site);

        }
    });

})();
