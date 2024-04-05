import hash from '../utils/hash';

const fileNameFromDataUri = (uri: string) => hash(uri).toString().replace(/^-/, '') + '.' +
    uri.split(',')[0]
        .split(':')[1]
        .split('/')[1]
        .split('+')[0]
        .split(';')[0];

const fileNameFromUrl = (url: string) => url
    .substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"))
    .substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"))
    .substring(url.lastIndexOf("/") + 1, url.length)

const fileNameFrom = (url: string) => url.startsWith('data:') 
    ? fileNameFromDataUri(url) 
    : fileNameFromUrl(url);

const extensionFrom = (url: string) => {
    const splitFileName = fileNameFrom(url).split('.');

    if (splitFileName.length <= 1)
        return undefined
    
    return splitFileName.pop()
}

export { fileNameFrom, extensionFrom };