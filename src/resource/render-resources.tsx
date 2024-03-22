import React, { ReactNode } from 'react';
import { Resources, FontResource } from './Resource'
import ResourceName from './ResourceName'

const renderStylesheet = (url: string) => (
    <div className="url"><a href={url} target="_blank">{url}</a></div>
)
const renderImage = (url: string) => (
    <img src={url} />
)
const renderScript = (url: string) => (
    <div className="url"><a href={url} target="_blank">{url}</a></div>
)
const renderFont = (url: string, dataUri: string) => (
    <div>
        {/* <style>
            {".class-{{assets.getFileName(item.url).split('.')[0]}} {" +
                "font-family: font{{assets.getFileName(item.url).split('.')[0]}};" +
            "}"
            @font-face {
                font-family: font{{assets.getFileName(item.url).split('.')[0]}};
                src: url({{item.dataUri}})
            }"}
        </style>
        <div className='font-example' ng-className="'class-' + assets.getFileName(item.url).split('.')[0]">Grumpy wizards make toxic brew for the evil Queen and Jack.</div> */}
    </div>
)

const renderDownloadLink = (url: string, onClickDownload: () => void) => (
    <div className="url">
        {fileNameFrom(url)} - <a onClick={onClickDownload} title={url} href={url}>Download</a>
    </div>
)

function fileNameFrom(url: string) {
    url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
    url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
    url = url.substring(url.lastIndexOf("/") + 1, url.length);
    return url;
}

function renderResources(name: ResourceName, resources: Resources, onClickDownload: () => void): ReactNode[] {
    switch(name) {
        case ResourceName.stylesheets:
            return resources.stylesheets.map(stylesheet => [renderScript(stylesheet.url), renderDownloadLink(stylesheet.url, onClickDownload)]);
        case ResourceName.images:
            return resources.images.map(image => [renderImage(image.url), renderDownloadLink(image.url, onClickDownload)]);
        case ResourceName.scripts:
            return resources.scripts.map(script => [renderScript(script.url), renderDownloadLink(script.url, onClickDownload)]);
        case ResourceName.fonts:
            return resources.fonts.map(font => [renderFont(font.url, font.dataUri), renderDownloadLink(font.url, onClickDownload)]);
        default:
            return [<div></div>]
    }
}

export default renderResources;
