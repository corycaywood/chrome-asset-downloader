const requestHostPermission = async (origins: string[] = ['https://*/*']) => {
    return await checkPermission(origins) || requestPermission(origins);
}

const checkPermission = (origins: string[]) => new Promise(resolve => {
    chrome.permissions.contains({ origins }, (result) => resolve(result));
})

const requestPermission = (origins: string[]) => new Promise(resolve => {
    chrome.permissions.request({ origins }, (result) => resolve(result));
})

export default requestHostPermission;
