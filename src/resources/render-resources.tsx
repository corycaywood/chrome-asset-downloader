import React, { ReactNode, CSSProperties } from 'react';
import { Resources } from './resource/Resource';
import ResourceName from './resource/ResourceName';
import { fileNameFrom } from '../utils/urls';

function renderResources(name: ResourceName, resources: Resources, onDownloadClick: (url: string, fileName: string) => void): ReactNode[] {
    switch(name) {
        case ResourceName.stylesheets:
            return resources.stylesheets.map(stylesheet => renderStylesheet(stylesheet.url, onDownloadClick));
        case ResourceName.images:
            return resources.images.map(image => renderImage(image.url, onDownloadClick));
        case ResourceName.scripts:
            return resources.scripts.map(script => renderScript(script.url, onDownloadClick));
        case ResourceName.fonts:
            return resources.fonts.map(font => renderFont(font.url, onDownloadClick));
        default:
            return [<div></div>]
    }
}

const renderStylesheet = (url: string, onDownloadClick: (url: string, fileName: string) => void) => (
    <div>
        <div className="url"><a href={url} target="_blank">{url}</a></div>
        {renderDownloadLink(url, onDownloadClick)}
    </div>
)

const renderImage = (url: string, onDownloadClick: (url: string, fileName: string) => void) => (
    <div>
        <img src={url} />
        {renderDownloadLink(url, onDownloadClick)}
    </div>
)

const renderScript = (url: string, onDownloadClick: (url: string, fileName: string) => void) => (
    <div>
        <div className="url"><a href={url} target="_blank">{url}</a></div>
        {renderDownloadLink(url, onDownloadClick)}
    </div>
)

const renderFont = (url: string, onDownloadClick: (url: string, fileName: string) => void) => {
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
            {renderDownloadLink(url, onDownloadClick)}
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

export default renderResources;
