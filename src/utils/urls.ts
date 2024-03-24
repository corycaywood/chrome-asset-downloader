const fileNameFromDataUri = (uri: string) => uri.split(',')[1].substring(0, 9) + '.' +
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


export { fileNameFrom };