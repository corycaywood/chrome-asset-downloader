const HOST = 'https://*/*';

const requestHostPermission = async (origins: string[] = [HOST]) => {
    return await checkHostPermission(origins) || requestPermission(origins);
}

const checkHostPermission = (origins: string[] = [HOST]) => new Promise<boolean>(resolve => {
    chrome.permissions.contains({ origins }, (result) => resolve(result));
})

const requestPermission = (origins: string[]) => new Promise<boolean>(resolve => {
    chrome.permissions.request({ origins }, (result) => resolve(result));
})

export {
    checkHostPermission,
    requestHostPermission
};
