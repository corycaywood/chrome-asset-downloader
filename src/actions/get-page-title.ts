export default async function getPageTitle() {
    const tab = await chrome.tabs.get(chrome.devtools.inspectedWindow.tabId);
    return tab.title;
}
