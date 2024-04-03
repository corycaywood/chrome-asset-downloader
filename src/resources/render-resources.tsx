import React, { ReactNode, CSSProperties } from 'react';

import { Resources, StylesheetResource } from './resource/Resource';
import ResourceName from './resource/ResourceName';
import Stylesheet from './stylesheet/Stylesheet';
import { fileNameFrom } from '../parsers/urls';
import DownloadableUrl from '../DownloadableUrl';

function renderResources(
    name: ResourceName,
    resources: Resources,
    onDownload: (url: string, fileName: string) => void,
    onDownloadAll: (urls: DownloadableUrl[]) => void
): ReactNode[] {
    switch(name) {
        case ResourceName.stylesheets:
            return resources.stylesheets.map(stylesheet => renderStylesheet(stylesheet, onDownload, onDownloadAll));
        case ResourceName.images:
            return resources.images.map(image => renderImage(image.url, onDownload));
        case ResourceName.scripts:
            return resources.scripts.map(script => renderScript(script.url, onDownload));
        case ResourceName.fonts:
            return resources.fonts.map(font => renderFont(font.url, onDownload));
        default:
            return [<div></div>]
    }
}

const renderStylesheet = (
    stylesheet: StylesheetResource, 
    onDownload: (url: string, fileName: string) => void, 
    onDownloadAll: (urls: DownloadableUrl[]) => void
) => (
    <Stylesheet
        stylesheet={stylesheet}
        downloadLink={renderDownloadLink(stylesheet.url, onDownload)}
        onClickDownload={onDownloadAll}
    />
)

const renderImage = (url: string, onDownload: (url: string, fileName: string) => void) => (
    <div>
        <img src={url} />
        {renderDownloadLink(url, onDownload)}
    </div>
)

const renderScript = (url: string, onDownload: (url: string, fileName: string) => void) => (
    <div>
        <div className="url"><a href={url} target="_blank">{url}</a></div>
        {renderDownloadLink(url, onDownload)}
    </div>
)

const renderFont = (url: string, onDownload: (url: string, fileName: string) => void) => {
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
            {renderDownloadLink(url, onDownload)}
        </div>
    )
}

const renderDownloadLink = (url: string, onDownload: (url: string, fileName: string) => void) => {
    const fileName = fileNameFrom(url)
    return (
        <div className="url">
            {fileName} - <a title={url} href={url} onClick={(e) => {e.preventDefault(); onDownload(url, fileName)}}>Download</a>
        </div>
    );
}

export default renderResources;
