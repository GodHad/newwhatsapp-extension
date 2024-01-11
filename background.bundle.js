// editar
const panelUrl = getProdUrl();
var hasUpdate = false;

function getProdUrl() {
    if (chrome.runtime.getManifest()) {
        return chrome.runtime.getManifest().content_scripts[0].matches[0].replace('/*', '').replace('apiexpress', 'panelexpress').replace('api', 'panel');
    }
}

function getDevUrl() {
    return 'http://localhost:8081'
}

if (chrome.runtime.setUninstallURL) {
    let timestamp = new Date().getTime() / 1000 | 0;
    chrome.runtime.setUninstallURL(`${panelUrl}/update/?oninstalledreason=uninstall&ts=${timestamp}`);
};

chrome.runtime.onInstalled.addListener(function (details) {

    if (details.reason == chrome.runtime.OnInstalledReason.INSTALL) {

        chrome.tabs.query({}, (tabs) => {
            var existChat = false;

            tabs.forEach((tab) => {
                if (tab.url.includes("https://web.whatsapp.com/")) {
                    chrome.tabs.update(tab.id, { url: tab.url });
                }

                if (tab.url.includes("/update/")) {
                    let timestamp = new Date().getTime() / 1000 | 0;
                    chrome.tabs.update(tab.id, { url: tab.url + '?oninstalledreason=install&ts=' + timestamp });
                    existChat = true;
                }
            });

            if (!existChat) {
                let timestamp = new Date().getTime() / 1000 | 0;
                chrome.tabs.create({ url: `${panelUrl}/update/?oninstalledreason=install&ts=${timestamp}` });
            }
        });
    }

    if (details.reason == chrome.runtime.OnInstalledReason.UPDATE) {
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                if (tab.url.includes("https://web.whatsapp.com/")) {
                    chrome.tabs.update(tab.id, { url: tab.url });
                    hasUpdate = true;
                }
            });
        });
    }
});

var retries = 0;
var interval = setInterval(() => {
    if (hasUpdate) {
        clearInterval(interval)
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                if (tab.url.includes("https://web.whatsapp.com/")) {
                    chrome.tabs.sendMessage(tab.id, { type: 'wacore_new_update' });
                }
            });
        });
    }

    if (retries > 5)
        clearInterval(interval)

    retries++;
}, 5000);