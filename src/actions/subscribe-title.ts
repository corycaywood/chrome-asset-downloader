const getTitle = async (id: number) => {
    const tab = await chrome.tabs.get(chrome.devtools.inspectedWindow.tabId);
    return tab.title;
}

export default async function subscribeTitle(callback: (title?: string) => void) : Promise<void> {
    const tabId = chrome.devtools.inspectedWindow.tabId;
    chrome.tabs.onUpdated.addListener(async (updatedTabId: number) => {
        if (updatedTabId === tabId) {
            callback(await getTitle(tabId));
        }
    });
    
    callback(await getTitle(tabId));
}
