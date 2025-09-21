let whitelist = [];

const loadWhitelist = () => {
    chrome.storage.local.get(["whitelist"], result => {
    whitelist = result.whitelist || [];
    whitelist.forEach(site => console.log(site));
    });
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area == "local" && changes.whitelist) {
        whitelist = changes.whitelist.newValue || [];
        console.log("Whitelist changed: " + whitelist);
    }
});

const logSite = domain => {
    const time = Date.now();
    chrome.storage.local.get(["logs"], result => {
        const logs = result.logs || [];
        logs.push({ domain: domain || "Unknown site", time });
        chrome.storage.local.set({logs});
    })
}

const isWhiteListed = url => {
    try {
        const domain = new URL(url).hostname;
        return whitelist.some(site => domain.includes(site));
    } catch (e) {
        return false;
    }
}

setInterval(() => {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, (tabs) => {
      if (tabs[0] && tabs[0].url != undefined && (isWhiteListed(tabs[0].url) || whitelist.length == 0)) {
        const domain = new URL(tabs[0].url).hostname;
        logSite(domain);
        console.log(domain + " logged.");
      }
    });
}, 6000);

console.log("HELLO!!!!!!");