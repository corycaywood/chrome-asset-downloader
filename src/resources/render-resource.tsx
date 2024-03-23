import React, { ReactNode, CSSProperties } from 'react';
import { Resources } from './resource/Resource';
import ResourceName from './resource/ResourceName';

const renderStylesheet = (url: string) => (
    <div className="url"><a href={url} target="_blank">{url}</a></div>
)
const renderImage = (url: string) => (
    <img src={url} />
)
const renderScript = (url: string) => (
    <div className="url"><a href={url} target="_blank">{url}</a></div>
)
const renderFont = (url: string) => {
    const fontName = `font-${fileNameFrom(url).split('.')[0]}`
    const style: CSSProperties = {
        fontFamily: fontName
    }
    return (
        <div>
            <style>
                {`@font-face {
                    font-family: ${fontName};
                    src: url(${url})
                }`}
            </style>
            <div className="font-example" style={style}>Grumpy wizards make toxic brew for the evil Queen and Jack.</div>
        </div>
    )
}

const renderDownloadLink = (url: string, onDownloadClick: (url: string, fileName: string) => void) => {
    const fileName = fileNameFrom(url)
    return (
        <div className="url">
            {fileName} - <a title={url} href={url} onClick={(e) => {e.preventDefault(); onDownloadClick(url, fileName)}}>Download</a>
        </div>
    );
}

function fileNameFrom(url: string) {
    url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
    url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
    url = url.substring(url.lastIndexOf("/") + 1, url.length);
    return url;
}

function renderResource(name: ResourceName, resources: Resources, onDownloadClick: (url: string, fileName: string) => void): ReactNode[] {
    switch(name) {
        case ResourceName.stylesheets:
            return resources.stylesheets.map(stylesheet => [renderStylesheet(stylesheet.url), renderDownloadLink(stylesheet.url, onDownloadClick)]);
        case ResourceName.images:
            return resources.images.map(image => [renderImage(image.url), renderDownloadLink(image.url, onDownloadClick)]);
        case ResourceName.scripts:
            return resources.scripts.map(script => [renderScript(script.url), renderDownloadLink(script.url, onDownloadClick)]);
        case ResourceName.fonts:
            return resources.fonts.map(font => [renderFont(font.url), renderDownloadLink(font.url, onDownloadClick)]);
        default:
            return [<div></div>]
    }
}

export default renderResource;
