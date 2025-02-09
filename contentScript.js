//Main script that runs on the loaded page
(() => {
    chrome.runtime.onMessage.addListener((commandProp, sender, response) => {
        const { type, site } = commandProp;

        if (type === "FILTER") {
            console.log("Filter site: " + site);
        } else if (type == "DEFAULT") {
            console.log("This site is not supported");
        }
    });

})();
