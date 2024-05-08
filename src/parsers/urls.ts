import hash from '../utils/hash';

const fileNameFromDataUri = (uri: string) => hash(uri).toString().replace(/^-/, '') + '.' +
    uri.split(',')[0]
        .split(':')[1]
        .split('/')[1]
        .split('+')[0]
        .split(';')[0];

const fileNameFromUrl = (url: string) => url
    .substring(url.lastIndexOf("/") + 1, url.length)
    .also(it => removeQueryParam(it))
    .also(it => removeFragmentParam(it))

const fileNameFrom = (url: string) => url.startsWith('data:') 
    ? fileNameFromDataUri(url) 
    : fileNameFromUrl(url);

const extensionFrom = (url: string) => {
    const splitFileName = fileNameFrom(url).split('.');

    if (splitFileName.length <= 1)
        return undefined
    
    return splitFileName.pop()
}

const removeQueryParam = (url: string) => url
    .substring(0, lastIndexOrLength(url, '?'));

const removeFragmentParam = (url: string) => url
    .substring(0, lastIndexOrLength(url, '#'));

const lastIndexOrLength = (text: string, search: string) => text.lastIndexOf(search) != -1 
    ? text.lastIndexOf(search)
    : text.length;

declare global {
    interface String {
        also: (fun: (it: string) => string) => string
    }
}
function also(this: string, fun: (it: string) => string) : string {
    return fun(this);
}
String.prototype.also = also;

export { fileNameFrom, extensionFrom };
